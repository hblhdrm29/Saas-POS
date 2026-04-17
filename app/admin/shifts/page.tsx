import { db } from "@/db";
import { shifts, users } from "@/db/schema";
import { auth } from "@/auth";
import { eq, desc } from "drizzle-orm";
import { History, Banknote, Clock, User, AlertCircle, CheckCircle2, ChevronRight, Calculator } from "lucide-react";

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

    const formatCurrency = (val: any) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(val));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Shift Reconciliation</h1>
                    <p className="text-slate-500 text-sm">Monitor cashier shifts and verify cash balances.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-black tracking-wider border-b border-slate-100">
                            <th className="px-8 py-5">Cashier</th>
                            <th className="px-8 py-5">Position</th>
                            <th className="px-8 py-5">Shift Time</th>
                            <th className="px-8 py-5">Expected Cash</th>
                            <th className="px-8 py-5">Actual Cash</th>
                            <th className="px-8 py-5">Discrepancy</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5 text-right">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {shiftList.length === 0 ? (
                            <tr><td colSpan={7} className="px-8 py-20 text-center text-slate-400 text-sm">No shift history found.</td></tr>
                        ) : (
                            shiftList.map((shift) => {
                                const expectedTotal = Number(shift.startingCash) + Number(shift.totalSalesCash);
                                const actualTotal = Number(shift.actualCash || 0);
                                const discrepancy = actualTotal - expectedTotal;
                                const isDiscrepancy = discrepancy !== 0 && shift.status === 'CLOSED';

                                return (
                                    <tr key={shift.id} className="hover:bg-slate-50/30 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                                                    <User className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-800">{shift.userName || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] font-black tracking-wider px-2 py-1 rounded-md ${shift.userRole === 'ADMIN' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'}`}>
                                                {shift.userRole === 'ADMIN' ? 'Admin' : 'Kasir'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                    <Clock className="w-3 h-3 text-slate-300" />
                                                    {new Date(shift.startTime).toLocaleTimeString()} - {shift.endTime ? new Date(shift.endTime).toLocaleTimeString() : 'Active'}
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-medium">{new Date(shift.startTime).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-800">{formatCurrency(expectedTotal)}</span>
                                                <span className="text-[10px] text-slate-400">Modal: {formatCurrency(shift.startingCash)}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {shift.status === 'CLOSED' ? (
                                                <span className="text-xs font-black text-slate-800">{formatCurrency(actualTotal)}</span>
                                            ) : (
                                                <span className="text-[10px] font-black tracking-widest text-blue-500 px-2 py-1 bg-blue-50 rounded">In Progress</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-sm font-black">
                                            {shift.status === 'CLOSED' ? (
                                                <div className={`flex items-center gap-1.5 ${discrepancy === 0 ? 'text-emerald-600' : discrepancy > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                                    {discrepancy === 0 ? (
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    ) : (
                                                        <AlertCircle className="w-4 h-4" />
                                                    )}
                                                    <span>{discrepancy === 0 ? 'Balance Match' : formatCurrency(discrepancy)}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300">—</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest ${shift.status === 'OPEN' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                                {shift.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-slate-300 hover:text-blue-600 transition-all hover:bg-blue-50 rounded-xl">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Reconciliation Concept Card */}
            {shiftList.some(s => s.status === 'CLOSED' && (Number(s.actualCash) - (Number(s.startingCash) + Number(s.totalSalesCash)) !== 0)) && (
                <div className="bg-red-50 border border-red-100 p-8 rounded-[2rem] flex items-start gap-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm border border-red-100">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-red-900 mb-1 tracking-tight">Perhatian: Selisih Uang Ditemukan</h4>
                        <p className="text-red-700/80 text-sm font-medium max-w-2xl leading-relaxed">
                            Beberapa shift tercatat memiliki selisih antara saldo yang diharapkan sistem dan uang fisik yang dihitung kasir. Silakan tinjau log pembatalan (VOID) atau hubungi kasir yang bersangkutan untuk klarifikasi.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
