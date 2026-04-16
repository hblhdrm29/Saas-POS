"use server";

import { z } from "zod";
import { authAction } from "@/lib/safe-action";
import { db } from "@/db";
import { shifts } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const openShiftSchema = z.object({});

export const openShift = authAction(openShiftSchema, async (_, ctx) => {
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
      startingCash: "0",
      status: "OPEN",
    })
    .returning();

  revalidatePath("/kasir");
  return { success: true, shiftId: newShift.id };
});

const closeShiftSchema = z.object({
  shiftId: z.number(),
  actualCash: z.number(),
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

  await db
    .update(shifts)
    .set({
      endTime: new Date(),
      actualCash: data.actualCash.toString(),
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
