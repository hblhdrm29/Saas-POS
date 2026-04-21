"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PanelLeft, Menu, X, LogOut, Loader2 } from "lucide-react";
import SidebarNav from "./SidebarNav";

interface AdminShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    image?: string;
  };
  logo: any;
  signOutAction: () => Promise<void>;
}

export default function AdminShell({ children, user, logo, signOutAction }: AdminShellProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Handle responsiveness
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false);
      else setIsOpen(true);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar on navigation (mobile only)
  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [pathname, isMobile]);

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-roboto text-slate-900 overflow-hidden">
      {/* Mobile Backdrop */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Collapsible Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 lg:static bg-white border-r border-slate-200 flex flex-col z-[70] 
          transition-all duration-500 ease-in-out overflow-hidden
          ${isOpen ? "w-[240px] translate-x-0" : isMobile ? "w-[240px] -translate-x-full shadow-none" : "w-[80px] translate-x-0"}
        `}
      >
        <div className={`h-16 px-4 flex items-center shrink-0 border-b border-slate-200/50 ${isOpen ? "justify-between" : "justify-center"}`}>
            {isOpen && (
                <Link href="/admin" className="hover:scale-[1.02] transition-transform duration-300 flex items-center animate-in fade-in slide-in-from-left-2">
                    <Image src={logo} alt="Blueiy Logo" width={102} height={34} className="object-contain" priority />
                </Link>
            )}

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 hover:bg-slate-100 rounded-xl transition-all active:scale-95 text-slate-400 ${!isOpen ? "bg-slate-50" : ""}`}
                title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
                {isMobile && isOpen ? (
                    <X className="w-5 h-5 text-slate-500" />
                ) : (
                    <PanelLeft className={`w-5 h-5 transition-transform duration-500 ${!isOpen ? "rotate-180" : ""}`} />
                )}
            </button>
        </div>

        <div className="flex-1 py-6 overflow-y-auto custom-scrollbar flex flex-col items-center">
          <SidebarNav isExpanded={isOpen} />
        </div>

        <div className={`p-4 border-t border-slate-100 shrink-0 ${!isOpen ? "flex justify-center" : ""}`}>
           <div className="w-full">
              <button 
                onClick={() => signOutAction()}
                className={`
                  flex items-center text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group
                  ${isOpen ? "w-full gap-3 px-3 py-2.5" : "w-12 h-12 justify-center mx-auto"}
                `}
                title="Logout Account"
              >
                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                {isOpen && <span className="text-[12px] font-semibold whitespace-nowrap">Logout Account</span>}
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-[#F8FAFC] relative z-10 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            {isMobile && !isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-all active:scale-95 text-slate-500"
                >
                    <Menu className="w-5 h-5" />
                </button>
            )}
            <div className="flex-1" />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                  <p className="text-[13px] font-bold text-slate-900 leading-none">{user.name}</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-1">Administrator</p>
               </div>
               <div className="w-8 h-8 bg-slate-200 rounded-full border border-slate-300 overflow-hidden shadow-sm">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=0066FF&color=fff`} 
                    alt="User" 
                    className="w-full h-full object-cover" 
                  />
               </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-10 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
