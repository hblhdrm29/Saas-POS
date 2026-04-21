"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Receipt, Ticket, History, PlusCircle, Users } from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/promotions", icon: Ticket, label: "Promotions" },
  { href: "/admin/transactions", icon: Receipt, label: "Transaction" },
  { href: "/admin/users", icon: Users, label: "Manajemen Staff" },
  { href: "/admin/shifts", icon: History, label: "Laporan Shift" },
];

export default function SidebarNav({ isExpanded = true }: { isExpanded?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={`flex-1 space-y-1 overflow-y-auto custom-scrollbar flex flex-col py-4 w-full ${!isExpanded ? "items-center" : ""}`}>
      {navItems.map((item) => {
        // Dynamic check for active state
        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            title={!isExpanded ? item.label : ""}
            className={`
              flex items-center transition-all duration-300
              ${isExpanded ? "gap-3 px-4 py-2.5 w-full" : "justify-center w-full h-12"}
              ${isActive ? 'bg-blue-50 text-[#0066FF] shadow-[inset_0_0_0_1px_rgba(0,102,255,0.1)]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
            `}
          >
            <div className={`flex items-center justify-center shrink-0 transition-colors duration-300 ${isExpanded ? "w-5 h-5" : "w-10 h-10"} ${isActive ? 'text-[#0066FF]' : 'text-slate-400'}`}>
              <item.icon className={`${isExpanded ? "w-[18px] h-[18px]" : "w-[20px] h-[20px]"}`} />
            </div>
            {isExpanded && (
              <span className={`text-[13px] tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  );
}
