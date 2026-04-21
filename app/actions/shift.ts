"use server";

import { z } from "zod";
import { authAction } from "@/lib/safe-action";
import { db } from "@/db";
import { shifts, transactions, users } from "@/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const openShiftSchema = z.object({
  startingCash: z.number().default(0),
});

export const openShift = authAction(openShiftSchema, async (data, ctx) => {
  // Check if there's already an open shift for this user
  const [existingShift] = await db
    .select()
    .from(shifts)
    .where(
      and(
        eq(shifts.tenantId, ctx.tenantId),
        eq(shifts.userId, ctx.userId),
        eq(shifts.status, "OPEN")
      )
    )
    .limit(1);

  if (existingShift) {
    throw new Error("You already have an open shift.");
  }

  const [newShift] = await db
    .insert(shifts)
    .values({
      tenantId: ctx.tenantId,
      userId: ctx.userId,
      startingCash: data.startingCash.toString(),
      status: "OPEN",
    })
    .returning();

  revalidatePath("/kasir");
  return { success: true, shiftId: newShift.id };
});

const closeShiftSchema = z.object({
  shiftId: z.number(),
  actualCash: z.number().optional(),
  notes: z.string().optional(),
});

export const closeShift = authAction(closeShiftSchema, async (data, ctx) => {
  const [shift] = await db
    .select()
    .from(shifts)
    .where(
      and(
        eq(shifts.id, data.shiftId),
        eq(shifts.tenantId, ctx.tenantId),
        eq(shifts.status, "OPEN")
      )
    )
    .limit(1);

  if (!shift) {
    throw new Error("Shift not found or already closed.");
  }

  // Calculate actualCash if not provided (Automated Mode)
  const finalActualCash = data.actualCash !== undefined 
    ? data.actualCash 
    : Math.round(Number(shift.startingCash || 0) + Number(shift.totalSalesCash || 0));

  await db
    .update(shifts)
    .set({
      endTime: new Date(),
      actualCash: finalActualCash.toString(),
      notes: data.notes,
      status: "CLOSED",
    })
    .where(eq(shifts.id, data.shiftId));

  revalidatePath("/kasir");
  revalidatePath("/admin/reports/shifts");
  return { success: true };
});

export const getActiveShift = authAction(z.object({}), async (_, ctx) => {
  const [shift] = await db
    .select()
    .from(shifts)
    .where(
      and(
        eq(shifts.tenantId, ctx.tenantId),
        eq(shifts.userId, ctx.userId),
        eq(shifts.status, "OPEN")
      )
    )
    .limit(1);

  return shift || null;
});

const updateShiftAdminSchema = z.object({
  shiftId: z.number(),
  startingCash: z.number().optional(),
  actualCash: z.number().optional(),
  notes: z.string().optional(),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
});

export const updateShiftAdmin = authAction(updateShiftAdminSchema, async (data, ctx) => {
  const updateData: any = {};
  if (data.startingCash !== undefined) updateData.startingCash = data.startingCash.toString();
  if (data.actualCash !== undefined) updateData.actualCash = data.actualCash.toString();
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.status !== undefined) {
    updateData.status = data.status;
    if (data.status === "CLOSED") {
      updateData.endTime = new Date();
    }
  }

  await db
    .update(shifts)
    .set(updateData)
    .where(
      and(
        eq(shifts.id, data.shiftId),
        eq(shifts.tenantId, ctx.tenantId)
      )
    );

  revalidatePath("/kasir");
  revalidatePath("/admin/shifts");
  revalidatePath("/admin/users");
  return { success: true };
});

export const getShiftDetails = authAction(z.number(), async (shiftId, ctx) => {
  const [shift] = await db
    .select({
      id: shifts.id,
      status: shifts.status,
      startTime: shifts.startTime,
      endTime: shifts.endTime,
      startingCash: shifts.startingCash,
      totalSalesCash: shifts.totalSalesCash,
      actualCash: shifts.actualCash,
      notes: shifts.notes,
      userName: users.name,
    })
    .from(shifts)
    .leftJoin(users, eq(shifts.userId, users.id))
    .where(
      and(
        eq(shifts.id, shiftId),
        eq(shifts.tenantId, ctx.tenantId)
      )
    )
    .limit(1);

  if (!shift) {
    throw new Error("Shift not found.");
  }

  const shiftTransactions = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.shiftId, shiftId),
        eq(transactions.tenantId, ctx.tenantId)
      )
    )
    .orderBy(desc(transactions.createdAt))
    .limit(50); // Limit log to last 50 transactions

  return { 
    success: true, 
    data: {
      ...shift,
      transactions: shiftTransactions
    } 
  };
});

export const closeShiftByAdmin = authAction(z.number(), async (shiftId, ctx) => {
  if (ctx.role !== "ADMIN") {
    throw new Error("Only administrators can force close shifts.");
  }

  const [shift] = await db
    .select()
    .from(shifts)
    .where(
      and(
        eq(shifts.id, shiftId),
        eq(shifts.tenantId, ctx.tenantId)
      )
    )
    .limit(1);

  if (!shift) {
      throw new Error("Shift not found.");
  }

  // Force close logic: calculate current expected cash if closing manually
  const expectedCash = Number(shift.startingCash || 0) + Number(shift.totalSalesCash || 0);

  await db
    .update(shifts)
    .set({
      status: "CLOSED",
      endTime: new Date(),
      actualCash: expectedCash.toString(),
      notes: (shift.notes || "") + " [FORCE CLOSED BY ADMIN]",
    })
    .where(eq(shifts.id, shiftId));

  revalidatePath("/kasir");
  revalidatePath("/admin/shifts");
  revalidatePath("/admin/reports/shifts");
  revalidatePath("/admin/users");
  
  return { success: true };
});

