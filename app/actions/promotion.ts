"use server";

import { z } from "zod";
import { authAction } from "@/lib/safe-action";
import { db } from "@/db";
import { promotions } from "@/db/schema";
import { eq, and, gt, gte, lte, or, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const promoSchema = z.object({
  code: z.string().min(1),
  type: z.enum(["PERCENTAGE", "NOMINAL"]),
  value: z.number().gt(0),
  minTransaction: z.number().default(0),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const createPromotion = authAction(promoSchema, async (data, ctx) => {
  const [newPromo] = await db
    .insert(promotions)
    .values({
      tenantId: ctx.tenantId,
      code: data.code.toUpperCase(),
      type: data.type,
      value: data.value.toString(),
      minTransaction: data.minTransaction.toString(),
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: true,
    })
    .returning();

  revalidatePath("/admin/promotions");
  return { success: true, promotion: newPromo };
});

export const validatePromoCode = authAction(
  z.object({ code: z.string(), subtotal: z.number() }),
  async (data, ctx) => {
    const now = new Date();
    const [promo] = await db
      .select()
      .from(promotions)
      .where(
        and(
          eq(promotions.tenantId, ctx.tenantId),
          eq(promotions.code, data.code.toUpperCase()),
          eq(promotions.isActive, true),
          lte(promotions.startDate, now),
          or(isNull(promotions.endDate), gte(promotions.endDate, now))
        )
      )
      .limit(1);

    if (!promo) {
      return { success: false, error: "Promo code invalid or expired." };
    }

    if (data.subtotal < Number(promo.minTransaction)) {
      return { 
        success: false, 
        error: `Minimum transaction for this promo is ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(promo.minTransaction))}` 
      };
    }

    return { success: true, promotion: promo };
  }
);
