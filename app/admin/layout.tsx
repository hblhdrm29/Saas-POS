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
    <div className="flex h-screen bg-white font-jakarta text-slate-900 overflow-hidden">
      {/* Minimalist Sidebar */}
      <aside className="w-[260px] bg-white border-r border-slate-100 flex flex-col relative z-20">
        <div className="p-10 pb-12">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                <Image src={logoBlueiy} alt="Blueiy Logo" width={20} height={20} className="brightness-0 invert object-contain" />
             </div>
             <div>
                <h2 className="text-[13px] font-black text-slate-900 tracking-tight leading-none mb-1">Blueiy</h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Admin console</p>
             </div>
          </div>
        </div>

        <div className="flex-1 px-4 space-y-1 overflow-y-auto">
          <SidebarNav />
        </div>

        <div className="p-8 border-t border-slate-50">
           <Link href="/kasir" className="flex items-center justify-center gap-2 w-full border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-[12px] hover:bg-slate-50 transition-all mb-4">
              <Plus className="w-4 h-4" />
              <span>New Sale</span>
           </Link>

           <div className="space-y-1">
              <Link href="/admin/support" className="flex items-center gap-4 px-4 py-2 text-slate-400 hover:text-slate-900 transition-colors group">
                 <span className="text-[12px] font-bold">Support</span>
              </Link>
              <form
                 action={async () => {
                   "use server";
                   await signOut();
                 }}
               >
                 <button type="submit" className="flex w-full items-center gap-4 px-4 py-2 text-slate-400 hover:text-red-500 transition-all group">
                   <span className="text-[12px] font-bold">Logout</span>
                 </button>
               </form>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-white relative z-10 overflow-hidden">
        <header className="h-16 border-b border-slate-50 flex items-center justify-between px-12 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
          <div className="flex-1 max-w-sm relative group">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-7 pr-4 py-2 bg-transparent text-[13px] font-medium placeholder:text-slate-300 outline-none"
            />
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6">
               <button className="text-slate-300 hover:text-slate-900 transition-colors text-[16px]">🔔</button>
               <button className="text-slate-300 hover:text-slate-900 transition-colors text-[16px]">⚙️</button>
            </div>
            
            <div className="flex items-center gap-4 border-l border-slate-100 pl-8">
               <div className="text-right hidden sm:block">
                  <p className="text-[13px] font-black text-slate-900 leading-none">{session.user.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">Admin</p>
               </div>
               <div className="w-9 h-9 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${session.user.name}&background=111827&color=fff`} alt="User" className="w-full h-full object-cover" />
               </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-16 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
