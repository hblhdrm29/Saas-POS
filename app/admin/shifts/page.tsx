import { db } from "@/db";
import { shifts, users } from "@/db/schema";
import { auth } from "@/auth";
import { eq, desc } from "drizzle-orm";
import { 
  ChevronRight, 
  ArrowUpRight, 
  AlertTriangle,
  History,
  Circle
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

    const totalShifts = shiftList.length;
    const closedShifts = shiftList.filter(s => s.status === 'CLOSED');
    const shiftsWithDiscrepancy = closedShifts.filter(s => {
        const expected = Number(s.startingCash) + Number(s.totalSalesCash);
        const actual = Number(s.actualCash || 0);
        return Math.abs(actual - expected) > 1;
    }).length;

    const formatCurrency = (val: any) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(val));
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-12 py-10 animate-in fade-in duration-1000">
            {/* Header: Ultra-Minimalist */}
            <div className="flex flex-col gap-8">
                <div className="space-y-1">
                    <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Laporan Shift</h1>
                    <p className="text-slate-400 text-[13px] font-medium tracking-tight">Audit harian dan rekonsiliasi kas operasional.</p>
                </div>

                <div className="flex items-center gap-12 border-b border-slate-100 pb-8">
                    <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Sesi</p>
                         <p className="text-2xl font-black text-slate-900 tabular-nums">{totalShifts}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-100" />
                    <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sesi Aktif</p>
                         <div className="flex items-center gap-2">
                            <p className="text-2xl font-black text-blue-600 tabular-nums">{shiftList.filter(s => s.status === 'OPEN').length}</p>
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse mt-1" />
                         </div>
                    </div>
                    <div className="w-px h-8 bg-slate-100" />
                    <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temuan Selisih</p>
                         <p className={`text-2xl font-black tabular-nums ${shiftsWithDiscrepancy > 0 ? 'text-red-500' : 'text-slate-300'}`}>
                            {shiftsWithDiscrepancy}
                         </p>
                    </div>
                </div>
            </div>

            {/* List: Invisible UI Pattern */}
            <div className="space-y-0 text-[13px]">
                <div className="grid grid-cols-[1.5fr_1.2fr_1fr_1fr_1.2fr_100px] gap-4 px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
                    <div>Kasir</div>
                    <div>Periode</div>
                    <div className="text-right">Seharusnya</div>
                    <div className="text-right">Uang Fisik</div>
                    <div className="text-center">Audit</div>
                    <div className="text-right">Status</div>
                </div>

                {shiftList.length === 0 ? (
                    <div className="py-20 text-center text-slate-300 font-bold">Belum ada riwayat shift.</div>
                ) : (
                    shiftList.map((shift) => {
                        const expectedTotal = Number(shift.startingCash) + Number(shift.totalSalesCash);
                        const actualTotal = Number(shift.actualCash || 0);
                        const discrepancy = actualTotal - expectedTotal;
                        const isMatch = Math.abs(discrepancy) <= 1;

                        return (
                            <div 
                                key={shift.id} 
                                className="grid grid-cols-[1.5fr_1.2fr_1fr_1fr_1.2fr_100px] gap-4 px-6 py-6 items-center border-b border-slate-50 hover:bg-slate-50/50 transition-colors group cursor-default"
                            >
                                {/* Kasir */}
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-900 tracking-tight">{shift.userName || 'Anonymous'}</span>
                                    <span className="text-[10px] font-medium text-slate-400">{shift.userRole === 'ADMIN' ? 'Administrator' : 'Staff Kasir'}</span>
                                </div>

                                {/* Periode */}
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-bold text-slate-700 tabular-nums">
                                        {new Date(shift.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        <span className="mx-1 text-slate-200">-</span>
                                        {shift.endTime ? new Date(shift.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Aktif'}
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-400 uppercase">{new Date(shift.startTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                </div>

                                {/* Seharusnya */}
                                <div className="text-right font-black text-slate-900 tabular-nums tracking-tighter">
                                    {formatCurrency(expectedTotal).replace('Rp ', '')}
                                </div>

                                {/* Fisik */}
                                <div className="text-right font-black text-slate-900 tabular-nums tracking-tighter">
                                    {shift.status === 'CLOSED' ? formatCurrency(actualTotal).replace('Rp ', '') : '—'}
                                </div>

                                {/* Audit */}
                                <div className="flex justify-center">
                                    {shift.status === 'CLOSED' ? (
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${isMatch ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                            <span className={`text-[11px] font-black tabular-nums ${isMatch ? 'text-slate-400' : 'text-red-500'}`}>
                                                {isMatch ? 'Sesuai' : formatCurrency(Math.abs(discrepancy)).replace('Rp ', '')}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">Berjalan</span>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="text-right">
                                    <span className={`text-[9px] font-black uppercase tracking-tighter ${shift.status === 'OPEN' ? 'text-blue-600' : 'text-slate-300'}`}>
                                        {shift.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Subtle Alert: Senior Audit Pattern */}
            {shiftsWithDiscrepancy > 0 && (
                <div className="flex items-start gap-4 p-8 border border-red-50 rounded-3xl bg-red-50/10">
                    <div className="p-2.5 bg-red-50 rounded-xl">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-[13px] font-black text-slate-900">Perhatian Rekonsiliasi</h4>
                        <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                            Terdapat {shiftsWithDiscrepancy} rekaman shift dengan selisih saldo. Mohon bandingkan data penjualan harian dengan bukti kas fisik di laci kasir.
                        </p>
                    </div>
                    <button className="ml-auto px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-900 hover:bg-slate-50 transition-all">
                        Audit Lanjutan
                    </button>
                </div>
            )}
        </div>
    );
}
