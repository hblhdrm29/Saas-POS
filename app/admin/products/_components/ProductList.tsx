"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  MoreVertical,
  AlertCircle,
  Package,
  Filter
} from "lucide-react";
import ProductForm from "./ProductForm";
import { deleteProduct } from "@/app/actions/product";

interface ProductListProps {
  initialProducts: any[];
  categories: any[];
}

export default function ProductList({ initialProducts, categories }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialProducts, searchTerm]);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

    setIsDeleting(id);
    try {
      const res = await deleteProduct({ id });
      if (!res.success) alert(res.error);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsDeleting(null);
    }
  };

  const formatCurrency = (val: string | number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(val));
  };

  return (
    <div className="space-y-6 relative">

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative z-30">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all text-[13px] font-medium placeholder:text-slate-400"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto relative z-50">
          <button
            onClick={() => { setEditingProduct(null); setShowForm(true); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0066FF] text-white rounded-xl text-[13px] font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 tracking-tight cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-tight uppercase">No</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-tight uppercase border-l border-slate-100/30">Produk</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-tight uppercase border-l border-slate-100/30">Kategori</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-tight uppercase border-l border-slate-100/30">Harga</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-tight uppercase border-l border-slate-100/30">Stok</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-tight uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product, index) => (
                <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-300 group-hover:text-slate-500 transition-colors">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center relative overflow-hidden shadow-sm">
                        {product.image ? (
                           <img 
                              src={product.image} 
                              alt={product.name}
                              className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                           />
                        ) : (
                           <Package className="w-5 h-5 text-slate-200" />
                        )}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-slate-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">{product.name}</p>
                        <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tight bg-slate-100/50 px-1.5 py-0.5 rounded border border-slate-200/50">#{product.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-bold text-slate-500 tracking-tight px-2 py-1 bg-slate-100/50 rounded-lg border border-slate-200/50">
                      {product.categoryId ? categories.find(c => c.id === product.categoryId)?.name : "General"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-black text-slate-900 tabular-nums">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                       <span className={`text-[12px] font-black tabular-nums ${product.stock <= product.lowStockThreshold ? 'text-red-600' : 'text-slate-700'}`}>
                         {product.stock} <span className="text-[10px] font-bold text-slate-300 ml-1">Items</span>
                       </span>
                       {product.stock <= product.lowStockThreshold && (
                         <div className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[9px] font-bold text-red-500 tracking-tight">Low Stock</span>
                         </div>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => { setEditingProduct(product); setShowForm(true); }}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeleting === product.id}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Simulation */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/20">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Showing:</span>
                <select className="bg-transparent text-[11px] font-bold text-slate-900 outline-none cursor-pointer">
                   <option>10</option>
                   <option>25</option>
                   <option>50</option>
                </select>
             </div>
          </div>
          
          <div className="flex items-center gap-1.5">
             <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-400 hover:bg-white transition-all">Previous</button>
             <button className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-[11px] shadow-sm">1</button>
             <button className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 font-bold text-[11px] hover:bg-white transition-all">2</button>
             <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-400 hover:bg-white transition-all">Next</button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[9999] pointer-events-auto">
          <ProductForm
            product={editingProduct}
            categories={categories}
            onClose={() => { setShowForm(false); setEditingProduct(null); }}
            onSuccess={() => { setShowForm(false); setEditingProduct(null); }}
          />
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-slate-300 gap-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm mt-6">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
             <Search className="w-8 h-8 opacity-20" />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-800 text-sm tracking-tight">Tidak ada produk ditemukan</p>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Coba kata kunci lain atau tambahkan produk baru.</p>
          </div>
        </div>
      )}
    </div>
  );
}
