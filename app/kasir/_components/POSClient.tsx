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
  Wallet,
  Banknote,
  QrCode,
  Printer,
  ChevronRight,
  Clock,
  History,
  LayoutList
} from "lucide-react";
import { processCheckout } from "@/app/actions/transaction";
import { openShift, getActiveShift, closeShift } from "@/app/actions/shift";
import { validatePromoCode } from "@/app/actions/promotion";
import { parkOrder, getParkedOrders, recallParkedOrder, deleteParkedOrder } from "@/app/actions/parked-order";

import logoBlueiy from "../../assets/logo/blueiy_premium.png";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  sku: string;
  stock: number;
  categoryId: number | null;
  image: string | null;
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
  const [lastTotalAmount, setLastTotalAmount] = useState(0);

  // New Multistep Checkout State
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment'>('cart');
  const [amountReceived, setAmountReceived] = useState<string>("");

  // Advanced POS State
  const [activeShift, setActiveShift] = useState<any>(null);
  const [showShiftModal, setShowShiftModal] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState("");

  const [parkedOrdersList, setParkedOrdersList] = useState<any[]>([]);
  const [showRecallModal, setShowRecallModal] = useState(false);

  // Persistence: Load from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("pos_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load saved cart", e);
      }
    }

    // Check for active shift
    const checkShift = async () => {
      const shift = await getActiveShift({});
      if (shift.success && shift.data) {
        setActiveShift(shift.data);
      } else {
        setShowShiftModal(true);
      }
    };
    checkShift();

    // Load parked orders
    const loadParked = async () => {
      const res = await getParkedOrders({});
      if (res.success && res.data) setParkedOrdersList(res.data);
    };
    loadParked();
  }, []);

  // Persistence: Save to LocalStorage when cart changes
  useEffect(() => {
    localStorage.setItem("pos_cart", JSON.stringify(cart));
  }, [cart]);

  // Clean initial products and handle state (Ensure all products are visible)
  const cleanedProducts = useMemo(() => {
    return initialProducts.map(p => ({
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

  // Calculate Discounts
  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === "PERCENTAGE") {
      return (subtotal * Number(appliedPromo.value)) / 100;
    }
    return Number(appliedPromo.value);
  }, [subtotal, appliedPromo]);

  const tax = (subtotal - discountAmount) * 0.04;
  const totalAmount = subtotal - discountAmount + tax;

  const handleOpenShift = async () => {
    const res = await openShift({});
    if (res.success && res.data.success) {
      setActiveShift({ id: res.data.shiftId });
      setShowShiftModal(false);
    } else {
      alert("Error: " + (res.success ? "Failed to open shift" : res.error));
    }
  };

  const handleApplyPromo = async () => {
    setPromoError("");
    const res = await validatePromoCode({ code: promoCode, subtotal });
    if (res.success && res.data.success && res.data.promotion) {
      setAppliedPromo(res.data.promotion);
    } else {
      setPromoError(res.success ? (res.data.error || "Invalid promo code") : res.error);
      setAppliedPromo(null);
    }
  };


  const handleParkOrder = async () => {
    if (cart.length === 0) return;
    const res = await parkOrder({
      customerName: "Order",
      items: cart.map(i => ({ id: i.id, quantity: i.quantity, price: i.price })),
      totalAmount: totalAmount
    });
    if (res.success && res.data.success) {
      setCart([]);
      setAppliedPromo(null);
      // Refresh list
      const parked = await getParkedOrders({});
      if (parked.success && parked.data) setParkedOrdersList(parked.data);
    } else {
      alert("Gagal memarkir pesanan: " + (res.success ? "Terjadi kesalahan" : res.error));
    }
  };

  const handleRecallOrder = async (id: number) => {
    const res = await recallParkedOrder({ parkedOrderId: id });
    if (res.success && res.data) {
      const recalledItems = res.data.items.map((item: any) => {
        const product = cleanedProducts.find(p => p.id === item.productId);
        if (!product) return null;
        return {
          ...product,
          quantity: item.quantity,
          price: Number(item.unitPrice)
        } as CartItem;
      }).filter(Boolean) as CartItem[];

      setCart(recalledItems);
      setShowRecallModal(false);
      // Refresh list
      const parked = await getParkedOrders({});
      if (parked.success && parked.data) setParkedOrdersList(parked.data);
    } else {
      alert("Gagal memanggil pesanan: " + (res.success ? "Data tidak ditemukan" : res.error));
    }
  };

  const handleDeleteParkedOrder = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();

    const res = await deleteParkedOrder({ parkedOrderId: id });
    if (res.success) {
      const parked = await getParkedOrders({});
      if (parked.success && parked.data) setParkedOrdersList(parked.data);
    } else {
      alert("Gagal menghapus pesanan: " + (res.success ? "Terjadi kesalahan" : res.error));
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0 || isProcessing || !activeShift) return;

    setIsProcessing(true);
    try {
      const result = await processCheckout({
        paymentMethod,
        promotionId: appliedPromo?.id || null,
        shiftId: activeShift.id,
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          discountAmount: 0 // Could be added per item if needed
        })),
        subtotal,
        discountAmount,
        taxAmount: tax,
        totalAmount,
      });

      if (result.success) {
        setLastTransactionId(result.data.transactionId);
        setLastTotalAmount(totalAmount);
        setShowSuccessModal(true);
        setCart([]);
        setAppliedPromo(null);
        setPromoCode("");
      } else {
        alert("Error: " + result.error);
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

  const changeAmount = useMemo(() => {
    const received = Number(amountReceived) || 0;
    return Math.max(0, received - totalAmount);
  }, [amountReceived, totalAmount]);

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

                <div className="flex-1 flex items-center justify-center mb-4 relative overflow-hidden rounded-2xl bg-slate-50 group-hover:bg-blue-50 transition-colors">
                  {/* Image with Icon Fallback logic */}
                  <img 
                    src={product.image || `/products/${product.id}.jpg`} 
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300"
                    onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <ShoppingCart className="w-8 h-8 text-slate-200 opacity-20 group-hover:text-blue-400 group-hover:opacity-40 transition-all" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight mb-2 group-hover:text-blue-700 transition-colors">{product.name}</h3>
                  <div className="flex items-center">
                    <p className="text-blue-600 font-bold text-sm">{formatCurrency(product.price)}</p>
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
      <div className="w-[450px] bg-white border-l border-slate-100 flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.015)] z-20">
        <header className="px-8 py-6 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-2.5">
            {checkoutStep === 'payment' ? (
              <button
                onClick={() => setCheckoutStep('cart')}
                className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-blue-600"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            ) : (
              <div className="bg-slate-50 p-2 rounded-xl">
                <ShoppingCart className="w-5 h-5 text-slate-900" />
              </div>
            )}
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-none mb-1">
                {checkoutStep === 'cart' ? 'Daftar Pesanan' : 'Pembayaran'}
              </h2>
              <p className="text-[10px] font-bold text-slate-400">
                {checkoutStep === 'cart' ? `${cart.reduce((a, b) => a + b.quantity, 0)} Produk` : 'Pilih metode bayar'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {checkoutStep === 'cart' && (
              <>
                <button
                  onClick={() => setShowRecallModal(true)}
                  className="text-[10px] font-bold text-blue-600 bg-blue-50/50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-all border border-blue-100 flex items-center gap-1.5"
                >
                  Ditunda ({parkedOrdersList.length})
                </button>
                <button
                  onClick={() => setCart([])}
                  className="text-[10px] font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition-all"
                >
                  Bersihkan
                </button>
              </>
            )}
          </div>
        </header>

        {checkoutStep === 'cart' ? (
          /* Cart Items List Step */
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 bg-white group hover:border-slate-100 transition-all">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-slate-900 truncate mb-1">{item.name}</h4>
                    <p className="text-[11px] font-bold text-blue-600 font-mono">{formatCurrency(item.price)}</p>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-slate-500 hover:text-blue-600 shadow-sm border border-slate-50 active:scale-95 transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-black text-slate-700">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-slate-500 hover:text-blue-600 shadow-sm border border-slate-50 active:scale-95 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-200 hover:text-red-500 transition-colors p-1"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 py-32">
                  <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-4">
                    <ShoppingCart className="w-6 h-6 opacity-20" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">Keranjang Kosong</p>
                  <p className="text-[11px] font-medium text-slate-300 mt-1">Pilih produk untuk mulai memesan</p>
                </div>
              )}
            </div>

            <div className="px-8 py-6 bg-white border-t border-slate-100 shadow-[0_-20px_40px_rgba(0,0,0,0.01)]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[13px] font-bold text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-slate-700">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[13px] font-bold text-slate-400 pb-2 border-b border-dashed border-slate-100">
                    <span>PPN (4%)</span>
                    <span className="text-slate-700">{formatCurrency(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 mb-1">Total Belanja</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-slate-400">Rp</span>
                      <span className="text-2xl font-black text-slate-900 tracking-tight leading-none tabular-nums">{totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {cart.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleParkOrder}
                        className="h-12 w-12 flex flex-col items-center justify-center bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-white border border-slate-100 hover:border-blue-200 rounded-xl transition-all active:scale-95 group"
                        title="Tunda Pesanan"
                      >
                        <Clock className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span className="text-[8px] font-semibold mt-1 opacity-60">Tunda</span>
                      </button>
                      <button
                        onClick={() => setCheckoutStep('payment')}
                        className="h-12 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-600/20"
                      >
                        <span>Bayar Sekarang</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Payment Step UI */
          <div className="flex-1 flex flex-col bg-slate-50/50 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Focused Summary Card - Compact */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Belanja</span>
                  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-bold">PPN 4% Incl.</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 tabular-nums">{formatCurrency(totalAmount)}</h2>
              </div>

              {/* Payment Method Cards - Compact */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Metode Pembayaran</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'CASH', label: 'Tunai', icon: Banknote },
                    { id: 'CARD', label: 'Kartu', icon: CreditCard },
                    { id: 'QRIS', label: 'QRIS', icon: QrCode },
                  ].map(method => {
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`relative flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all group ${isSelected ? 'border-blue-600 bg-white text-blue-600' : 'border-white bg-white text-slate-300 hover:border-slate-100 shadow-sm'}`}
                      >
                        <method.icon className={`w-5 h-5 mb-1.5 transition-colors ${isSelected ? 'text-blue-600' : 'text-slate-200 group-hover:text-slate-400'}`} />
                        <span className="text-[10px] font-bold">{method.label}</span>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Refined Cash Payment Section - Compact */}
              {paymentMethod === 'CASH' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-2">
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Uang Diterima</h3>
                    <div className="bg-white rounded-2xl border border-slate-100 p-1 shadow-sm focus-within:border-blue-500 transition-colors">
                      <div className="flex items-center gap-3 px-4 py-3">
                        <span className="text-lg font-bold text-slate-200">Rp</span>
                        <input
                          type="number"
                          value={amountReceived}
                          onChange={(e) => setAmountReceived(e.target.value)}
                          placeholder="0..."
                          className="w-full text-xl font-black text-slate-900 placeholder:text-slate-100 outline-none tabular-nums"
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>

                  {/* Compact Quick Pay Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {quickPayAmounts.map(amount => (
                      <button
                        key={amount}
                        onClick={() => setAmountReceived(amount.toString())}
                        className="py-2.5 px-3 bg-white border border-slate-100 text-[10px] font-bold text-slate-500 rounded-xl hover:bg-slate-50 hover:border-blue-200 transition-all text-left flex justify-between items-center group shadow-sm"
                      >
                        <span>{formatCurrency(amount).replace('Rp ', '')}</span>
                        <Plus className="w-2.5 h-2.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                      </button>
                    ))}
                  </div>

                  {/* Compact Summary Detail */}
                  <div className="p-5 bg-slate-900 rounded-2xl text-white flex justify-between items-center shadow-lg shadow-slate-200 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
                    <div className="relative z-10">
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-40 mb-0.5">Kembalian</p>
                      <p className="text-xl font-black tabular-nums">{formatCurrency(changeAmount)}</p>
                    </div>
                    <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${changeAmount > 0 ? 'bg-emerald-500' : 'bg-white/10'}`}>
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              )}

              {/* Non-Cash Payment Sections */}
              {paymentMethod === 'CARD' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center text-center shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">Proses Mesin EDC</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed max-w-[180px]">
                      Silakan geser atau tap kartu pada mesin EDC yang tersedia.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">No. Referensi (Opsional)</h3>
                    <div className="bg-white rounded-xl border border-slate-100 p-1 focus-within:border-blue-500 transition-colors">
                      <input
                        type="text"
                        placeholder="Masukkan no. struk EDC..."
                        className="w-full px-3 py-2 text-[11px] font-medium text-slate-900 outline-none placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'QRIS' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-white rounded-2xl border border-slate-100 p-8 flex flex-col items-center text-center shadow-sm">
                    <div className="relative">
                      <QrCode className="w-24 h-24 text-slate-900 stroke-[1.5px]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-md border border-slate-100 flex items-center justify-center p-1">
                          <div className="w-full h-full bg-blue-600 rounded-sm" />
                        </div>
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-4 mb-1">Pindai QRIS</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Pastikan pelanggan sudah mendapatkan konfirmasi "Berhasil" di aplikasinya.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Final Confirmation Button - Compact */}
            <div className="p-5 bg-white border-t border-slate-50">
              <button
                onClick={() => {
                  handleCheckout();
                  setCheckoutStep('cart');
                  setAmountReceived("");
                }}
                disabled={isProcessing || (paymentMethod === 'CASH' && (Number(amountReceived) < totalAmount))}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Selesaikan Pembayaran</span>
              </button>
              {paymentMethod === 'CASH' && Number(amountReceived) < totalAmount && Number(amountReceived) > 0 && (
                <div className="flex items-center justify-center gap-1.5 mt-3 text-red-500">
                  <div className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
                  <p className="text-[9px] font-bold">Nominal belum mencukupi</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Professional Order Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="p-10 flex flex-col items-center">

              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>

              <div className="text-center space-y-2 mb-8">
                <h3 className="text-2xl font-bold text-slate-900">Transaksi Berhasil</h3>
                <p className="text-slate-500 text-sm">Pesanan telah tercatat dan stok telah diperbarui.</p>
                <p className="text-xs font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-md inline-block">Order #{lastTransactionId}</p>
              </div>

              <div className="w-full space-y-3 mb-8 px-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Metode Pembayaran</span>
                  <span className="font-semibold text-slate-900">{paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
                  <span className="text-slate-500 font-medium">Total Dibayar</span>
                  <span className="font-bold text-slate-900 text-lg">{formatCurrency(lastTotalAmount)}</span>
                </div>
              </div>

              <div className="w-full flex gap-3">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-95"
                >
                  Transaksi Baru
                </button>
                <button
                  className="px-5 py-3.5 flex items-center justify-center bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all active:scale-95"
                  onClick={() => window.print()}
                >
                  <Printer className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shift Guard Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Banknote className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Buka Shift Kasir</h3>
            <p className="text-slate-500 text-[10px] font-bold mb-8 text-center px-4 uppercase tracking-[0.2em] opacity-60">Sistem siap menerima transaksi</p>

            <button
              onClick={handleOpenShift}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black text-sm shadow-xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Mulai Transaksi <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tidy & Functional Delayed Orders Modal */}
      {showRecallModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl flex flex-col max-h-[70vh] border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pesanan Ditunda</h3>
                <p className="text-slate-500 text-xs">Pilih pesanan untuk dilanjutkan ke pembayaran</p>
              </div>
              <button onClick={() => setShowRecallModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {parkedOrdersList.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-slate-200" />
                  </div>
                  <p className="text-sm font-medium text-slate-400">Belum ada pesanan yang ditunda</p>
                </div>
              ) : (
                parkedOrdersList.map(order => (
                  <div
                    key={order.id}
                    onClick={() => handleRecallOrder(order.id)}
                    className="w-full p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all text-left flex justify-between items-center group cursor-pointer"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-800">{order.customerName || "Tanpa Nama"}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-medium">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="font-mono">#{order.id}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold text-blue-600">{formatCurrency(Number(order.totalAmount))}</p>
                        <p className="text-[10px] font-bold text-slate-300 group-hover:text-blue-500 transition-colors uppercase">Pilih</p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteParkedOrder(e, order.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Hapus Pesanan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setShowRecallModal(false)}
                className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
