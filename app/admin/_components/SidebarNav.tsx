"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Receipt, Ticket, History, PlusCircle, Users } from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/promotions", icon: Ticket, label: "Promotions" },
  { href: "/admin/transactions", icon: Receipt, label: "Transaction" },
  { href: "/admin/users", icon: Users, label: "Kasir" },
  { href: "/admin/shifts", icon: History, label: "Laporan Shift" },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
      {navItems.map((item) => {
        // Dynamic check for active state
        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive ? 'bg-blue-50 text-[#0066FF] font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'}`}
          >
            <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-[#0066FF]' : 'text-slate-400'}`} />
            <span className="text-[13px] tracking-tight">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  );
}
