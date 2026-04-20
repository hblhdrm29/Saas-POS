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
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [finalTotal, setFinalTotal] = useState(0);
    const [actualCash, setActualCash] = useState("");

    const handleExitOnly = async () => {
        setLoading(true);
        await signOut({ callbackUrl: "/login" });
    };

    const handleCheckout = async () => {
        setLoading(true);
        setError(null);

        try {
            const amount = Math.round(Number(activeShift?.startingCash || 0) + Number(activeShift?.totalSalesCash || 0));
            setFinalTotal(amount);

            const res = await closeShift({
                shiftId: activeShift.id,
                // actualCash omitted to trigger server-side automated calculation
            });

            if (res && 'data' in res && res.data?.success) {
                setSuccess(true);
                // Wait 2 seconds then sign out
                setTimeout(async () => {
                    await signOut({ callbackUrl: "/login" });
                }, 2000);
            } else {
                const errorMessage = (res as any)?.serverError || (res as any)?.validationErrors?._errors?.[0] || (res as any)?.error || "Gagal menutup shift. Silakan coba lagi.";
                setError(errorMessage);
                setLoading(false);
            }
        } catch (err: any) {
            console.error("Shift checkout error:", err);
            setError(err.message || "Terjadi kesalahan sistem saat menutup shift.");
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
                    {success ? (
                        <div className="space-y-6 animate-in zoom-in-95 duration-500 text-center py-4">
                            <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-green-500/10 border-4 border-white ring-1 ring-green-100">
                                <Coins className="w-10 h-10 text-green-500 animate-bounce" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-black text-slate-900 tracking-tight">Shift Berhasil Ditutup!</h4>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Tersimpan</p>
                                    <p className="text-sm font-black text-slate-900">Rp {formatInputNumber(finalTotal.toString())}</p>
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium">Anda akan dialihkan ke layar login dalam beberapa saat...</p>
                            <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto relative overflow-hidden">
                                <div className="absolute inset-y-0 left-0 bg-green-500 w-full animate-progress-shrink origin-left" />
                            </div>
                        </div>
                    ) : step === "SELECT" ? (
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
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[11px] font-bold flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                    {error}
                                </div>
                            )}
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
                                    readOnly
                                    placeholder="0"
                                    className="w-full pl-14 pr-8 py-5 bg-slate-100 border border-slate-100 rounded-[1.5rem] text-xl font-black text-slate-900 outline-none cursor-not-allowed"
                                    value={activeShift ? formatInputNumber(Math.round(Number(activeShift.startingCash || 0) + Number(activeShift.totalSalesCash || 0)).toString()) : "0"}
                                />
                                <p className="text-[10px] text-center text-slate-400 font-bold mt-3 animate-pulse italic">
                                    Sistem telah menghitung total penjualan otomatis
                                </p>
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
                                    disabled={loading}
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
