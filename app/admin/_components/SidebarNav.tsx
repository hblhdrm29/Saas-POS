"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Receipt, Ticket, History } from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Master Data" },
  { href: "/admin/transactions", icon: Receipt, label: "Transaction" },
  { href: "/admin/promotions", icon: Ticket, label: "Promotions" },
  { href: "/admin/shifts", icon: History, label: "Reports" },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
      {navItems.map((item) => {
        // Dynamic check for active state
        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
        
        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all relative ${isActive ? 'bg-slate-50 text-slate-900 font-black' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50/50 font-bold'}`}
          >
            {isActive && <div className="absolute left-0 w-1 h-4 bg-slate-900 rounded-full" />}
            <item.icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-300'}`} />
            <span className="text-[12px] tracking-tight">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  );
}
