"use client";

import { useState, useEffect } from "react";
import { X, Printer } from "lucide-react";
import { getTransactionItems } from "@/app/actions/transaction";

interface Item {
    id: number;
    quantity: number;
    unitPrice: string;
    subtotal: string;
    productName: string | null;
    productSku: string | null;
}

export default function TransactionDetail({
    orderId,
    onClose
}: {
    orderId: number | null;
    onClose: () => void;
}) {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (orderId) {
            const fetchItems = async () => {
                setIsLoading(true);
                const res = await getTransactionItems({ transactionId: orderId });
                if (res.success) {
                    setItems(res.data);
                }
                setIsLoading(false);
            };
            fetchItems();
        } else {
            setItems([]);
        }
    }, [orderId]);

    const formatCurrency = (val: string) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(parseFloat(val));
    };

    const totalCalculated = items.reduce((acc: number, item: any) => acc + parseFloat(item.subtotal), 0);

    if (!orderId) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden font-jakarta">
            <div
                className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-sm bg-white h-full shadow-xl flex flex-col animate-in slide-in-from-right duration-500 ease-out border-l border-slate-100">
                <header className="px-8 py-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Audit Archive</h2>
                        <p className="text-[11px] font-bold text-slate-400 mt-1">Order ID #{orderId}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-300 hover:text-slate-900"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-8 space-y-8">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Transaction line items</h3>
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start group">
                                        <div className="flex-1">
                                            <p className="text-[12px] font-bold text-slate-800 leading-tight mb-1">{item.productName || 'Unknown Product'}</p>
                                            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                                                <span>Qty: {item.quantity}</span>
                                                <span>•</span>
                                                <span>{formatCurrency(item.unitPrice)}</span>
                                            </div>
                                        </div>
                                        <p className="text-[12px] font-black text-slate-900">{formatCurrency(item.subtotal).replace('Rp', '').trim()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <footer className="p-8 space-y-8">
                    <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total balance</p>
                            <h3 className="text-2xl font-black text-slate-900 leading-none tabular-nums">{formatCurrency(totalCalculated.toString())}</h3>
                        </div>
                        <button
                            onClick={() => window.print()}
                            className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-90"
                        >
                            <Printer className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-4 text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors tracking-widest"
                    >
                        Close archive
                    </button>
                </footer>
            </div>
        </div>
    );
}
