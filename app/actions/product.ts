"use server";

import { z } from "zod";
import { authAction } from "@/lib/safe-action";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const productSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  sku: z.string().min(2, "SKU is too short"),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  isActive: z.boolean().default(true),
});

export const createProduct = authAction(productSchema, async (data, ctx) => {
  // Enforce ADMIN role
  if (ctx.role !== "ADMIN") throw new Error("Forbidden");

  const [newProduct] = await db.insert(products).values({
    ...data,
    tenantId: ctx.tenantId, // Multi-tenant enforcement
    price: data.price.toString(), // DB expects string for decimal/numeric
  }).returning();

  revalidatePath("/admin/products");
  return newProduct;
});

const updateStockSchema = z.object({
  id: z.number(),
  newStock: z.coerce.number().min(0),
});

export const updateStock = authAction(updateStockSchema, async (data, ctx) => {
  if (ctx.role !== "ADMIN") throw new Error("Forbidden");

  // tenantId goes into where clause to strictly isolate tenants
  const [updated] = await db
    .update(products)
    .set({ stock: data.newStock, updatedAt: new Date() })
    .where(and(eq(products.id, data.id), eq(products.tenantId, ctx.tenantId)))
    .returning();

  if (!updated) {
    throw new Error("Product not found or unauthorized");
  }

  revalidatePath("/admin/products");
  return updated;
});
