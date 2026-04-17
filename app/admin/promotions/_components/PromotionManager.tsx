"use client";

import { useState } from "react";
import { Ticket, Plus, Search, Trash2, Calendar, Percent, Banknote } from "lucide-react";
import { createPromotion } from "@/app/actions/promotion";
import { useRouter } from "next/navigation";

export default function PromotionManager({ initialPromotions }: { initialPromotions: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        code: "",
        type: "PERCENTAGE",
        value: 0,
        minTransaction: 0,
        isActive: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await createPromotion({
                code: formData.code,
                type: formData.type as any,
                value: Number(formData.value),
                minTransaction: Number(formData.minTransaction),
            });
            
            if (res.success && res.data.success) {
                setIsModalOpen(false);
                setFormData({ code: "", type: "PERCENTAGE", value: 0, minTransaction: 0, isActive: true });
                router.refresh();
            } else {
                alert("Error: " + (!res.success ? res.error : "Failed to create promotion"));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Promotions & Vouchers</h1>
                    <p className="text-slate-500 text-sm">Manage discount codes and special offers.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" /> Add New Promo
                </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="relative w-72">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search code..." 
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all"
                        />
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-black tracking-wider">
                            <th className="px-8 py-4">Promo Code</th>
                            <th className="px-8 py-4">Type</th>
                            <th className="px-8 py-4">Value</th>
                            <th className="px-8 py-4">Min. Transaction</th>
                            <th className="px-8 py-4">Status</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {initialPromotions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-8 py-20 text-center text-slate-400 text-sm font-medium">
                                    No promotions found. Create one to get started.
                                </td>
                            </tr>
                        ) : (
                            initialPromotions.map((promo) => (
                                <tr key={promo.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                                <Ticket className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <span className="font-bold text-slate-800 tracking-wider">{promo.code}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${promo.type === 'PERCENTAGE' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {promo.type === 'PERCENTAGE' ? (
                                                <span className="flex items-center gap-1"><Percent className="w-3 h-3" /> Percentage</span>
                                            ) : (
                                                <span className="flex items-center gap-1"><Banknote className="w-3 h-3" /> Nominal</span>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-slate-700">
                                        {promo.type === 'PERCENTAGE' ? `${promo.value}%` : formatCurrency(Number(promo.value))}
                                    </td>
                                    <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                                        {formatCurrency(Number(promo.minTransaction))}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`w-2.5 h-2.5 rounded-full inline-block mr-2 ${promo.isActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`}></span>
                                        <span className="text-xs font-bold text-slate-700">{promo.isActive ? 'Active' : 'Inactive'}</span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Promo Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">New Promotion</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Promo Code</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all uppercase placeholder:text-slate-300"
                                    placeholder="DISKONKECE"
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                                    <select 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white transition-all appearance-none"
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="NOMINAL">Nominal (Rp)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Value</label>
                                    <input 
                                        type="number" 
                                        required
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white transition-all"
                                        value={formData.value}
                                        onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Min. Transaction (Optional)</label>
                                <input 
                                    type="number" 
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white transition-all"
                                    value={formData.minTransaction}
                                    onChange={(e) => setFormData({...formData, minTransaction: Number(e.target.value)})}
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black text-sm shadow-xl shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 mt-4"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Promotion'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function X(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}
