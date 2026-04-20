"use client";

import { useState } from "react";
import { 
  Ticket, 
  Plus, 
  Search, 
  Trash2, 
  Calendar, 
  Percent, 
  Banknote, 
  Copy, 
  Check, 
  Edit3, 
  MoreVertical,
  X,
  AlertCircle,
  Loader2
} from "lucide-react";
import { createPromotion, deletePromotion, updatePromotion } from "@/app/actions/promotion";
import { useRouter } from "next/navigation";

export default function PromotionManager({ initialPromotions }: { initialPromotions: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingPromo, setEditingPromo] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        code: "",
        type: "PERCENTAGE",
        value: 0,
        minTransaction: 0,
        isActive: true
    });

    const filteredPromotions = initialPromotions.filter(p => 
        p.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenAdd = () => {
        setEditingPromo(null);
        setFormData({ code: "", type: "PERCENTAGE", value: 0, minTransaction: 0, isActive: true });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (promo: any) => {
        setEditingPromo(promo);
        setFormData({ 
            code: promo.code, 
            type: promo.type, 
            value: Number(promo.value), 
            minTransaction: Number(promo.minTransaction), 
            isActive: promo.isActive 
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = {
                code: formData.code,
                type: formData.type as any,
                value: Number(formData.value),
                minTransaction: Number(formData.minTransaction),
                isActive: formData.isActive
            };

            const res = editingPromo 
                ? await updatePromotion({ ...data, id: editingPromo.id })
                : await createPromotion(data);
            
            if (res.success) {
                setIsModalOpen(false);
                router.refresh();
            } else {
                alert("Error: " + (!res.success ? res.error : "Failed to process promotion"));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        setIsSubmitting(true);
        try {
            const res = await deletePromotion({ id: deletingId });
            if (res.success) {
                setDeletingId(null);
                router.refresh();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Promotions & Vouchers</h1>
                    <p className="text-slate-400 text-sm font-medium mt-1">Buat kode diskon untuk meningkatkan penjualan Anda.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Cari kode promo..." 
                            className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all w-64 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleOpenAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-[1.5rem] font-bold text-[13px] flex items-center gap-2 shadow-xl shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" /> Tambah Promo
                    </button>
                </div>
            </div>

            {/* Voucher Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPromotions.length === 0 ? (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Ticket className="w-10 h-10 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold text-sm">Belum ada promo yang ditemukan.</p>
                    </div>
                ) : (
                    filteredPromotions.map((promo) => (
                        <div key={promo.id} className={`group relative bg-white border-2 transition-all duration-300 rounded-[2.5rem] overflow-hidden flex flex-col ${promo.isActive ? 'border-slate-50 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-900/5' : 'border-slate-100 opacity-60'}`}>
                            {/* Card Content */}
                            <div className="p-8 flex-1">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${promo.type === 'PERCENTAGE' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {promo.type === 'PERCENTAGE' ? <Percent className="w-6 h-6" /> : <Banknote className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">{promo.type}</p>
                                            <h3 className="text-2xl font-black text-slate-900 leading-none">
                                                {promo.type === 'PERCENTAGE' ? `${promo.value}%` : formatCurrency(Number(promo.value))}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleOpenEdit(promo)}
                                            className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => setDeletingId(promo.id)}
                                            className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Dotted Divider for Ticket Look */}
                                    <div className="relative py-2">
                                        <div className="absolute -left-12 -translate-y-1/2 top-1/2 w-8 h-8 bg-[#F8FAFC] border-r-2 border-slate-50 rounded-full"></div>
                                        <div className="absolute -right-12 -translate-y-1/2 top-1/2 w-8 h-8 bg-[#F8FAFC] border-l-2 border-slate-50 rounded-full"></div>
                                        <div className="border-t-2 border-dashed border-slate-100"></div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Kode Voucher</p>
                                            <p className="text-lg font-black text-blue-600 tracking-wider font-mono uppercase">{promo.code}</p>
                                        </div>
                                        <button 
                                            onClick={() => copyToClipboard(promo.code)}
                                            className={`p-3 rounded-2xl transition-all active:scale-90 ${copiedCode === promo.code ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                                        >
                                            {copiedCode === promo.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between text-[11px] font-bold">
                                        <span className="text-slate-400">Min. Belanja</span>
                                        <span className="text-slate-900">{formatCurrency(Number(promo.minTransaction))}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-[11px] font-bold pt-1">
                                        <span className="text-slate-400">Status</span>
                                        <span className={`flex items-center gap-1.5 ${promo.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${promo.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                            {promo.isActive ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal for Add/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{editingPromo ? 'Edit Promotion' : 'Promo Baru'}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Isi detail promo Anda</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-full transition-colors text-slate-400"><X className="w-6 h-6" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama / Kode Promo</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[15px] font-black outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all uppercase placeholder:text-slate-300"
                                    placeholder="CONTOH: HEMAT50"
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jenis Diskon</label>
                                    <select 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:bg-white transition-all appearance-none cursor-pointer"
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option value="PERCENTAGE">Persentase (%)</option>
                                        <option value="NOMINAL">Nominal (Rp)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nilai Diskon</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            required
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:bg-white transition-all tabular-nums"
                                            value={formData.value}
                                            onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 text-[11px] font-bold">
                                            {formData.type === 'PERCENTAGE' ? '%' : 'Rp'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Minimal Belanja</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:bg-white transition-all tabular-nums"
                                        value={formData.minTransaction}
                                        onChange={(e) => setFormData({...formData, minTransaction: Number(e.target.value)})}
                                    />
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 text-[11px] font-bold">Rp</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-black text-slate-900">Status Aktif</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Promo dapat digunakan</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 text-slate-400 hover:text-slate-600 font-bold text-sm transition-all"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Memproses...' : editingPromo ? 'Simpan Perubahan' : 'Buat Promo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 mb-2">Hapus Promo?</h4>
                        <p className="text-slate-400 text-xs font-bold mb-8 text-center px-4 uppercase tracking-widest opacity-60">Tindakan ini permanen</p>

                        <div className="grid grid-cols-2 gap-3 w-full">
                            <button
                                onClick={() => setDeletingId(null)}
                                className="py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold text-xs hover:bg-slate-100 transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isSubmitting}
                                className="py-4 bg-red-600 text-white rounded-2xl font-bold text-xs hover:bg-red-700 shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Ya, Hapus"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
