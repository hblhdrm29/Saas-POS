"use client";

import { useState, useMemo } from "react";
import { 
  Plus, Search, Filter, Ticket, Edit2, Trash2, 
  ToggleLeft, ToggleRight, X, Calendar, 
  Loader2, AlertCircle
} from "lucide-react";
import { 
  createPromotion, 
  updatePromotion, 
  deletePromotion, 
  togglePromotionStatus 
} from "@/app/actions/promotion_actions";

interface Promotion {
  id: number;
  name: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  maxDiscount: number | null;
  quota: number;
  used: number;
  expiry: Date;
  active: boolean;
}

interface PromotionsClientProps {
  initialData: Promotion[];
}

const statusStyles: Record<string, string> = {
  "Aktif": "bg-emerald-50 text-emerald-600 border-emerald-100",
  "Habis": "bg-amber-50 text-amber-600 border-amber-100",
  "Kedaluwarsa": "bg-rose-50 text-rose-600 border-rose-100",
  "Off": "bg-slate-50 text-slate-400 border-slate-100",
};

export default function PromotionsClient({ initialData }: PromotionsClientProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [filterType, setFilterType] = useState("Semua Tipe");
  const [modalType, setModalType] = useState<"create" | "edit" | "delete" | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "Persen",
    value: "",
    minOrder: "0",
    maxDiscount: "",
    quota: "100",
    expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    active: true
  });

  const today = new Date();

  const getStatus = (v: Promotion) => {
    if (!v.active) return "Off";
    if (new Date(v.expiry) < today) return "Kedaluwarsa";
    if (v.used >= v.quota) return "Habis";
    return "Aktif";
  };

  const filteredRows = useMemo(() => {
    return initialData.filter(v => {
      const status = getStatus(v);
      const matchesSearch = v.code.toLowerCase().includes(search.toLowerCase()) || 
                           v.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "Semua Status" || status === filterStatus;
      const matchesType = filterType === "Semua Tipe" || v.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, filterStatus, filterType, initialData]);

  const stats = [
    { label: "Total Voucher", value: initialData.length, icon: Ticket, color: "text-blue-600" },
    { label: "Voucher Aktif", value: initialData.filter(v => v.active && new Date(v.expiry) >= today).length, icon: Ticket, color: "text-emerald-600" },
    { label: "Total Digunakan", value: initialData.reduce((acc, v) => acc + v.used, 0), icon: Ticket, color: "text-amber-600" },
    { label: "Rata-rata Konversi", value: `${initialData.length ? Math.round((initialData.reduce((acc, v) => acc + (v.used/v.quota), 0) / initialData.length) * 100) : 0}%`, icon: Ticket, color: "text-purple-600" },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  const openCreate = () => {
    setFormData({
      name: "",
      code: "",
      type: "Persen",
      value: "10",
      minOrder: "0",
      maxDiscount: "50000",
      quota: "100",
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      active: true
    });
    setModalType("create");
    setError(null);
  };

  const openEdit = (v: Promotion) => {
    setFormData({
      name: v.name,
      code: v.code,
      type: v.type,
      value: v.value.toString(),
      minOrder: v.minOrder.toString(),
      maxDiscount: v.maxDiscount?.toString() || "",
      quota: v.quota.toString(),
      expiry: new Date(v.expiry).toISOString().split("T")[0],
      active: v.active
    });
    setSelectedId(v.id);
    setModalType("edit");
    setError(null);
  };

  const openDelete = (id: number) => {
    setSelectedId(id);
    setModalType("delete");
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let res;
      if (modalType === "create") {
        res = await createPromotion(formData);
      } else if (modalType === "edit" && selectedId) {
        res = await updatePromotion(selectedId, formData);
      }
      
      if (res?.success) {
        setModalType(null);
      } else {
        setError(res?.error || "Gagal menyimpan data.");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    setIsLoading(true);
    try {
      const res = await deletePromotion(selectedId);
      if (res.success) setModalType(null);
    } catch (err) {
      setError("Gagal menghapus.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = async (id: number, current: boolean) => {
    try {
      await togglePromotionStatus(id, current);
    } catch (err) {
       console.error(err);
    }
  };

  return (
    <div className="font-jakarta">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Ticket className="w-4.5 h-4.5" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">Voucher</h1>
          </div>
          <p className="text-slate-400 text-[11px] font-medium tracking-wide">Kelola kode diskon & promosi toko Anda</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-all active:scale-[0.98] shadow-md shadow-slate-200"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Voucher</span>
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl bg-slate-50 ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest mb-0.5">{stat.label}</p>
              <h3 className="text-xl font-black tabular-nums">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center gap-3 mb-6">
        <div className="relative flex-1 w-full group">
          <Search className="w-3.5 h-3.5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Cari kode atau nama..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-[13px]"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-all">
            <Filter className="w-3 h-3 text-slate-400" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-[12px] font-bold outline-none cursor-pointer text-slate-600"
            >
              <option>Semua Status</option>
              {Object.keys(statusStyles).map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-all">
            <Ticket className="w-3 h-3 text-slate-400" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-[12px] font-bold outline-none cursor-pointer text-slate-600"
            >
              <option>Semua Tipe</option>
              <option>Persen</option>
              <option>Nominal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 tracking-widest border-b border-slate-100">Keterangan & Kode</th>
              <th className="px-4 py-4 text-[9px] font-black text-slate-400 tracking-widest border-b border-slate-100 text-center">Tipe</th>
              <th className="px-4 py-4 text-[9px] font-black text-slate-400 tracking-widest border-b border-slate-100">Diskon</th>
              <th className="px-4 py-4 text-[9px] font-black text-slate-400 tracking-widest border-b border-slate-100">Min. Order</th>
              <th className="px-4 py-4 text-[9px] font-black text-slate-400 tracking-widest border-b border-slate-100">Progress</th>
              <th className="px-4 py-4 text-[9px] font-black text-slate-400 tracking-widest border-b border-slate-100">Berlaku</th>
              <th className="px-4 py-4 text-[9px] font-black text-slate-400 tracking-widest border-b border-slate-100 text-center">Status</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 tracking-widest border-b border-slate-100 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Ticket className="w-10 h-10 text-slate-100" />
                    <p className="text-slate-400 font-bold text-[12px]">Tidak ditemukan</p>
                  </div>
                </td>
              </tr>
            ) : filteredRows.map((v) => {
              const status = getStatus(v);
              const usagePercent = Math.min(100, Math.round((v.used / v.quota) * 100));
              const isExpired = new Date(v.expiry) < today;

              return (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-black text-slate-900 mb-0.5">{v.name}</span>
                      <div className="flex items-center gap-1.5 opacity-60">
                        <Ticket className="w-3 h-3" />
                        <span className="font-mono text-[10px] font-bold tracking-wider uppercase">{v.code}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-md text-[9px] font-black">{v.type}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="text-[12px] font-black text-slate-900 tabular-nums">
                        {v.type === "Persen" ? `${v.value}%` : formatCurrency(v.value)}
                      </p>
                      {v.type === "Persen" && v.maxDiscount && (
                        <p className="text-[9px] font-bold text-slate-300 mt-0.5">Maks {formatCurrency(v.maxDiscount)}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-[12px] font-bold text-slate-500 tabular-nums">
                      {v.minOrder > 0 ? formatCurrency(v.minOrder) : "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="w-[120px]">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-bold text-slate-900 tabular-nums">{v.used} / {v.quota}</span>
                        <span className="text-[9px] font-black text-slate-300">{usagePercent}%</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${usagePercent >= 100 ? 'bg-rose-500' : 'bg-slate-900'}`}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[11px] font-bold ${isExpired ? 'text-rose-600' : 'text-slate-600'} tabular-nums`}>
                      {new Date(v.expiry).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2.5 py-1 rounded-md border text-[9px] font-black whitespace-nowrap ${statusStyles[status]}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEdit(v)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => toggleActive(v.id, v.active)}
                        className={`p-1.5 rounded-lg transition-all ${v.active ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                      >
                        {v.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => openDelete(v.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Form Modal (Create/Edit) */}
      {(modalType === "create" || modalType === "edit") && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[380px] rounded-[1.2rem] shadow-2xl overflow-hidden border border-slate-50 animate-in zoom-in-95 duration-200">
            <div className="px-6 pt-6 pb-2 flex items-center justify-between">
              <h2 className="text-sm font-black tracking-tight text-slate-400">{modalType === "edit" ? "Edit Voucher" : "Voucher Baru"}</h2>
              <button onClick={() => setModalType(null)} className="p-1.5 hover:bg-slate-50 rounded-full transition-colors text-slate-200 hover:text-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 pb-6 mt-2">
              {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2.5 text-rose-600 text-[11px] font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <table className="w-full border-collapse">
                <tbody className="align-middle">
                  {/* NAMA PROMO */}
                  <tr>
                    <td className="py-2.5 pr-2 text-[9px] font-black text-slate-300 tracking-widest w-[110px]">Nama Promo *</td>
                    <td className="py-1">
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Promo HUT RI"
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-100 rounded-lg outline-none focus:bg-white focus:border-slate-900 transition-all font-bold text-[12px] placeholder:text-slate-200"
                      />
                    </td>
                  </tr>

                  {/* KODE */}
                  <tr className="group">
                    <td className="py-2.5 pr-2 text-[9px] font-black text-slate-300 tracking-widest">Kode *</td>
                    <td className="py-1">
                      <input 
                        type="text" 
                        value={formData.code} 
                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                        placeholder="DISKON20"
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-100 rounded-lg outline-none focus:bg-white focus:border-slate-900 transition-all font-mono font-bold text-[12px] placeholder:text-slate-200"
                      />
                    </td>
                  </tr>

                  {/* TIPE */}
                  <tr>
                    <td className="py-2.5 pr-2 text-[9px] font-black text-slate-300 tracking-widest">Tipe *</td>
                    <td className="py-1">
                      <select 
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-100 rounded-lg outline-none focus:bg-white focus:border-slate-900 transition-all font-bold text-[12px] appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ccc' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '0.8rem' }}
                      >
                        <option>Persen</option>
                        <option>Nominal</option>
                      </select>
                    </td>
                  </tr>

                  {/* NILAI */}
                  <tr>
                    <td className="py-2.5 pr-2 text-[9px] font-black text-slate-300 tracking-widest">
                      {formData.type === "Persen" ? "Nilai (%) *" : "Nilai (Rp) *"}
                    </td>
                    <td className="py-1">
                      <input 
                        type="number" 
                        value={formData.value}
                        onChange={(e) => setFormData({...formData, value: e.target.value})}
                        placeholder={formData.type === "Persen" ? "20" : "10000"}
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-100 rounded-lg outline-none focus:bg-white focus:border-slate-900 transition-all font-bold text-[12px] placeholder:text-slate-200"
                      />
                    </td>
                  </tr>

                  {/* MIN ORDER */}
                  <tr>
                    <td className="py-2.5 pr-2 text-[9px] font-black text-slate-300 tracking-widest">Min. Item (Rp)</td>
                    <td className="py-1">
                      <input 
                        type="number" 
                        value={formData.minOrder}
                        onChange={(e) => setFormData({...formData, minOrder: e.target.value})}
                        placeholder="0"
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-100 rounded-lg outline-none focus:bg-white focus:border-slate-900 transition-all font-bold text-[12px] placeholder:text-slate-200"
                      />
                    </td>
                  </tr>

                  {/* MAKS DISKON */}
                  <tr>
                    <td className="py-2.5 pr-2 text-[9px] font-black text-slate-300 tracking-widest">Maks (Rp)</td>
                    <td className="py-1">
                      <input 
                        type="number" 
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                        placeholder="—"
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-100 rounded-lg outline-none focus:bg-white focus:border-slate-900 transition-all font-bold text-[12px] placeholder:text-slate-200"
                      />
                    </td>
                  </tr>

                  {/* KUOTA */}
                  <tr>
                    <td className="py-2.5 pr-2 text-[9px] font-black text-slate-300 tracking-widest">Kuota *</td>
                    <td className="py-1">
                      <input 
                        type="number" 
                        value={formData.quota}
                        onChange={(e) => setFormData({...formData, quota: e.target.value})}
                        placeholder="100"
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-100 rounded-lg outline-none focus:bg-white focus:border-slate-900 transition-all font-bold text-[12px] placeholder:text-slate-200"
                      />
                    </td>
                  </tr>

                  {/* BERLAKU HINGGA */}
                  <tr>
                    <td className="py-2.5 pr-2 text-[9px] font-black text-slate-300 tracking-widest">Hingga *</td>
                    <td className="py-1">
                      <input 
                        type="date" 
                        value={formData.expiry}
                        onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-100 rounded-lg outline-none focus:bg-white focus:border-slate-900 transition-all font-bold text-[11px] appearance-none cursor-pointer"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-6 flex gap-2">
                <button 
                  onClick={() => setModalType(null)}
                  disabled={isLoading}
                  className="flex-1 py-2.5 border border-slate-100 hover:bg-slate-50 text-slate-900 rounded-lg font-bold text-[11px] transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-[2] py-2.5 bg-slate-900 hover:bg-black text-white rounded-lg font-black text-[11px] transition-all active:scale-[0.98] shadow-lg shadow-slate-100 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalType === "delete" && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-[320px] rounded-[1.2rem] p-6 shadow-2xl border border-slate-50 text-center">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-slate-900 mb-1">Hapus Voucher?</h3>
              <p className="text-[11px] text-slate-400 font-medium mb-6">Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex gap-2">
                 <button onClick={() => setModalType(null)} className="flex-1 py-2.5 border border-slate-100 rounded-lg text-[11px] font-bold">Batal</button>
                 <button 
                  onClick={handleDelete} 
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-rose-600 text-white rounded-lg text-[11px] font-black shadow-lg shadow-rose-100 disabled:opacity-50"
                 >
                   {isLoading ? "..." : "Hapus"}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
