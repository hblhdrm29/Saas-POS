import { auth } from "@/auth";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import ProductList from "./_components/ProductList";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  const session = await auth();
  const user = session?.user as any;

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch products and categories for this tenant
  const tenantProducts = await db
    .select()
    .from(products)
    .where(eq(products.tenantId, user.tenantId))
    .orderBy(desc(products.createdAt));

  const tenantCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.tenantId, user.tenantId));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manajemen Produk</h1>
        <p className="text-slate-500 text-sm font-medium">Kelola inventaris dan katalog barang toko Anda</p>
      </div>

      <ProductList 
        initialProducts={tenantProducts} 
        categories={tenantCategories} 
      />
    </div>
  );
}
