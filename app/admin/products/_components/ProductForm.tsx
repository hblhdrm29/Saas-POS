"use client";

import { useState, useRef, useEffect } from "react";
import { 
  X, 
  Loader2, 
  Save, 
  Upload, 
  ImageIcon, 
  Trash2, 
  AlertCircle, 
  Package 
} from "lucide-react";
import { createProduct, updateProduct, uploadImage, getNextSku } from "@/app/actions/product";

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
  const [displayPrice, setDisplayPrice] = useState(
    product?.price ? product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    // Prevent starting with multiple zeros
    const cleanValue = value === "" ? "" : parseInt(value).toString();
    const formatted = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setDisplayPrice(formatted);
  };

  const isEdit = !!product;

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
      price: Number(displayPrice.replace(/\./g, "")),
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[400px] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-200 font-jakarta">
        {/* Minimal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-slate-400" />
             </div>
             <div>
                <h3 className="text-[13px] font-bold text-slate-900 leading-none">{isEdit ? "Edit Product" : "New Product"}</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Inventory Management</p>
             </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-lg transition-all text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-0">
          <div className="max-h-[70vh] overflow-y-auto px-6 py-6 space-y-5 custom-scrollbar">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-[10px] font-bold border border-red-100 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Compact Image Section */}
            <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <div className="relative group">
                    <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                        {imagePreview ? (
                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                            <ImageIcon className="w-5 h-5 text-slate-200" />
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
                </div>
                <div>
                   <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">Foto Produk</p>
                   <p className="text-[9px] text-slate-400 font-medium leading-tight mt-0.5">Rasio 1:1</p>
                   <div className="flex gap-2 mt-2">
                       <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                       >
                           {imagePreview ? "Change" : "Upload"}
                       </button>
                       {imagePreview && (
                         <button 
                            type="button"
                            onClick={() => {
                                setImageFile(null);
                                setImagePreview("");
                                if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="px-3 py-1 bg-white border border-red-100 rounded-lg text-[9px] font-bold text-red-500 hover:bg-red-50 transition-all active:scale-95"
                         >
                             Remove
                         </button>
                       )}
                   </div>
                </div>
            </div>

            {/* Info Dasar */}
            <div className="space-y-4">
               {/* Nama */}
               <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Produk</label>
                  <input
                    name="name"
                    defaultValue={product?.name}
                    required
                    placeholder="Contoh: Kopi Susu Gula Aren"
                    className="w-full px-4 py-2 bg-slate-50/50 border border-slate-200/60 rounded-xl focus:bg-white focus:border-[#0066FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all text-[12px] font-bold text-slate-900"
                  />
               </div>

               {/* Grid Metrik */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                    <div className="relative">
                      <select
                        name="categoryId"
                        value={selectedCategory || ""}
                        onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-4 py-2 bg-slate-50/50 border border-slate-200/60 rounded-xl focus:bg-white focus:border-[#0066FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all text-[12px] font-bold text-slate-900 appearance-none"
                      >
                        <option value="">Pilih Kategori</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kode SKU</label>
                    <input
                      type="text"
                      name="sku"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="PROD-XXXX"
                      required
                      className="w-full px-4 py-2 bg-slate-50/50 border border-slate-200/60 rounded-xl focus:bg-white focus:border-[#0066FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all text-[12px] font-bold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Harga Jual</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold uppercase">Rp.</span>
                      <input
                        name="price"
                        type="text"
                        value={displayPrice}
                        onChange={handlePriceChange}
                        required
                        placeholder="0"
                        className="w-full pl-12 pr-4 py-2 bg-slate-50/50 border border-slate-200/60 rounded-xl focus:bg-white focus:border-[#0066FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all text-[12px] font-bold text-slate-900 tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Stok Saat Ini</label>
                    <input
                      name="stock"
                      type="number"
                      defaultValue={product?.stock || 0}
                      required
                      className="w-full px-4 py-2 bg-slate-50/50 border border-slate-200/60 rounded-xl focus:bg-white focus:border-[#0066FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all text-[12px] font-bold text-slate-900 tabular-nums"
                    />
                  </div>
               </div>

               {/* Section Stok & Status */}
               <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Batas Minimum</label>
                    <div className="flex items-center gap-2">
                      <input
                        name="lowStockThreshold"
                        type="number"
                        defaultValue={product?.lowStockThreshold || 5}
                        required
                        className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:border-[#0066FF] outline-none transition-all text-[11px] font-bold text-slate-900 tabular-nums"
                      />
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">Pcs</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Aktif</label>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        id="isActive"
                        defaultChecked={product ? product.isActive : true}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:start-[2.5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="p-6 bg-white border-t border-slate-50 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-500 text-[11px] font-bold hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-3 px-4 rounded-xl bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 shadow-lg shadow-slate-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{isEdit ? "Update Changes" : "Save Product"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
