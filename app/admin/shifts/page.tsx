import { db } from "@/db";
import { shifts, users } from "@/db/schema";
import { auth } from "@/auth";
import { eq, desc } from "drizzle-orm";
import { 
  History, 
  ChevronRight, 
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  User,
  CheckCircle2,
  Calendar,
  Wallet
} from "lucide-react";

export default async function ShiftsPage() {
    const session = await auth();
    const user = session?.user as any;

    const shiftList = await db
        .select({
            id: shifts.id,
            userName: users.name,
            userRole: users.role,
            startTime: shifts.startTime,
            endTime: shifts.endTime,
            startingCash: shifts.startingCash,
            totalSalesCash: shifts.totalSalesCash,
            actualCash: shifts.actualCash,
            status: shifts.status,
            notes: shifts.notes,
        })
        .from(shifts)
        .leftJoin(users, eq(shifts.userId, users.id))
        .where(eq(shifts.tenantId, user.tenantId))
        .orderBy(desc(shifts.startTime));

    // Grouping by Date
    const groupedShifts = shiftList.reduce((acc, shift) => {
        const dateKey = new Date(shift.startTime).toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(shift);
        return acc;
    }, {} as Record<string, typeof shiftList>);

    const formatCurrency = (val: any) => {
        return new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0 
        }).format(Number(val));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header: Professional SaaS Style */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Laporan Rekonsiliasi Shift</h1>
                    <p className="text-slate-500 text-sm mt-1">Audit kasir dan pemantauan saldo harian secara real-time.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Semua Waktu
                    </button>
                </div>
            </div>

            {/* Metric Grid: Blue & White Theme */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                        <Wallet className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pendapatan</p>
                        <p className="text-xl font-black text-slate-900 tabular-nums">
                            {formatCurrency(shiftList.reduce((acc, s) => acc + Number(s.totalSalesCash), 0))}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Shift Berjalan</p>
                        <p className="text-xl font-black text-slate-900 tabular-nums">
                            {shiftList.filter(s => s.status === 'OPEN').length} <span className="text-slate-300 text-sm font-bold">Sesi aktif</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex items-center gap-5">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Selisih Kas</p>
                        <p className="text-xl font-black text-slate-900 tabular-nums">
                            {shiftList.filter(s => {
                                if (s.status !== 'CLOSED') return false;
                                return Math.abs(Number(s.actualCash) - (Number(s.startingCash) + Number(s.totalSalesCash))) > 1;
                            }).length} <span className="text-slate-300 text-sm font-bold">Temuan</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Audit List Container: Clean Card Style */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <History className="w-4 h-4 text-blue-500" />
                        Log Aktivitas Shift
                    </h3>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-slate-400">Terbaru</span>
                    </div>
                </div>

                <div className="p-2">
                    {Object.keys(groupedShifts).length === 0 ? (
                        <div className="py-24 text-center">
                            <History className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                            <p className="text-slate-400 text-sm font-bold">Belum ada riwayat shift</p>
                        </div>
                    ) : (
                        Object.entries(groupedShifts).map(([date, shifts]) => (
                            <div key={date}>
                                <div className="px-8 py-4 bg-blue-50/30 font-bold text-[11px] text-blue-600 uppercase tracking-[0.2em] border-y border-blue-50/50">
                                    {date}
                                </div>
                                
                                <div className="divide-y divide-slate-50">
                                    {shifts.map((shift) => {
                                        const expected = Number(shift.startingCash) + Number(shift.totalSalesCash);
                                        const actual = Number(shift.actualCash || 0);
                                        const diff = actual - expected;
                                        const isMatch = Math.abs(diff) <= 1;

                                        return (
                                            <div key={shift.id} className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr_40px] gap-6 px-10 py-8 items-center hover:bg-slate-50/50 transition-all group">
                                                {/* Kasir */}
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                                                        <User className="w-5 h-5 text-blue-500" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-800 tracking-tight">{shift.userName}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{shift.userRole}</span>
                                                    </div>
                                                </div>

                                                {/* Waktu */}
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                        <Clock className="w-3.5 h-3.5 text-slate-300" />
                                                        {new Date(shift.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                        <span className="mx-1 text-slate-200">/</span>
                                                        {shift.endTime ? new Date(shift.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Masih Aktif'}
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 font-bold">Sesi Pembukuan</span>
                                                </div>

                                                {/* Seharusnya */}
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Ekspektasi</p>
                                                    <p className="text-[13px] font-black text-slate-900 tabular-nums tracking-tighter">
                                                        {formatCurrency(expected).replace('Rp', '').trim()}
                                                    </p>
                                                </div>

                                                {/* Fisik */}
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Uang Kas</p>
                                                    <p className="text-[13px] font-black text-slate-900 tabular-nums tracking-tighter">
                                                        {shift.status === 'CLOSED' ? formatCurrency(actual).replace('Rp', '').trim() : '—'}
                                                    </p>
                                                </div>

                                                {/* Audit */}
                                                <div className="flex justify-center">
                                                    {shift.status === 'CLOSED' ? (
                                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs ${isMatch ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                            {isMatch ? <CheckCircle2 className="w-4 h-4" /> : <TrendingUp className={`w-4 h-4 ${diff < 0 ? 'rotate-90' : ''}`} />}
                                                            {isMatch ? 'Balance Match' : formatCurrency(Math.abs(diff))}
                                                        </div>
                                                    ) : (
                                                        <div className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-widest animate-pulse">Running...</div>
                                                    )}
                                                </div>

                                                {/* Detail */}
                                                <button className="flex justify-end text-slate-300 hover:text-blue-600 transition-colors">
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Audit CTA: Blue Pattern */}
            <div className="bg-blue-600 p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-24 transition-transform group-hover:scale-110 duration-700" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                        <AlertTriangle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white mb-1">Pusat Rekonsiliasi Kas</h4>
                        <p className="text-blue-100 text-[13px] font-medium max-w-md">
                            Gunakan laporan ini untuk melakukan audit harian. Pastikan semua selisih memiliki catatan (notes) yang valid.
                        </p>
                    </div>
                </div>
                <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-xs shadow-lg shadow-black/5 hover:bg-slate-50 transition-all active:scale-95 z-10">
                    Mulai Audit Harian
                </button>
            </div>
        </div>
    );
}
