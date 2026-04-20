"use client";

import { useState } from "react";
import { X, LogOut, Receipt, ArrowRight, Loader2, Coins } from "lucide-react";
import { signOut } from "next-auth/react";
import { closeShift } from "@/app/actions/shift";

interface ShiftLogoutModalProps {
    activeShift: any;
    onClose: () => void;
}

export default function ShiftLogoutModal({ activeShift, onClose }: ShiftLogoutModalProps) {
    const [step, setStep] = useState<"SELECT" | "CASH_INPUT">("SELECT");
    const [loading, setLoading] = useState(false);
    const [actualCash, setActualCash] = useState("");

    const handleExitOnly = async () => {
        setLoading(true);
        await signOut({ callbackUrl: "/login" });
    };

    const handleCheckout = async () => {
        if (!actualCash) return;
        setLoading(true);
        const amount = Number(actualCash.replace(/\./g, ""));
        
        try {
            const res = await closeShift({
                shiftId: activeShift.id,
                actualCash: amount,
            });

            if (res?.success) {
                await signOut({ callbackUrl: "/login" });
            } else {
                alert("Gagal menutup shift. Silakan coba lagi.");
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const formatInputNumber = (val: string) => {
        const cleanValue = val.replace(/\D/g, "");
        return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
                {/* Header */}
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Konfirmasi Keluar</h3>
                        <p className="text-slate-400 text-[10px] font-medium leading-none mt-1 uppercase tracking-wider">Session Management</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        disabled={loading}
                        className="p-2 hover:bg-slate-50 rounded-xl transition-all active:scale-95 text-slate-300 hover:text-slate-900"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-8">
                    {step === "SELECT" ? (
                        <div className="space-y-4">
                            {activeShift ? (
                                <>
                                    <button
                                        onClick={() => setStep("CASH_INPUT")}
                                        className="w-full flex items-center gap-4 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] transition-all group group-active:scale-95 shadow-lg shadow-blue-500/10"
                                    >
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                            <Receipt className="w-6 h-6" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <p className="font-black text-sm">Tutup Shift & Keluar</p>
                                            <p className="text-[10px] font-medium opacity-70">Checkout kasir dan rekap harian</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                                    </button>

                                    <button
                                        onClick={handleExitOnly}
                                        disabled={loading}
                                        className="w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-[1.5rem] transition-all group group-active:scale-95 border border-slate-100/50"
                                    >
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                            <LogOut className="w-6 h-6" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <p className="font-bold text-sm">Keluar Saja (Exit)</p>
                                            <p className="text-[10px] font-medium text-slate-400">Logout tanpa menutup shift</p>
                                        </div>
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-300" /> : <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleExitOnly}
                                    disabled={loading}
                                    className="w-full flex items-center gap-4 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] transition-all group group-active:scale-95 shadow-lg shadow-blue-500/10"
                                >
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                        <LogOut className="w-6 h-6" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="font-black text-sm">Konfirmasi Exit</p>
                                        <p className="text-[10px] font-medium opacity-70">Anda tidak memiliki shift aktif</p>
                                    </div>
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 text-center space-y-3">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                    <Coins className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest">Input Kas Akhir</p>
                                    <p className="text-slate-500 text-[11px] font-medium">Hitung total uang fisik di laci saat ini</p>
                                </div>
                            </div>

                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="0"
                                    className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-xl font-black text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                                    value={actualCash}
                                    onChange={(e) => setActualCash(formatInputNumber(e.target.value))}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep("SELECT")}
                                    disabled={loading}
                                    className="flex-1 py-4 bg-slate-50 text-slate-500 text-[12px] font-bold rounded-2xl hover:bg-slate-100 transition-all"
                                >
                                    Kembali
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    disabled={loading || !actualCash}
                                    className="flex-[2] py-4 bg-blue-600 text-white text-[12px] font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan & Tutup"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Safety hint */}
                <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        Blueiy POS • Security Session Management v2.1
                    </p>
                </div>
            </div>
        </div>
    );
}
