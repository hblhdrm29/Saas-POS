import { auth } from "@/auth";
import { Search, ShoppingCart } from "lucide-react";

export default async function POSPage() {
  const session = await auth();

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Product Grid Area */}
      <div className="flex-1 flex flex-col bg-slate-50">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm z-10">
          <h1 className="text-xl font-bold text-slate-800">Point of Sale</h1>
          <div className="relative max-w-md w-full ml-4">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products, SKU or barcode..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {/* Example Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Mock Item */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between aspect-square">
              <div className="h-2/3 bg-slate-100 rounded-xl mb-3 flex items-center justify-center text-slate-400 group-hover:bg-sky-50 transition-colors">
                Image
              </div>
              <div>
                 <h3 className="font-semibold text-slate-800 truncate">Kopi Susu Gula Aren</h3>
                 <p className="text-sky-600 font-bold mt-1">Rp 18.000</p>
              </div>
            </div>
            {/* Empty State */}
             <div className="col-span-full flex flex-col items-center justify-center h-64 text-slate-400">
                <p>No products available. Add some from the admin dashboard.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Cart / Receipt Area */}
      <div className="w-96 bg-white border-l shadow-2xl z-20 flex flex-col">
        <div className="p-6 border-b flex-1 overflow-auto">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <ShoppingCart className="w-5 h-5" />
            Current Order
          </h2>
          
          <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-sm">
            Cart is empty. Select products to begin.
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>Rp 0</span>
            </div>
            <div className="flex justify-between text-slate-600 border-b pb-3">
              <span>Tax (10%)</span>
              <span>Rp 0</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-slate-800">
              <span>Total</span>
              <span>Rp 0</span>
            </div>
          </div>
          
          <button className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-sky-500/30 transition-all flex items-center justify-center gap-2">
             Charge
          </button>
        </div>
      </div>
    </div>
  );
}
