"use client";

import React, { useState } from "react";
import { 
  User, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight 
} from "lucide-react";
import ShiftDetailModal from "./ShiftDetailModal";

export default function InteractiveShiftTable({ shiftList }: { shiftList: any[] }) {
  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);

  const formatCurrency = (val: any) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(Number(val));
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Staff / Posisi</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Waktu Shift</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Modal Awal</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Penjualan</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ekspektasi</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Uang Kas</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status Audit</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {shiftList.map((shift) => {
              const expected = Number(shift.startingCash) + Number(shift.totalSalesCash);
              const actual = Number(shift.actualCash || 0);
              const diff = actual - expected;
              const isMatch = Math.abs(diff) <= 1;

              return (
                <tr 
                  key={shift.id} 
                  onClick={() => setSelectedShiftId(shift.id)}
                  className="hover:bg-blue-50/30 transition-all group cursor-pointer"
                >
                  {/* Staff */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
                        <User className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-slate-800 tracking-tight whitespace-nowrap">{shift.userName}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{shift.userRole}</span>
                      </div>
                    </div>
                  </td>

                  {/* Waktu */}
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-300" />
                        {new Date(shift.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        <span className="text-slate-200">-</span>
                        {shift.endTime ? new Date(shift.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Aktif'}
                      </div>
                    </div>
                  </td>

                  {/* Modal Awal */}
                  <td className="px-6 py-6 text-right">
                    <span className="text-[11px] font-bold text-slate-500 tabular-nums">
                      {formatCurrency(shift.startingCash).replace('Rp', '').trim()}
                    </span>
                  </td>

                  {/* Penjualan */}
                  <td className="px-6 py-6 text-right">
                    <span className="text-[11px] font-black text-slate-700 tabular-nums">
                      {formatCurrency(shift.totalSalesCash).replace('Rp', '').trim()}
                    </span>
                  </td>

                  {/* Ekspektasi */}
                  <td className="px-6 py-6 text-right">
                    <span className="text-[11px] font-black text-slate-900 tabular-nums">
                      {formatCurrency(expected).replace('Rp', '').trim()}
                    </span>
                  </td>

                  {/* Uang Kas */}
                  <td className="px-6 py-6 text-right">
                    <span className={`text-[12px] font-black tabular-nums ${shift.status === 'CLOSED' ? 'text-blue-600' : 'text-slate-300'}`}>
                      {shift.status === 'CLOSED' ? formatCurrency(actual).replace('Rp', '').trim() : '—'}
                    </span>
                  </td>

                  {/* Status Audit */}
                  <td className="px-6 py-6">
                    <div className="flex justify-center">
                      {shift.status === 'CLOSED' ? (
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-[10px] ${isMatch ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {isMatch ? <CheckCircle2 className="w-3.5 h-3.5" /> : <TrendingUp className={`w-3.5 h-3.5 ${diff < 0 ? 'rotate-90' : ''}`} />}
                          {isMatch ? 'Match' : formatCurrency(Math.abs(diff))}
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded-lg uppercase tracking-widest animate-pulse">Running</div>
                      )}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-6">
                    <div className="text-slate-200 group-hover:text-blue-600 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ShiftDetailModal 
        shiftId={selectedShiftId} 
        onClose={() => setSelectedShiftId(null)} 
      />
    </>
  );
}
