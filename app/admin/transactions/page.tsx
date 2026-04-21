import { getTransactions } from "@/app/actions/transaction";
import TransactionList from "./_components/TransactionList";
import DateFilter from "./_components/DateFilter";

export default async function TransactionsPage(props: {
    searchParams: Promise<{ date?: string }>
}) {
    const searchParams = await props.searchParams;
    const dateStr = searchParams.date || new Date().toISOString().split('T')[0];
    
    const res = await getTransactions({ paymentMethod: "ALL", date: dateStr });
    const transactions = res.success ? res.data : [];

    // Simple aggregate stats for the header
    const totalVolume = transactions.reduce((acc: number, curr: any) => acc + parseFloat(curr.totalAmount), 0);
    const avgOrder = transactions.length > 0 ? totalVolume / transactions.length : 0;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="space-y-6 max-w-[1400px]">
            {/* Dashboard Header with Gray Subtext */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Transactions</h1>
                    <p className="text-slate-400 text-[11px] font-medium leading-none mt-1">Pantau transaksi bisnis Anda secara real-time</p>
                </div>
                <DateFilter currentDate={dateStr} />
            </div>

            {/* Polos Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <p className="text-[11px] font-bold text-slate-400 tracking-tight mb-2">Total Sales Volume</p>
                    <h3 className="text-lg font-black text-slate-900 leading-none mb-2">{formatCurrency(totalVolume)}</h3>
                    <p className="text-[10px] font-semibold text-emerald-500">Active revenue across all channels</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <p className="text-[11px] font-bold text-slate-400 tracking-tight mb-2">Transaction Count</p>
                    <h3 className="text-lg font-black text-slate-900 leading-none mb-2">{transactions.length}</h3>
                    <p className="text-[10px] font-semibold text-slate-400">Total orders processed today</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <p className="text-[11px] font-bold text-slate-400 tracking-tight mb-2">Average Ticket</p>
                    <h3 className="text-lg font-black text-slate-900 leading-none mb-2">{formatCurrency(avgOrder)}</h3>
                    <p className="text-[10px] font-semibold text-slate-400">Based on today's statistics</p>
                </div>
            </div>

            {/* Minimalist Transaction List */}
            <TransactionList initialData={transactions || []} currentDate={dateStr} />

            {/* Gray Subtext Footer */}
            <div className="pt-12 pb-20 border-t border-slate-50">
                <p className="text-[11px] font-medium text-slate-400 tracking-tight">
                    * Showing recent transaction history. All financial data is synchronized in real-time with the central POS server and follows strict audit protocols.
                </p>
            </div>
        </div>
    );
}
