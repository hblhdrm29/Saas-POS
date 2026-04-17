import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LogOut, Home, Settings } from "lucide-react";
import { signOut } from "@/auth";
import { getActiveShift } from "@/app/actions/shift";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "./_components/LogoutButton";

import logoBlueiy from "../assets/logo/blueiy_premium.png";

export default async function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const shiftRes = await getActiveShift({});
  // Serialize to plain object to avoid hydration issues with Date objects
  const activeShift = shiftRes && 'data' in shiftRes && shiftRes.data 
    ? JSON.parse(JSON.stringify(shiftRes.data)) 
    : null;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-jakarta text-slate-900 overflow-hidden">
      {/* Mini Sidebar for POS Tools */}
      <aside className="w-20 bg-white border-r border-slate-100 flex flex-col items-center py-6 justify-between z-[100] shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="space-y-8 flex flex-col items-center w-full">
          
          <nav className="flex flex-col gap-4 w-full px-3">
            <Link href="/kasir" className="group relative p-4 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transition-all hover:bg-blue-100 active:scale-90">
              <Home className="w-5 h-5" />
              <span className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full shadow-[0_0_12px_rgba(37,99,235,0.4)]"></span>
            </Link>
            
            <button className="p-4 text-slate-300 hover:text-blue-600 hover:bg-slate-50 rounded-2xl transition-all active:scale-90">
              <Settings className="w-5 h-5" />
            </button>
          </nav>
        </div>

        <div className="pb-6 w-full px-3">
           <LogoutButton activeShift={activeShift} />
        </div>
      </aside>

      {/* Main POS Interface */}
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
    </div>
  );
}
