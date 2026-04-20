import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Receipt, LogOut, Ticket, Users, History, Warehouse, Settings, Search, Plus } from "lucide-react";
import { signOut } from "@/auth";
import Image from "next/image";
import SidebarNav from "./_components/SidebarNav";

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
    <div className="flex h-screen bg-[#F8FAFC] font-jakarta text-slate-900 overflow-hidden">
      {/* Professional Sidebar */}
      <aside className="w-[240px] bg-white border-r border-slate-200 flex flex-col relative z-20">
        <div className="p-6 flex flex-col items-center justify-center">
           <Link href="/admin" className="hover:scale-[1.02] transition-transform duration-300 flex justify-center">
              <Image src={logoBlueiy} alt="Blueiy Logo" width={100} height={30} className="object-contain" priority />
           </Link>
        </div>

        <div className="flex-1 px-3 space-y-1 overflow-y-auto">
          <SidebarNav />
        </div>

        <div className="p-6 border-t border-slate-100">
           <div className="space-y-0.5">
              <form
                 action={async () => {
                   "use server";
                   await signOut();
                 }}
               >
                 <button type="submit" className="flex w-full items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all group">
                   <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                   <span className="text-[12px] font-semibold">Logout Account</span>
                 </button>
               </form>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-[#F8FAFC] relative z-10 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="flex-1" />
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                  <p className="text-[13px] font-bold text-slate-900 leading-none">{session.user.name}</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-1">Administrator</p>
               </div>
               <div className="w-8 h-8 bg-slate-200 rounded-full border border-slate-300 overflow-hidden shadow-sm">
                  <img src={`https://ui-avatars.com/api/?name=${session.user.name}&background=0066FF&color=fff`} alt="User" className="w-full h-full object-cover" />
               </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-10 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
