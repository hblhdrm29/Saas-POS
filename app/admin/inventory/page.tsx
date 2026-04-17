import { db } from "@/db";
import { stockLogs, products, users } from "@/db/schema";
import { auth } from "@/auth";
import { eq, desc, lt, gte, and, sql } from "drizzle-orm";
import { Warehouse, ArrowUpRight, ArrowDownRight, RefreshCcw, Search, AlertTriangle, Package, History, User } from "lucide-react";

export default async function InventoryPage() {
    const session = await auth();
    const user = session?.user as any;

    // Fetch stock logs
    const logs = await db
        .select({
            id: stockLogs.id,
            productName: products.name,
            sku: products.sku,
            type: stockLogs.type,
            quantity: stockLogs.quantity,
            referenceId: stockLogs.referenceId,
            notes: stockLogs.notes,
            userName: users.name,
            createdAt: stockLogs.createdAt
        })
        .from(stockLogs)
        .leftJoin(products, eq(stockLogs.productId, products.id))
        .leftJoin(users, eq(stockLogs.userId, users.id))
        .where(eq(stockLogs.tenantId, user.tenantId))
        .orderBy(desc(stockLogs.createdAt))
        .limit(50);

    // Fetch low stock items
    const lowStockItems = await db
        .select()
        .from(products)
        .where(
            and(
                eq(products.tenantId, user.tenantId),
                eq(products.isActive, true),
                sql`${products.stock} <= ${products.lowStockThreshold}`
            )
        )
        .orderBy(products.stock);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
                    <p className="text-slate-500 text-sm">Track stock movements and audit history.</p>
                </div>
                <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-slate-200">
                    <Package className="w-4 h-4" /> Receive Stock
                </button>
            </div>

            {/* Alert Panel for Low Stock */}
            {lowStockItems.length > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2 text-amber-800 font-black text-xs tracking-wider pl-2">
                        <AlertTriangle className="w-4 h-4" /> Stok Menipis ({lowStockItems.length} Produk)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lowStockItems.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl border border-amber-100 flex items-center justify-between shadow-sm">
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{item.name}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{item.sku}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-red-600">{item.stock}</p>
                                    <p className="text-[9px] font-bold text-slate-400">Limit: {item.lowStockThreshold}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                        <History className="w-5 h-5 text-blue-600" />
                        <span>Audit Trail Log</span>
                    </div>
                    <div className="relative w-64">
                         <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Filter by SKU or Reference..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] outline-none" />
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold tracking-wider">
                            <th className="px-6 py-4 font-medium">Status & Product</th>
                            <th className="px-6 py-4 font-medium">Quantity</th>
                            <th className="px-6 py-4 font-medium">Reference</th>
                            <th className="px-6 py-4 font-medium">Admin</th>
                            <th className="px-6 py-4 font-medium">Date & Time</th>
                            <th className="px-8 py-4 text-right font-medium">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {logs.length === 0 ? (
                            <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-400 text-sm">No stock logs found.</td></tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                log.type === 'RECEIVED' ? 'bg-emerald-50 text-emerald-600' : 
                                                log.type === 'REDUCED' ? 'bg-red-50 text-red-600' : 
                                                'bg-blue-50 text-blue-600'
                                            }`}>
                                                {log.type === 'RECEIVED' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{log.productName}</p>
                                                <p className="text-[10px] text-slate-400 font-mono tracking-tighter">{log.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`text-[13px] font-bold ${
                                            log.type === 'RECEIVED' ? 'text-emerald-500' : 
                                            log.type === 'REDUCED' ? 'text-red-500' : 
                                            'text-slate-700'
                                        }`}>
                                            {log.type === 'RECEIVED' ? '+' : '-'}{Math.abs(Number(log.quantity))}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{log.referenceId}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                                            <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[9px] font-bold text-slate-400">
                                                {log.userName?.charAt(0)}
                                            </div>
                                            {log.userName}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-bold text-slate-700">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{new Date(log.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-8 py-5 text-right text-[10px] font-medium text-slate-400 italic max-w-xs truncate">
                                        {log.notes}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
