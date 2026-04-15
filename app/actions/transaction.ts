"use server";

import { z } from "zod";
import { authAction } from "@/lib/safe-action";
import { db } from "@/db";
import { transactions, transactionItems, products } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const checkoutSchema = z.object({
  paymentMethod: z.string(),
  items: z.array(
    z.object({
      id: z.number(),
      quantity: z.number(),
      price: z.number(),
    })
  ),
  totalAmount: z.number(),
});

export const processCheckout = authAction(checkoutSchema, async (data, ctx) => {
  return await db.transaction(async (tx) => {
    // 1. Create Transaction header
    const [newTransaction] = await tx
      .insert(transactions)
      .values({
        tenantId: ctx.tenantId,
        userId: ctx.userId,
        totalAmount: data.totalAmount.toString(),
        paymentMethod: data.paymentMethod,
        status: "COMPLETED",
      })
      .returning();

    // 2. Process Line Items and Update Stock
    for (const item of data.items) {
      // Create line item
      await tx.insert(transactionItems).values({
        tenantId: ctx.tenantId,
        transactionId: newTransaction.id,
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price.toString(),
        subtotal: (item.quantity * item.price).toString(),
      });

      // Update product stock (decrement)
      // We use a where clause with tenantId for safety
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
    }

    revalidatePath("/kasir");
    revalidatePath("/admin/transactions");
    revalidatePath("/admin/products");

    return { transactionId: newTransaction.id };
  });
});
