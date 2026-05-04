import { auth } from "@/auth";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import POSClient from "./_components/POSClient";

export default async function POSPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  if (!session?.user?.tenantId) return redirect("/login");
  const user = session.user as {
    id: string;
    name: string | null;
    email: string;
    role: string;
    tenantId: string;
  };
  const tenantId = user.tenantId;

  // Fetch categories for filtering
  const allCategories = await db
    .select()
    .from(categories)
    .where(sql`${categories.tenantId} = ${tenantId}`);

  // Fetch active products
  const allProducts = await db
    .select()
    .from(products)
    .where(
      sql`${products.tenantId} = ${tenantId} AND ${products.isActive} = true`
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
