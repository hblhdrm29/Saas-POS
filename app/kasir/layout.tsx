import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LogOut, Home, Settings } from "lucide-react";
import { signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";

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

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Mini Sidebar for POS Tools */}
      <aside className="w-16 bg-white border-r flex flex-col items-center py-4 justify-between z-10 shadow-sm">
        <div className="space-y-6 flex flex-col items-center">
          <div className="flex items-center justify-center p-1 w-full shrink-0">
            <Image src={logoBlueiy} alt="Logo" width={40} height={12} className="object-contain" />
          </div>
          <Link href="/kasir" className="p-3 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-100 transition-colors">
            <Home className="w-6 h-6" />
          </Link>
          <button className="p-3 text-slate-400 hover:text-sky-600 hover:bg-slate-50 rounded-xl transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit" className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut className="w-6 h-6" />
            </button>
          </form>
      </aside>

      {/* Main POS Interface */}
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
    </div>
  );
}
