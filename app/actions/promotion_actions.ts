"use server";

import { db } from "@/db";
import { promotions } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Gets all promotions for the current tenant.
 */
export async function getPromotions() {
  const session = await auth();
  const tenantId = (session?.user as any)?.tenantId;

  if (!tenantId) {
    throw new Error("Unauthorized: No tenant context");
  }

  try {
    const data = await db
      .select()
      .from(promotions)
      .where(eq(promotions.tenantId, tenantId))
      .orderBy(desc(promotions.createdAt));
    
    // Convert decimal strings to numbers for easier consumption in components
    return data.map(promo => ({
      ...promo,
      value: Number(promo.value),
      minOrder: Number(promo.minOrder),
      maxDiscount: promo.maxDiscount ? Number(promo.maxDiscount) : null,
    }));
  } catch (error) {
    console.error("Failed to fetch promotions:", error);
    return [];
  }
}

/**
 * Creates a new promotion.
 */
export async function createPromotion(data: any) {
  const session = await auth();
  const tenantId = (session?.user as any)?.tenantId;

  if (!tenantId) {
    throw new Error("Unauthorized");
  }

  try {
    await db.insert(promotions).values({
      tenantId,
      name: data.name,
      code: data.code.toUpperCase(),
      type: data.type,
      value: data.value.toString(),
      minOrder: (data.minOrder || 0).toString(),
      maxDiscount: data.maxDiscount ? data.maxDiscount.toString() : null,
      quota: parseInt(data.quota),
      expiry: new Date(data.expiry),
      active: data.active ?? true,
    });

    revalidatePath("/admin/promotions");
    return { success: true };
  } catch (error) {
    console.error("Failed to create promotion:", error);
    return { success: false, error: "Gagal membuat voucher. Pastikan kode unik." };
  }
}

/**
 * Updates an existing promotion.
 */
export async function updatePromotion(id: number, data: any) {
  const session = await auth();
  const tenantId = (session?.user as any)?.tenantId;

  if (!tenantId) {
    throw new Error("Unauthorized");
  }

  try {
    await db
      .update(promotions)
      .set({
        name: data.name,
        code: data.code.toUpperCase(),
        type: data.type,
        value: data.value.toString(),
        minOrder: (data.minOrder || 0).toString(),
        maxDiscount: data.maxDiscount ? data.maxDiscount.toString() : null,
        quota: parseInt(data.quota),
        expiry: new Date(data.expiry),
        active: data.active,
        updatedAt: new Date(),
      })
      .where(and(eq(promotions.id, id), eq(promotions.tenantId, tenantId)));

    revalidatePath("/admin/promotions");
    return { success: true };
  } catch (error) {
    console.error("Failed to update promotion:", error);
    return { success: false, error: "Gagal memperbarui voucher." };
  }
}

/**
 * Deletes a promotion.
 */
export async function deletePromotion(id: number) {
  const session = await auth();
  const tenantId = (session?.user as any)?.tenantId;

  if (!tenantId) {
    throw new Error("Unauthorized");
  }

  try {
    await db
      .delete(promotions)
      .where(and(eq(promotions.id, id), eq(promotions.tenantId, tenantId)));

    revalidatePath("/admin/promotions");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete promotion:", error);
    return { success: false, error: "Gagal menghapus voucher." };
  }
}

/**
 * Toggles a promotion's active status.
 */
export async function togglePromotionStatus(id: number, currentStatus: boolean) {
  const session = await auth();
  const tenantId = (session?.user as any)?.tenantId;

  if (!tenantId) {
    throw new Error("Unauthorized");
  }

  try {
    await db
      .update(promotions)
      .set({
        active: !currentStatus,
        updatedAt: new Date(),
      })
      .where(and(eq(promotions.id, id), eq(promotions.tenantId, tenantId)));

    revalidatePath("/admin/promotions");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle promotion status:", error);
    return { success: false, error: "Gagal mengubah status voucher." };
  }
}
