"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, MoreHorizontal } from "lucide-react";
import { getTransactions } from "@/app/actions/transaction";
import TransactionDetail from "@/app/admin/transactions/_components/TransactionDetail";
import { supabase } from "@/lib/supabase";

type Transaction = {
    id: number;
    totalAmount: string;
    paymentMethod: string;
    status: string;
    createdAt: Date;
    staffName: string | null;
    staffRole: string | null;
};

export default function TransactionList({ initialData }: { initialData: Transaction[] }) {
    const [transactions, setTransactions] = useState<Transaction[]>(initialData);
    const [activeTab, setActiveTab] = useState("ALL");
    const [search, setSearch] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const filterData = async () => {
        setIsLoading(true);
        const res = await getTransactions({ paymentMethod: activeTab, search });
        if (res.success) {
            setTransactions(res.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const timeoutId = setTimeout(filterData, 300);
        return () => clearTimeout(timeoutId);
    }, [activeTab, search]);

    // Supabase Realtime Subscription
    useEffect(() => {
        const channel = supabase
            .channel('transaction-updates')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to INSERT, UPDATE, DELETE
                    schema: 'public',
                    table: 'transactions',
                },
                (payload) => {
                    console.log('Realtime change received:', payload);
                    filterData(); // Refresh data from server
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeTab, search]); 
    // Dependency on search/activeTab so it doesn't stay out of sync if filters change, 
    // although filterData handles it.

    const formatCurrency = (val: string) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(parseFloat(val));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Minimalist Filters Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-1">Active Transactions</h2>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100 mb-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
                        </div>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-200" />
                    <div className="relative group max-w-xs w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent pl-9 pr-4 py-1 text-[12px] text-slate-600 focus:outline-none placeholder:text-slate-300"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-full text-[11px] font-bold text-slate-500 bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                        All Status <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                    <select 
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value)}
                        className="appearance-none px-4 py-1.5 border border-slate-200 rounded-full text-[11px] font-bold text-slate-500 bg-white cursor-pointer hover:bg-slate-50 focus:outline-none pr-8 relative bg-no-repeat"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '0.75rem' }}
                    >
                        <option value="ALL">All Types</option>
                        <option value="CASH">Cash</option>
                        <option value="CARD">Card</option>
                        <option value="QRIS">QRIS</option>
                    </select>
                </div>
            </div>

            {/* Polos Table */}
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
                    </div>
                )}

                <div className="overflow-x-auto overflow-y-visible">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold tracking-wider border-b border-slate-100/80">
                                <th className="pl-6 py-4 w-12 font-medium text-center">ID</th>
                                <th className="px-4 py-4 font-medium text-center">STATUS</th>
                                <th className="px-4 py-4 font-medium text-right">PRICE</th>
                                <th className="px-4 py-4 font-medium">TYPE</th>
                                <th className="px-4 py-4 font-medium text-center">DATE</th>
                                <th className="px-4 py-4 font-medium text-center">TIME</th>
                                <th className="px-4 py-4 font-medium">NAME</th>
                                <th className="px-4 py-4 font-medium">STAFF</th>
                                <th className="pr-6 py-4 text-right font-medium">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {transactions.map((trx, index) => (
                                <tr key={trx.id} className="hover:bg-slate-50/20 transition-all group">
                                    <td className="pl-6 py-4 text-center">
                                        <span className="text-[11px] font-bold text-slate-400 tabular-nums">#{trx.id.toString().padStart(2, '0')}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            trx.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                            {trx.status === 'COMPLETED' ? 'SUCCESS' : 'VOIDED'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <span className="text-[13px] font-semibold text-slate-800 tracking-tight tabular-nums">{formatCurrency(trx.totalAmount).replace('Rp', '').trim()}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-[12px] text-slate-500 font-medium">{trx.paymentMethod}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="text-[11px] font-bold text-slate-500 tabular-nums">
                                            {new Date(trx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="text-[11px] font-medium text-slate-400 tabular-nums">
                                            {new Date(trx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-[12px] text-slate-900 font-bold">{trx.staffName || '-'}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-[11px] font-bold text-slate-400 capitalize">
                                            {trx.staffRole?.toLowerCase() === 'cashier' ? 'Kasir' : trx.staffRole || 'Kasir'}
                                        </span>
                                    </td>
                                    <td className="pr-6 py-4 text-right">
                                       <button 
                                            onClick={() => setSelectedOrderId(trx.id)}
                                            className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                       >
                                           <MoreHorizontal className="w-4 h-4" />
                                       </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            <TransactionDetail 
                orderId={selectedOrderId} 
                onClose={() => {
                    setSelectedOrderId(null);
                    filterData(); // Refresh list
                }} 
            />
        </div>
    );
}
