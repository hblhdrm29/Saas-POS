"use client";

import { useState } from "react";
import { X, Loader2, UserPlus, Shield, BadgeCheck, Lock, Mail, User } from "lucide-react";
import { createStaff } from "@/app/actions/staff";
import { useRouter } from "next/navigation";

interface StaffFormProps {
    onClose: () => void;
}

export default function StaffForm({ onClose }: StaffFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "CASHIER" as "ADMIN" | "CASHIER",
        shift: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await createStaff(formData);
            if (res.success) {
                router.refresh();
                onClose();
            } else {
                setError(res.error || "Gagal menambahkan.");
            }
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan sistem.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Tambah</h3>
                        <p className="text-slate-400 text-[10px] font-medium leading-none mt-1">Isi detail akun untuk anggota tim baru</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-all active:scale-95 text-slate-300">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-[11px] font-bold border border-red-100 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-red-500" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 ml-1">Nama lengkap</label>
                        <input
                            type="text"
                            required
                            autoComplete="off"
                            placeholder="Isi nama lengkap"
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 ml-1">Username / Email</label>
                        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all overflow-hidden">
                            <input
                                type="text"
                                required
                                autoComplete="off"
                                placeholder="Username"
                                className="flex-1 px-4 py-2 bg-transparent text-[12px] font-bold outline-none placeholder:text-slate-300"
                                value={formData.email.split('@')[0]}
                                onChange={(e) => {
                                    const domain = formData.role === "ADMIN" ? "adminblueiy.com" : "kasirblueiy.com";
                                    setFormData({ ...formData, email: `${e.target.value}@${domain}` });
                                }}
                            />
                            <div className="bg-slate-100/50 px-4 py-2 border-l border-slate-100 min-w-[120px] flex justify-center">
                                <span className="text-[11px] font-bold text-slate-400 font-mono tracking-tight animate-in fade-in slide-in-from-right-1">
                                    @{formData.role === "ADMIN" ? "adminblueiy.com" : "kasirblueiy.com"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 ml-1">Password</label>
                        <input
                            type="password"
                            required
                            minLength={4}
                            autoComplete="new-password"
                            placeholder="Isi password"
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 ml-1">Posisi / Role</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    const username = formData.email.split('@')[0];
                                    setFormData({ 
                                        ...formData, 
                                        role: "ADMIN",
                                        email: username ? `${username}@adminblueiy.com` : "",
                                        shift: ""
                                    });
                                }}
                                className={`flex items-center justify-center p-2.5 rounded-xl border text-[11px] font-bold transition-all ${formData.role === "ADMIN"
                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/10"
                                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                    }`}
                            >
                                <Shield className={`w-3 h-3 mr-2 ${formData.role === "ADMIN" ? "text-white" : "text-slate-300"}`} />
                                Administrator
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const username = formData.email.split('@')[0];
                                    setFormData({ 
                                        ...formData, 
                                        role: "CASHIER",
                                        email: username ? `${username}@kasirblueiy.com` : ""
                                    });
                                }}
                                className={`flex items-center justify-center p-2.5 rounded-xl border text-[11px] font-bold transition-all ${formData.role === "CASHIER"
                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/10"
                                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                    }`}
                            >
                                <BadgeCheck className={`w-3 h-3 mr-2 ${formData.role === "CASHIER" ? "text-white" : "text-slate-300"}`} />
                                Kasir
                            </button>
                        </div>
                    </div>

                    {/* Shift Selection for Cashier */}
                    {formData.role === "CASHIER" && (
                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-500">
                            <label className="text-[10px] font-bold text-slate-400 ml-1">Pilih Jadwal Shift</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'Pagi', label: 'Pagi', time: '08:00 - 16:00' },
                                    { id: 'Siang', label: 'Siang', time: '16:00 - 00:00' },
                                    { id: 'Malam', label: 'Malam', time: '00:00 - 08:00' },
                                ].map((shift) => (
                                    <button
                                        key={shift.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, shift: shift.id })}
                                        className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${formData.shift === shift.id 
                                            ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" 
                                            : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}`}
                                    >
                                        <span className="text-[11px] font-bold">{shift.label}</span>
                                        <span className={`text-[8px] font-medium opacity-60 ${formData.shift === shift.id ? "text-white" : "text-slate-400"}`}>
                                            {shift.time}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <UserPlus className="w-3.5 h-3.5" />
                                    Simpan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
