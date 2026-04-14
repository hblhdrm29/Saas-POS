import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Receipt, LogOut } from "lucide-react";
import { signOut } from "@/auth";
import Image from "next/image";

import logoBlueiy from "../assets/logo/blueiy_premium.png";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Cast because session.user extended
  const user = session.user as any;

  if (user.role !== "ADMIN") {
    // If Cashier tries to access Admin
    redirect("/kasir");
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Image src={logoBlueiy} alt="Logo" width={110} height={35} className="brightness-0 invert object-contain" />
          </div>
          <p className="text-xs text-slate-400">Admin Dashboard Control Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-sky-400" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors">
            <Package className="w-5 h-5 text-sky-400" />
            <span>Products</span>
          </Link>
          <Link href="/admin/transactions" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors">
            <Receipt className="w-5 h-5 text-sky-400" />
            <span>Transactions</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="mb-4">
            <p className="text-sm font-medium">{session.user.name}</p>
            <p className="text-xs text-slate-400">{session.user.email}</p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit" className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-950/30 rounded-md transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h2 className="font-semibold text-gray-800">Overview</h2>
          <div className="flex items-center gap-4">
            {/* Header Items */}
            <div className="h-8 w-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold">
              A
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
