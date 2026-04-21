import { db } from "@/db";
import { shifts, users } from "@/db/schema";
import { auth } from "@/auth";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import React from "react";
import DateFilter from "./_components/DateFilter";
import InteractiveShiftTable from "./_components/InteractiveShiftTable";
import {
    History,
    AlertTriangle,
    Wallet,
    CheckCircle2
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ShiftsPage(props: {
    searchParams: Promise<{ date?: string }>
}) {
    const searchParams = await props.searchParams;
    const session = await auth();
    const user = session?.user as any;

    const dateStr = searchParams.date || new Date().toISOString().split('T')[0];

    // Parse date explicitly to avoid timezone shifts
    const [year, month, day] = dateStr.split('-').map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

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
        .where(and(
            eq(shifts.tenantId, user.tenantId),
            gte(shifts.startTime, startOfDay),
            lte(shifts.startTime, endOfDay)
        ))
        .orderBy(desc(shifts.startTime));

    const formatCurrency = (val: any) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(Number(val));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Shift Reports</h1>
                    <p className="text-slate-400 text-[11px] font-medium leading-none mt-1">Audit kasir dan pemantauan saldo harian secara real-time.</p>
                </div>
                <DateFilter currentDate={dateStr} />
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-[11px] font-bold text-slate-400 tracking-tight mb-2 uppercase">Total Penjualan Tunai</p>
                    <h3 className="text-lg font-black text-slate-900 leading-none">
                        {formatCurrency(shiftList.reduce((acc, s) => acc + Number(s.totalSalesCash), 0))}
                    </h3>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-[11px] font-bold text-slate-400 tracking-tight mb-2 uppercase">Sesi Berjalan</p>
                    <h3 className="text-lg font-black text-slate-900 leading-none">
                        {shiftList.filter(s => s.status === 'OPEN').length} <span className="text-slate-400 text-xs font-bold">Aktif</span>
                    </h3>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-[11px] font-bold text-slate-400 tracking-tight mb-2 uppercase">Selisih Temuan</p>
                    <h3 className="text-lg font-black text-slate-900 leading-none">
                        {shiftList.filter(s => {
                            if (s.status !== 'CLOSED') return false;
                            return Math.abs(Number(s.actualCash) - (Number(s.startingCash) + Number(s.totalSalesCash))) > 1;
                        }).length}
                    </h3>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        <History className="w-4 h-4 text-blue-500" />
                        Log Aktivitas Shift
                    </h3>
                </div>

                <InteractiveShiftTable
                    shiftList={shiftList}
                />
            </div>
        </div>
    );
}
