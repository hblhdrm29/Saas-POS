"use client";

import React, { useState, useEffect } from "react";
import { X, Clock, Wallet, History, AlertTriangle, CheckCircle2, User, Power, Loader2 } from "lucide-react";
import { getShiftDetails, closeShiftByAdmin } from "@/app/actions/shift";

interface ShiftDetailModalProps {
  shiftId: number | null;
  onClose: () => void;
}

export default function ShiftDetailModal({ shiftId, onClose }: ShiftDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (shiftId) {
      fetchDetails();
    }
  }, [shiftId]);

  async function fetchDetails() {
    setLoading(true);
    try {
      const res = await getShiftDetails(shiftId!);
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleForceClose() {
    if (!confirm("Apakah Anda yakin ingin menutup shift ini secara paksa?")) return;
    
    setClosing(true);
    try {
      const res = await closeShiftByAdmin(shiftId!);
      if (res.success) {
        fetchDetails();
      } else {
        alert(res.error || "Gagal menutup shift");
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem");
    } finally {
      setClosing(false);
    }
  }

  const formatCurrency = (val: any) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(val));
  };

  if (!shiftId) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col relative border border-slate-100">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
              <History className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Audit Detail Shift</h3>
              <p className="text-slate-400 text-[11px] font-medium leading-none mt-1 uppercase tracking-wider">
                ID Shift: #{shiftId} • {data?.userName || "Loading..."}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all active:scale-95 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-20 text-slate-300">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest">Memuat Data Audit...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            {data && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left: Summary Metrics */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 space-y-5">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Ikhtisar Kas</h4>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] font-bold text-slate-400">Modal Awal</p>
                        <p className="text-sm font-bold text-slate-900">{formatCurrency(data.startingCash)}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] font-bold text-slate-400">Total Penjualan</p>
                        <p className="text-sm font-bold text-emerald-600">+{formatCurrency(data.totalSalesCash)}</p>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-200">
                        <div className="flex justify-between items-end mb-1">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ekspektasi Kas</p>
                           <p className="text-lg font-black text-blue-600">
                            {formatCurrency(Number(data.startingCash) + Number(data.totalSalesCash))}
                          </p>
                        </div>
                        
                        {data.status === 'CLOSED' && (
                          <>
                            <div className="flex justify-between items-end mb-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Uang Aktual</p>
                              <p className="text-lg font-black text-slate-900">{formatCurrency(data.actualCash)}</p>
                            </div>
                            
                            <div className="pt-2 mt-2 border-t border-dashed border-slate-200 flex justify-between items-center">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selisih</p>
                              {(() => {
                                const expected = Number(data.startingCash) + Number(data.totalSalesCash);
                                const diff = Number(data.actualCash) - expected;
                                const isMatch = Math.abs(diff) <= 1;
                                return (
                                  <p className={`text-sm font-black ${isMatch ? 'text-emerald-500' : diff < 0 ? 'text-red-500' : 'text-amber-500'}`}>
                                    {isMatch ? 'PAS / MATCH' : formatCurrency(diff)}
                                  </p>
                                );
                              })()}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-[2rem] p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Transaksi</p>
                    <p className="text-2xl font-black text-slate-900">{data.transactions?.length || 0} <span className="text-slate-300 text-xs font-bold uppercase">Order</span></p>
                  </div>

                  <div className={`p-6 rounded-[2rem] border flex flex-col items-center text-center space-y-3 ${
                    data.status === 'OPEN' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'
                  }`}>
                    {data.status === 'OPEN' ? (
                      <>
                        <AlertTriangle className="w-8 h-8 text-amber-500" />
                        <div>
                          <p className="text-amber-700 font-bold text-[13px]">Shift Masih Aktif</p>
                          <p className="text-amber-600/70 text-[10px] font-medium mt-1">Sesi belum ditutup kasir.</p>
                        </div>
                        <button 
                          disabled={closing}
                          onClick={handleForceClose}
                          className="w-full mt-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-bold text-[11px] shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          {closing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Power className="w-3.5 h-3.5" />}
                          Tutup Shift Paksa
                        </button>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        <div>
                          <p className="text-emerald-700 font-bold text-[13px]">Audit Selesai</p>
                          <p className="text-emerald-600/70 text-[10px] font-medium mt-1 truncate">{new Date(data.endTime).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Transactions Log */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Clock className="w-4 h-4 text-slate-300" /> Log Transaksi Shift
                    </h4>
                    
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {data.transactions?.length > 0 ? (
                        data.transactions.map((tx: any, idx: number) => (
                          <div key={tx.id} className="group bg-white border border-slate-100 p-3.5 rounded-2xl flex items-center justify-between hover:border-blue-200 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-9 h-9 bg-slate-50 group-hover:bg-blue-50 rounded-xl flex items-center justify-center transition-colors">
                                <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-500">
                                  #{(data.transactions.length - idx).toString().padStart(2, '0')}
                                </span>
                              </div>
                              <div>
                                <p className="text-[13px] font-bold text-slate-800">{tx.paymentMethod}</p>
                                <p className="text-[10px] font-medium text-slate-400">{new Date(tx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </div>
                            <p className="text-[13px] font-black text-slate-900">{formatCurrency(tx.totalAmount)}</p>
                          </div>
                        ))
                      ) : (
                        <div className="py-20 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Belum Ada Transaksi</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {data.notes && (
                    <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-[2rem]">
                      <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5" /> Catatan Rekonsiliasi
                      </h5>
                      <p className="text-[13px] font-medium text-amber-800 leading-relaxed italic">{data.notes}</p>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
