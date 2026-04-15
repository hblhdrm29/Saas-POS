"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  X, 
  CreditCard, 
  Banknote, 
  QrCode,
  Printer,
  ChevronRight
} from "lucide-react";
import { processCheckout } from "@/app/actions/transaction";

import logoBlueiy from "../../assets/logo/blueiy_premium.png";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  sku: string;
  stock: number;
  categoryId: number | null;
}

interface Category {
  id: number;
  name: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function POSClient({ 
  initialProducts, 
  initialCategories 
}: { 
  initialProducts: Product[],
  initialCategories: Category[]
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastTransactionId, setLastTransactionId] = useState<number | null>(null);

  // Clean initial products and handle state (Filter out junk data)
  const cleanedProducts = useMemo(() => {
    return initialProducts
      .filter(p => {
        const name = p.name.toLowerCase();
        const sku = p.sku.toLowerCase();
        const junkPatterns = ["001", "002", "003", "bla bla", "test", "mock", "dummy", "barang 1", "barang 2", "untitled"];
        
        // Hide if any junk pattern is in name or SKU
        const isJunk = junkPatterns.some(pattern => name.includes(pattern) || sku.includes(pattern));
        return !isJunk;
      })
      .map(p => ({
        ...p,
        name: p.name.replace(/ dingin/gi, "")
      }));
  }, [initialProducts]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return cleanedProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === null || p.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, cleanedProducts]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: Math.min(newQty, item.stock) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const totalAmount = subtotal + tax;

  const handleCheckout = async () => {
    if (cart.length === 0 || isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await processCheckout({
        paymentMethod,
        totalAmount,
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      });

      if (result.success) {
        setLastTransactionId(result.data.transactionId);
        setShowSuccessModal(true);
        setCart([]);
      } else {
        alert("Checkout failed: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  // Quick Pay Amounts
  const quickPayAmounts = [50000, 100000, 200000, 500000];

  return (
    <div className="flex-1 flex overflow-hidden bg-[#F8FAFC]">
      {/* Main Terminal Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Search and Categories */}
        <header className="bg-white border-b px-8 py-4 flex flex-col gap-4 sticky top-0 z-10">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
               <Image src={logoBlueiy} alt="Logo" width={80} height={25} className="object-contain" />
            </div>
            <div className="relative flex-1 max-w-lg group">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Find products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all outline-none text-sm font-medium"
              />
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === null ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
            >
              All Categories
            </button>
            {initialCategories.map(cat => {
              const cleanName = cat.name.replace(/ dingin/gi, "");
              return (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
                >
                  {cleanName}
                </button>
              );
            })}
            {/* Added manual fallback tabs if not in DB */}
            {!initialCategories.some(c => c.name.toLowerCase() === 'makanan') && (
              <button 
                onClick={() => setSelectedCategory(-100)} // Mock ID
                className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === -100 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
              >
                Makanan
              </button>
            )}
            {!initialCategories.some(c => c.name.toLowerCase() === 'lainnya') && (
              <button 
                onClick={() => setSelectedCategory(-200)} // Mock ID
                className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === -200 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
              >
                Lainnya
              </button>
            )}
          </div>
        </header>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-8 pt-6 scroll-smooth">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                onClick={() => addToCart(product)}
                className={`group bg-white p-5 rounded-[2rem] border-2 transition-all cursor-pointer relative flex flex-col justify-between aspect-[1/1.1] ${product.stock <= 0 ? 'opacity-50 grayscale cursor-not-allowed border-slate-100' : 'border-transparent hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-900/10 active:scale-95'}`}
              >
                {/* Stock Badge */}
                <div className={`absolute top-4 right-4 px-2 py-1 rounded-lg text-[9px] font-bold ${product.stock < 5 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}>
                  Stock: {product.stock}
                </div>

                <div className="flex-1 flex items-center justify-center mb-4">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-400 transition-colors">
                      <ShoppingCart className="w-8 h-8 opacity-20" />
                   </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight mb-2 group-hover:text-blue-700 transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-blue-600 font-bold text-sm">{formatCurrency(product.price)}</p>
                    <span className="text-[10px] text-slate-400 font-medium font-mono">{product.sku}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                <Search className="w-12 h-12 opacity-10" />
                <p className="font-bold text-sm">No products found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart / Checkout Sidebar */}
      <div className="w-[450px] bg-white border-l border-slate-100 flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.02)] z-20">
        <header className="p-8 pb-4 flex items-center justify-between border-b border-slate-50 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-slate-800" />
              {cart.length > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">{cart.reduce((a,b) => a+b.quantity, 0)}</span>}
            </div>
            <h2 className="text-lg font-bold text-slate-900">Current Order</h2>
          </div>
          <button 
            onClick={() => setCart([])}
            className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </header>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-8 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex gap-4 p-4 rounded-2xl border border-slate-50 bg-white group hover:border-slate-200 transition-all">
               <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate mb-1">{item.name}</h4>
                  <p className="text-[10px] font-bold text-blue-600">{formatCurrency(item.price)}</p>
               </div>
               
               <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-slate-600 hover:text-blue-600 shadow-sm border border-slate-100 active:scale-90 transition-all"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-black">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-slate-600 hover:text-blue-600 shadow-sm border border-slate-100 active:scale-90 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
               </div>

               <button 
                onClick={() => removeFromCart(item.id)}
                className="text-slate-200 hover:text-red-500 transition-colors p-2"
               >
                <Trash2 className="w-4 h-4" />
               </button>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 pt-20">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mb-6">
                <ShoppingCart className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-sm font-bold opacity-60">Your cart is empty</p>
              <p className="text-xs opacity-40">Select items to start order</p>
            </div>
          )}
        </div>

        {/* Summary & Checkout Area */}
        <div className="p-8 pt-4 bg-white border-t border-slate-100">
          {/* Payment Methods */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { id: 'CASH', label: 'Cash', icon: Banknote },
              { id: 'CARD', label: 'Card', icon: CreditCard },
              { id: 'QRIS', label: 'QRIS', icon: QrCode },
            ].map(method => (
              <button 
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex flex-col items-center py-3 rounded-2xl border-2 transition-all ${paymentMethod === method.id ? 'border-blue-600 bg-blue-50/30 text-blue-700' : 'border-slate-50 text-slate-500 hover:border-slate-200'}`}
              >
                <method.icon className={`w-5 h-5 mb-1 ${paymentMethod === method.id ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-[10px] font-bold">{method.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500 border-b border-dashed border-slate-200 pb-4">
              <span>Tax (10%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Pay</p>
                <p className="text-2xl font-black text-slate-900 leading-none">{formatCurrency(totalAmount)}</p>
              </div>
              {cart.length > 0 && (
                <div className="flex gap-2">
                  <button 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-xl shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Pay amounts */}
          <div className="flex flex-wrap gap-2 mt-2">
            {quickPayAmounts.map(amount => (
              <button 
                key={amount}
                className="px-3 py-1.5 rounded-lg border border-slate-100 text-[10px] font-bold text-slate-500 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all"
                onClick={() => {
                  // Simulate quick pay if total is less than amount
                  if (amount >= totalAmount) {
                    handleCheckout();
                  }
                }}
              >
                {formatCurrency(amount)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="bg-blue-600 p-12 flex flex-col items-center text-white relative">
               <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 scale-110">
                  <CheckCircle2 className="w-12 h-12 text-white" />
               </div>
               <h3 className="text-2xl font-black mb-2">Order Success!</h3>
               <p className="text-blue-100 text-xs font-medium opacity-80 uppercase tracking-widest">#{lastTransactionId}</p>
               
               <button 
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
               >
                <X className="w-5 h-5" />
               </button>
            </div>
            
            <div className="p-10 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                 <p className="text-[11px] font-bold text-slate-400 mb-1">Items Summary</p>
                 <p className="text-sm font-black text-slate-800">Payment {paymentMethod}</p>
              </div>

              <div className="flex gap-3">
                 <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all active:scale-95"
                 >
                  New Order
                 </button>
                 <button 
                  className="w-16 h-14 flex items-center justify-center bg-slate-100 text-slate-900 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                  onClick={() => window.print()}
                 >
                  <Printer className="w-5 h-5" />
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
