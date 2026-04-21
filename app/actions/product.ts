"use server";

import { z } from "zod";
import { authAction } from "@/lib/safe-action";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, and, ilike, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
  
const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Name is too short"),
  sku: z.string().min(2, "SKU is too short"),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  categoryId: z.number().optional().nullable(),
  lowStockThreshold: z.number().default(5),
  isActive: z.boolean().default(true),
  image: z.string().optional().nullable(),
});

export const createProduct = authAction(productSchema, async (data, ctx) => {
  if (ctx.role !== "ADMIN") throw new Error("Forbidden");

  try {
    const [newProduct] = await db.insert(products).values({
      ...data,
      tenantId: ctx.tenantId,
      price: data.price.toString(),
      image: data.image,
    }).returning();

    revalidatePath("/admin/products");
    revalidatePath("/kasir");
    return newProduct;
  } catch (error) {
    if (error instanceof Error && (error as any).code === "23505") {
      throw new Error("SKU ini sudah digunakan oleh produk lain");
    }
    throw error;
  }
});

export const updateProduct = authAction(productSchema, async (data, ctx) => {
  if (ctx.role !== "ADMIN" || !data.id) throw new Error("Forbidden or missing ID");

  try {
    const [updated] = await db
      .update(products)
      .set({
        ...data,
        price: data.price.toString(),
        image: data.image,
        updatedAt: new Date(),
      })
      .where(and(eq(products.id, data.id), eq(products.tenantId, ctx.tenantId)))
      .returning();

    if (!updated) throw new Error("Product not found or unauthorized");

    revalidatePath("/admin/products");
    revalidatePath("/kasir");
    return updated;
  } catch (error) {
    if (error instanceof Error && (error as any).code === "23505") {
      throw new Error("SKU ini sudah digunakan oleh produk lain");
    }
    throw error;
  }
});

export const deleteProduct = authAction(z.object({ id: z.number() }), async (data, ctx) => {
  if (ctx.role !== "ADMIN") throw new Error("Forbidden");

  const [deleted] = await db
    .delete(products)
    .where(and(eq(products.id, data.id), eq(products.tenantId, ctx.tenantId)))
    .returning();

  if (!deleted) throw new Error("Product not found or unauthorized");

  revalidatePath("/admin/products");
  revalidatePath("/kasir");
  return { success: true };
});

export const uploadImage = authAction(z.instanceof(FormData), async (data, ctx) => {
  if (ctx.role !== "ADMIN") throw new Error("Forbidden");

  const file = data.get("image") as File;
  if (!file) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const uploadDir = path.join(process.cwd(), "public", "products");
  const filePath = path.join(uploadDir, fileName);

  // Ensure directory exists
  await mkdir(uploadDir, { recursive: true });

  // Write file
  await writeFile(filePath, buffer);

  return `/products/${fileName}`;
});

export const getNextSku = authAction(z.object({ categoryId: z.number() }), async (data, ctx) => {
  const category = await db.query.categories.findFirst({
    where: eq(categories.id, data.categoryId),
  });

  if (!category) return "ITEM 001";

  // Map category to prefix
  const name = category.name.toLowerCase();
  let prefix = "ITEM";
  if (name.includes("makan")) prefix = "FOOD";
  else if (name.includes("minum")) prefix = "DRINK";
  else if (name.includes("cemil") || name.includes("snack")) prefix = "SNACK";
  else prefix = name.substring(0, 3).toUpperCase();

  // Find max SKU for this prefix
  const lastProduct = await db.query.products.findFirst({
    where: and(
      eq(products.tenantId, ctx.tenantId),
      ilike(products.sku, `${prefix} %`)
    ),
    orderBy: [desc(products.sku)],
  });

  if (!lastProduct) return `${prefix} 001`;

  // Extract number from "PREFIX NNN"
  const match = lastProduct.sku.match(/\d+$/);
  const lastNum = match ? parseInt(match[0]) : 0;
  const nextNum = (lastNum + 1).toString().padStart(3, "0");

  return `${prefix} ${nextNum}`;
});

const updateStockSchema = z.object({
  id: z.number(),
  newStock: z.coerce.number().min(0),
});

export const updateStock = authAction(updateStockSchema, async (data, ctx) => {
  if (ctx.role !== "ADMIN") throw new Error("Forbidden");

  const [updated] = await db
    .update(products)
    .set({ stock: data.newStock, updatedAt: new Date() })
    .where(and(eq(products.id, data.id), eq(products.tenantId, ctx.tenantId)))
    .returning();

  if (!updated) {
    throw new Error("Product not found or unauthorized");
  }

  revalidatePath("/admin/products");
  revalidatePath("/kasir");
  return updated;
});
