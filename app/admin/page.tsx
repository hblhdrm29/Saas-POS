import { auth } from "@/auth";
import { Download, Calendar, CreditCard, ShoppingCart, TrendingUp, AlertTriangle, PlusCircle } from "lucide-react";
import Link from "next/link";
import SalesBarChart from "./_components/SalesBarChart";
import RecentSales from "./_components/RecentSales";
import { getDashboardStats, getWeeklySalesData, getRecentSales, getLowStockAlerts } from "@/app/actions/dashboard";

export default async function AdminDashboard() {
   const session = await auth();
   
   // Fetch live data
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
      <div className="space-y-8 pb-20">
         {/* Professional Header */}
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
               <h1 className="text-xl font-bold text-slate-900">Dashboard Overview</h1>
               <p className="text-sm text-slate-500 font-medium">Monitoring performa bisnis Anda secara real-time.</p>
            </div>
            <div className="flex gap-2">
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                  <Calendar className="w-4 h-4" />
                  <span>30 Days</span>
               </button>
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
               </button>
               <Link href="/kasir" className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] rounded-lg text-[13px] font-semibold text-white hover:bg-blue-700 transition-all shadow-sm">
                  <PlusCircle className="w-4 h-4" />
                  <span>New Transaction</span>
               </Link>
            </div>
         </div>

         {/* Normalized Metric Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
               <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-blue-50 text-[#0066FF] rounded-lg flex items-center justify-center">
                     <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                     +12.5%
                  </div>
               </div>
               <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatRp(stats?.totalRevenue || 0)}</h3>
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
               <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                     <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div className="flex items-center text-red-500 bg-red-50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                     -2.1%
                  </div>
               </div>
               <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Transactions</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalTransactions || 0}</h3>
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
               <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                     <TrendingUp className="w-5 h-5" />
                  </div>
               </div>
               <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg. Ticket</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatRp(stats?.avgTicket || 0)}</h3>
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
               <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                     <AlertTriangle className="w-5 h-5" />
                  </div>
                  {lowStock.length > 0 && <span className="bg-red-500 w-2 h-2 rounded-full animate-pulse mt-1" />}
               </div>
               <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock Items</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{lowStock.length} Products</h3>
               </div>
            </div>
         </div>

         {/* Reporting Section */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-slate-900 text-sm">Weekly Sales Performance</h3>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50/50 rounded-lg border border-slate-100">
                     <Calendar className="w-3 h-3 text-slate-400" />
                     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                        {new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                     </span>
                  </div>
               </div>
               <SalesBarChart data={weeklySales} />
            </div>
            
            <div className="lg:col-span-1 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
               <RecentSales sales={recentSales} />
            </div>
         </div>

         {/* Footer */}
         <footer className="pt-10 border-t border-slate-200 flex justify-between items-center text-slate-400">
            <p className="text-[11px] font-semibold">Blueiy Enterprise POS • v2.4.1</p>
            <div className="flex gap-4 text-[11px] font-semibold">
               <span className="hover:text-slate-900 cursor-pointer">Security</span>
               <span className="hover:text-slate-900 cursor-pointer">Audit Logs</span>
            </div>
         </footer>
      </div>
   );
}
