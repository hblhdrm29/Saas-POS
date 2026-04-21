"use server";

import { z } from "zod";
import { authAction } from "@/lib/safe-action";
import { db } from "@/db";
import { transactions, transactionItems, products, shifts, stockLogs, voidLogs, users, parkedOrders } from "@/db/schema";
import { eq, and, sql, desc, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const checkoutSchema = z.object({
  orderId: z.number().optional().nullable(),
  paymentMethod: z.string(),
  shiftId: z.number().optional().nullable(),
  items: z.array(
    z.object({
      id: z.number(),
      quantity: z.number(),
      price: z.number(),
      discountAmount: z.number().default(0),
    })
  ),
  subtotal: z.number(),
  discountAmount: z.number().default(0),
  taxAmount: z.number().default(0),
  totalAmount: z.number(),
});

export const processCheckout = authAction(checkoutSchema, async (data, ctx) => {
  return await db.transaction(async (tx) => {
    // 0. Determine attribution (Shift Owner vs Current User)
    let attributionUserId = ctx.userId;
    if (data.shiftId) {
        const [shift] = await tx
            .select({ userId: shifts.userId })
            .from(shifts)
            .where(eq(shifts.id, data.shiftId))
            .limit(1);
        
        if (shift) {
            attributionUserId = shift.userId;
        }
    }

    // 1. Create Transaction header
    const [newTransaction] = await tx
      .insert(transactions)
      .values({
        id: data.orderId || undefined,
        tenantId: ctx.tenantId,
        userId: attributionUserId,
        shiftId: data.shiftId,
        subtotal: data.subtotal.toString(),
        discountAmount: data.discountAmount.toString(),
        taxAmount: data.taxAmount.toString(),
        totalAmount: data.totalAmount.toString(),
        paymentMethod: data.paymentMethod,
        status: "COMPLETED",
      })
      .returning();

    // 1b. If it was a parked order, delete it and recalibrate sequence
    if (data.orderId) {
        await tx.delete(parkedOrders).where(eq(parkedOrders.id, data.orderId));
        
        // Recalibrate sequence to avoid serial conflicts
        await tx.execute(sql`SELECT setval('transactions_id_seq', (SELECT MAX(id) FROM transactions))`);
    }

    // 2. Process Line Items and Update Stock
    for (const item of data.items) {
      await tx.insert(transactionItems).values({
        tenantId: ctx.tenantId,
        transactionId: newTransaction.id,
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price.toString(),
        discountAmount: item.discountAmount.toString(),
        subtotal: ((item.quantity * item.price) - item.discountAmount).toString(),
      });

      // Update product stock (decrement)
      await tx
        .update(products)
        .set({
          stock: sql`${products.stock} - ${item.quantity}`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(products.id, item.id),
            eq(products.tenantId, ctx.tenantId)
          )
        );

      // Log stock movement
      await tx.insert(stockLogs).values({
        tenantId: ctx.tenantId,
        productId: item.id,
        type: "REDUCED",
        quantity: item.quantity,
        referenceId: `TRX-${newTransaction.id}`,
        notes: "Sales via POS",
        userId: ctx.userId,
      });
    }

    // 3. Update Shift Total Sales (if cash)
    if (data.paymentMethod === "CASH" && data.shiftId) {
        await tx
            .update(shifts)
            .set({
                totalSalesCash: sql`${shifts.totalSalesCash} + ${data.totalAmount.toString()}`
            })
            .where(eq(shifts.id, data.shiftId));
    }

    revalidatePath("/kasir");
    revalidatePath("/admin/transactions");
    revalidatePath("/admin/products");

    return { transactionId: newTransaction.id };
  });
});

const voidSchema = z.object({
    transactionId: z.number(),
    reason: z.string().min(3),
});

export const voidTransaction = authAction(voidSchema, async (data, ctx) => {
    return await db.transaction(async (tx) => {
        const [transaction] = await tx
            .select()
            .from(transactions)
            .where(
                and(
                    eq(transactions.id, data.transactionId),
                    eq(transactions.tenantId, ctx.tenantId)
                )
            )
            .limit(1);

        if (!transaction || transaction.status === "VOID") {
            throw new Error("Transaction not found or already voided.");
        }

        // Update status to VOID
        await tx
            .update(transactions)
            .set({ status: "VOID" })
            .where(eq(transactions.id, data.transactionId));

        // Get items to restore stock
        const items = await tx
            .select()
            .from(transactionItems)
            .where(eq(transactionItems.transactionId, data.transactionId));

        for (const item of items) {
            if (item.productId) {
                await tx
                    .update(products)
                    .set({ stock: sql`${products.stock} + ${item.quantity}` })
                    .where(eq(products.id, item.productId));

                // Log stock restore
                await tx.insert(stockLogs).values({
                    tenantId: ctx.tenantId,
                    productId: item.productId,
                    type: "VOID",
                    quantity: item.quantity,
                    referenceId: `VOID-${data.transactionId}`,
                    notes: `System Void: ${data.reason}`,
                    userId: ctx.userId,
                });
            }
        }

        // If shift was linked and was cash, deduct from shift total
        if (transaction.paymentMethod === "CASH" && transaction.shiftId) {
            await tx
                .update(shifts)
                .set({ totalSalesCash: sql`${shifts.totalSalesCash} - ${transaction.totalAmount}` })
                .where(eq(shifts.id, transaction.shiftId));
        }

        // Create log entry
        await tx.insert(voidLogs).values({
            tenantId: ctx.tenantId,
            transactionId: data.transactionId,
            reason: data.reason,
            userId: ctx.userId,
        });

        revalidatePath("/kasir");
        revalidatePath("/admin/transactions");
        return { success: true };
    });
});

/**
 * Fetch all transactions for the admin list
 */
export const getTransactions = authAction(
    z.object({
        paymentMethod: z.string().optional(),
        search: z.string().optional(),
        date: z.string().optional(),
    }),
    async (data, ctx) => {
        let dateFilter = undefined;

        if (data.date) {
            const [year, month, day] = data.date.split('-').map(Number);
            const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
            const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
            dateFilter = and(
                gte(transactions.createdAt, startOfDay),
                lte(transactions.createdAt, endOfDay)
            );
        }

        const query = db
            .select({
                id: transactions.id,
                totalAmount: transactions.totalAmount,
                paymentMethod: transactions.paymentMethod,
                status: transactions.status,
                createdAt: transactions.createdAt,
                staffName: users.name,
                staffRole: users.role,
            })
            .from(transactions)
            .leftJoin(users, eq(transactions.userId, users.id))
            .where(
                and(
                    eq(transactions.tenantId, ctx.tenantId),
                    dateFilter,
                    data.paymentMethod && data.paymentMethod !== "ALL" 
                        ? eq(transactions.paymentMethod, data.paymentMethod) 
                        : undefined,
                    data.search 
                        ? sql`${transactions.id}::text ILIKE ${`%${data.search}%`}` 
                        : undefined
                )
            )
            .orderBy(desc(transactions.createdAt));

        const results = await query;
        return results;
    }
);

/**
 * Fetch details for a specific transaction
 */
export const getTransactionItems = authAction(
    z.object({
        transactionId: z.number(),
    }),
    async (data, ctx) => {
        const items = await db
            .select({
                id: transactionItems.id,
                quantity: transactionItems.quantity,
                unitPrice: transactionItems.unitPrice,
                subtotal: transactionItems.subtotal,
                productName: products.name,
                productSku: products.sku,
            })
            .from(transactionItems)
            .leftJoin(products, eq(transactionItems.productId, products.id))
            .where(
                and(
                    eq(transactionItems.transactionId, data.transactionId),
                    eq(transactionItems.tenantId, ctx.tenantId)
                )
            );

        return items;
    }
);

export const deleteTransaction = authAction(
    z.object({
        transactionId: z.number(),
    }),
    async (data, ctx) => {
        // Only Admin usually allowed for archive deletion
        // Check ctx.user if necessary, but authAction already ensures session
        
        await db
            .delete(transactions)
            .where(
                and(
                    eq(transactions.id, data.transactionId),
                    eq(transactions.tenantId, ctx.tenantId)
                )
            );

        revalidatePath("/admin/transactions");
        return { success: true };
    }
);
