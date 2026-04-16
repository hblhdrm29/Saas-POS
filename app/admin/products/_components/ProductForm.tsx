"use client";

import { useState, useRef } from "react";
import { X, Loader2, Save, Upload, ImageIcon, Trash2, AlertCircle, ChevronLeft } from "lucide-react";
import { createProduct, updateProduct, uploadImage, getNextSku } from "@/app/actions/product";
import { useEffect } from "react";

interface ProductFormProps {
  product?: any;
  categories: any[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductForm({ product, categories, onClose, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.image || "");
  const [sku, setSku] = useState(product?.sku || "");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(product?.categoryId || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!product;

  // Auto SKU logic
  useEffect(() => {
    if (!isEdit && selectedCategory) {
      const fetchSku = async () => {
        const res = await getNextSku({ categoryId: selectedCategory });
        if (res.success && res.data) {
          setSku(res.data);
        }
      };
      fetchSku();
    }
  }, [selectedCategory, isEdit]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    let imagePath = imagePreview;

    // Handle real file upload if new file selected
    if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);
        const uploadRes = await uploadImage(uploadData);
        if (uploadRes.success) {
            imagePath = uploadRes.data || "";
        } else {
            setError("Gagal mengunggah gambar: " + uploadRes.error);
            setLoading(false);
            return;
        }
    }

    const data = {
      id: product?.id,
      name: formData.get("name") as string,
      sku: formData.get("sku") as string,
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      categoryId: formData.get("categoryId") ? Number(formData.get("categoryId")) : null,
      lowStockThreshold: Number(formData.get("lowStockThreshold")),
      isActive: formData.get("isActive") === "on",
      image: imagePath || null,
    };

    try {
      const res = isEdit ? await updateProduct(data) : await createProduct(data);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || "Something went wrong");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
        <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-95 text-slate-400">
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h3 className="text-lg font-black tracking-tight leading-none">{isEdit ? "Perbarui Produk" : "Produk Baru"}</h3>
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1 opacity-60">Katalog & Stok</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-5 flex flex-col items-center border-b border-slate-100">
            <div className="relative group hover:scale-[1.02] transition-transform">
                <div className="w-28 h-28 rounded-[2rem] bg-white border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shadow-sm relative group-hover:border-blue-400 transition-colors">
                    {imagePreview ? (
                        <img src={imagePreview} className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center p-4">
                            <ImageIcon className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Belum Ada Foto</p>
                        </div>
                    )}
                </div>
                
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                        }
                    }}
                />

                <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-10 h-10 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center hover:bg-blue-700 transition-all active:scale-90"
                    >
                        <Upload className="w-4 h-4" />
                    </button>
                    {imagePreview && (
                        <button 
                            type="button"
                            onClick={() => {
                                setImageFile(null);
                                setImagePreview("");
                                if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="w-10 h-10 bg-white text-red-500 border border-red-50 rounded-xl shadow-lg flex items-center justify-center hover:bg-red-50 transition-all active:scale-90"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-6">Foto Produk (Rasio 1:1)</p>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-[11px] font-bold border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Produk</label>
            <input
              name="name"
              defaultValue={product?.name}
              required
              placeholder="Contoh: Kopi Susu Aren"
              className="w-full px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-[13px] font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
              <select
                name="categoryId"
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-[13px] font-bold"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">SKU / Kode</label>
              <input
                type="text"
                name="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="FOOD 001"
                required
                className="w-full px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-[13px] font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Harga Jual</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[11px] font-bold">Rp</span>
                <input
                  name="price"
                  type="number"
                  defaultValue={product?.price ? Number(product.price) : ""}
                  required
                  placeholder="0"
                  className="w-full pl-10 pr-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-[13px] font-bold tabular-nums"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Stok Awal</label>
              <input
                name="stock"
                type="number"
                defaultValue={product?.stock || 0}
                required
                className="w-full px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-[13px] font-bold tabular-nums"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Batas Minimum</label>
              <input
                name="lowStockThreshold"
                type="number"
                defaultValue={product?.lowStockThreshold || 5}
                required
                className="w-full px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-[13px] font-bold tabular-nums"
              />
            </div>

            <div className="flex items-center gap-3 px-1 pt-5">
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  defaultChecked={product ? product.isActive : true}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                <label htmlFor="isActive" className="ms-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Aktif</label>
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-4.5 rounded-2xl border border-slate-100 text-slate-500 text-sm font-bold hover:bg-slate-50 transition-all font-jakarta"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4.5 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 shadow-xl shadow-slate-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-jakarta"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEdit ? "Simpan Perubahan" : "Simpan Produk"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
