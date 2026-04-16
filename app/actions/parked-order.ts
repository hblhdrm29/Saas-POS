"use server";

import { z } from "zod";
import { authAction } from "@/lib/safe-action";
import { db } from "@/db";
import { parkedOrders, parkedOrderItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const parkOrderSchema = z.object({
  customerName: z.string().optional(),
  items: z.array(
    z.object({
      id: z.number(),
      quantity: z.number(),
      price: z.number(),
    })
  ),
  totalAmount: z.number(),
  notes: z.string().optional(),
});

export const parkOrder = authAction(parkOrderSchema, async (data, ctx) => {
  return await db.transaction(async (tx) => {
    const [newParkedOrder] = await tx
      .insert(parkedOrders)
      .values({
        tenantId: ctx.tenantId,
        userId: ctx.userId,
        customerName: data.customerName,
        totalAmount: data.totalAmount.toString(),
        notes: data.notes,
      })
      .returning();

    for (const item of data.items) {
      await tx.insert(parkedOrderItems).values({
        tenantId: ctx.tenantId,
        parkedOrderId: newParkedOrder.id,
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price.toString(),
      });
    }

    revalidatePath("/kasir");
    return { success: true, parkedOrderId: newParkedOrder.id };
  });
});

export const getParkedOrders = authAction(z.object({}), async (_, ctx) => {
  const results = await db
    .select()
    .from(parkedOrders)
    .where(
      and(
        eq(parkedOrders.tenantId, ctx.tenantId),
        eq(parkedOrders.userId, ctx.userId)
      )
    );
  return results;
});

export const recallParkedOrder = authAction(z.object({ parkedOrderId: z.number() }), async (data, ctx) => {
  return await db.transaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(parkedOrders)
      .where(
        and(
          eq(parkedOrders.id, data.parkedOrderId),
          eq(parkedOrders.tenantId, ctx.tenantId)
        )
      )
      .limit(1);

    if (!order) throw new Error("Parked order not found.");

    const items = await tx
      .select()
      .from(parkedOrderItems)
      .where(eq(parkedOrderItems.parkedOrderId, data.parkedOrderId));

    // Delete after recall
    await tx.delete(parkedOrders).where(eq(parkedOrders.id, data.parkedOrderId));

    revalidatePath("/kasir");
    return { order, items };
  });
});

export const deleteParkedOrder = authAction(z.object({ parkedOrderId: z.number() }), async (data, ctx) => {
  const [deleted] = await db
    .delete(parkedOrders)
    .where(
        and(
            eq(parkedOrders.id, data.parkedOrderId),
            eq(parkedOrders.tenantId, ctx.tenantId)
        )
    )
    .returning();

  if (!deleted) throw new Error("Parked order not found or unauthorized.");

  revalidatePath("/kasir");
  return { success: true };
});
