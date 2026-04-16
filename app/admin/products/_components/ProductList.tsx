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
    <div className="space-y-10">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#0066FF] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex-1 max-w-lg w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:bg-white focus:border-[#0066FF] focus:ring-4 focus:ring-blue-50 transition-all text-[14px] font-bold placeholder:text-slate-400"
          />
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
             <span className="text-[12px] font-bold text-slate-400">Show :</span>
             <select className="bg-transparent text-[12px] font-black text-slate-800 outline-none cursor-pointer">
                <option>10</option>
                <option>25</option>
                <option>50</option>
             </select>
             <span className="text-[12px] font-bold text-slate-400">Entries</span>
          </div>
          <button
            onClick={() => { setEditingProduct(null); setShowForm(true); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-4 bg-[#0066FF] text-white rounded-[1.5rem] text-[14px] font-black shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden p-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#EBF5FF]">
                <th className="px-10 py-7 text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-blue-100 rounded-tl-[2.5rem]">No</th>
                <th className="px-6 py-7 text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-blue-100">Product Info</th>
                <th className="px-6 py-7 text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-blue-100">Category</th>
                <th className="px-6 py-7 text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-blue-100 text-center">Price</th>
                <th className="px-6 py-7 text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-blue-100 text-center">Stock</th>
                <th className="px-10 py-7 text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-blue-100 text-right rounded-tr-[2.5rem]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product, index) => (
                <tr key={product.id} className="group hover:bg-slate-50 transition-all duration-300">
                  <td className="px-10 py-6 text-[13px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                    {index + 1}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden group-hover:shadow-md transition-shadow">
                        {product.image ? (
                           <img 
                              src={product.image} 
                              alt={product.name}
                              className="absolute inset-0 w-full h-full object-cover"
                           />
                        ) : (
                           <Package className="w-6 h-6 text-slate-200" />
                        )}
                      </div>
                      <div>
                        <p className="text-[15px] font-black text-slate-900 leading-tight mb-1 group-hover:text-[#0066FF] transition-colors">{product.name}</p>
                        <span className="text-[10px] font-black text-slate-400 font-mono tracking-widest bg-slate-100 px-2 py-0.5 rounded-lg">{product.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      {product.categoryId ? categories.find(c => c.id === product.categoryId)?.name : "General"}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-[15px] font-black text-slate-900 text-center tabular-nums italic">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                       <span className={`text-[14px] font-black tabular-nums ${product.stock <= product.lowStockThreshold ? 'text-red-500' : 'text-slate-700'}`}>
                         {product.stock}
                       </span>
                       {product.stock <= product.lowStockThreshold && (
                         <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter animate-pulse">Low Stock</span>
                       )}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button
                        onClick={() => { setEditingProduct(product); setShowForm(true); }}
                        className="w-11 h-11 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-green-500 hover:border-green-500 hover:rotate-6 transition-all shadow-sm"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeleting === product.id}
                        className="w-11 h-11 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-500 hover:-rotate-6 transition-all shadow-sm disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Simulation */}
        <div className="p-10 border-t border-slate-50 flex justify-end bg-white">
          <div className="flex items-center gap-2">
             <button className="w-11 h-11 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">‹</button>
             <button className="w-11 h-11 rounded-full bg-[#0066FF] text-white font-black text-[13px] shadow-xl shadow-blue-500/20">1</button>
             <button className="w-11 h-11 rounded-full border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors text-[13px] font-bold">2</button>
             <button className="w-11 h-11 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">›</button>
          </div>
        </div>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onClose={() => { setShowForm(false); setEditingProduct(null); }}
          onSuccess={() => { setShowForm(false); setEditingProduct(null); }}
        />
      )}

      {filteredProducts.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-slate-300 gap-6 bg-white rounded-[3rem] border border-slate-100 shadow-sm mt-6">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
             <Search className="w-10 h-10 opacity-20" />
          </div>
          <div className="text-center">
            <p className="font-black text-slate-800 text-lg">No products found</p>
            <p className="text-[13px] font-medium text-slate-400 mt-2">Try searching for something else or add a new product.</p>
          </div>
        </div>
      )}
    </div>
  );
}
