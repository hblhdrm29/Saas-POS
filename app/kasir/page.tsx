import { auth } from "@/auth";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import POSClient from "./_components/POSClient";

export default async function POSPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as any;
  const tenantId = user.tenantId;

  // Fetch categories for filtering
  const allCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.tenantId, tenantId));

  // Fetch active products
  const allProducts = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.tenantId, tenantId),
        eq(products.isActive, true)
      )
    );

  // Normalize decimal/string fields from DB for the client
  const serializedProducts = allProducts.map(p => ({
    ...p,
    price: parseFloat(p.price)
  }));

  return (
    <POSClient 
      initialProducts={serializedProducts}
      initialCategories={allCategories}
      user={user}
    />
  );
}
