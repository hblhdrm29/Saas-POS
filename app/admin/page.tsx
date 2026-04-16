import { auth } from "@/auth";
import { Download, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import SalesBarChart from "./_components/SalesBarChart";
import RecentSales from "./_components/RecentSales";
import { getDashboardStats, getWeeklySalesData, getRecentSales, getLowStockAlerts } from "@/app/actions/dashboard";

export default async function AdminDashboard() {
   const session = await auth();
   
   // Fetch live data from server actions
   const stats = await getDashboardStats();
   const weeklySales = await getWeeklySalesData();
   const recentSales = await getRecentSales();
   const lowStock = await getLowStockAlerts();

   const formatRp = (val: number) => {
      return new Intl.NumberFormat('id-ID', {
         style: 'currency',
         currency: 'IDR',
         minimumFractionDigits: 0,
      }).format(val || 0);
   };

   return (
      <div className="max-w-[1400px] mx-auto space-y-20 pb-32">
         {/* Minimalist Header */}
         <div className="flex justify-between items-end">
            <div>
               <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
            </div>
            <div className="flex gap-4">
               <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-100 text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Last 30 days</span>
               </button>
               <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-[12px] font-bold hover:bg-slate-800 transition-all">
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Report</span>
               </button>
            </div>
         </div>

         {/* Ultra-Simpel Metric Row */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-50 pb-16">
            <div className="space-y-4">
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Revenue</p>
               <div className="flex items-end gap-3">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{formatRp(stats?.totalRevenue || 0)}</h2>
                  <div className="flex items-center text-emerald-500 font-bold text-[11px] mb-1.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                     <ArrowUpRight className="w-3 h-3 mr-1" />
                     12%
                  </div>
               </div>
            </div>

            <div className="space-y-4 border-l border-slate-50 pl-12">
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Transactions</p>
               <div className="flex items-end gap-3">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{stats?.totalTransactions || 0}</h2>
                  <div className="flex items-center text-red-400 font-bold text-[11px] mb-1.5 bg-red-50 px-2 py-0.5 rounded-full">
                     <ArrowDownRight className="w-3 h-3 mr-1" />
                     2%
                  </div>
               </div>
            </div>

            <div className="space-y-4 border-l border-slate-50 pl-12">
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Avg. Ticket</p>
               <div className="flex items-end gap-3">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{formatRp(stats?.avgTicket || 0)}</h2>
               </div>
            </div>

            <div className="space-y-4 border-l border-slate-50 pl-12">
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Low Stock Items</p>
               <div className="flex items-end gap-3">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{lowStock.length}</h2>
                  <span className="text-[11px] font-bold text-red-500 mb-1.5 bg-red-50 px-2 py-0.5 rounded-full">Alert</span>
               </div>
            </div>
         </div>

         {/* Data Visualization Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 items-start">
            <div className="lg:col-span-2">
               <div className="space-y-8">
                  <div className="flex justify-between items-center">
                     <h3 className="font-bold text-slate-900 text-sm tracking-tight">Sales performance</h3>
                  </div>
                  <SalesBarChart data={weeklySales} />
               </div>
            </div>
            
            <div className="lg:col-span-1">
               <RecentSales sales={recentSales} />
            </div>
         </div>

         {/* Footer */}
         <footer className="pt-20 border-t border-slate-50 flex justify-between items-center">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] italic">Blueiy Core v2.4.1</p>
            <div className="flex gap-8 text-[11px] font-bold text-slate-300">
               <span>Documentation</span>
               <span>Changelog</span>
            </div>
         </footer>
      </div>
   );
}
