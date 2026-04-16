import { db } from "@/db";
import { tenants } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { Settings, Printer, Store, Save } from "lucide-react";

export default async function SettingsPage() {
    const session = await auth();
    const user = session?.user as any;

    const [tenant] = await db
        .select()
        .from(tenants)
        .where(eq(tenants.id, user.tenantId))
        .limit(1);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">General Settings</h1>
                    <p className="text-slate-500 text-sm">Configure your store branding and system preferences.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Store Branding */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 space-y-8">
                    <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <Store className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800">Store Branding</h3>
                    </div>

                    <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Store Name</label>
                            <input 
                                type="text" 
                                defaultValue={tenant?.name}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-blue-400 transition-all"
                                placeholder="Emerald POS Central"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Printer className="w-3 h-3" /> Receipt Header</label>
                            <textarea 
                                rows={3}
                                defaultValue={tenant?.receiptHeader || ""}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-blue-400 transition-all font-mono text-[11px]"
                                placeholder="Jl. Sudirman No. 123&#10;Telp: 021-998877"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Printer className="w-3 h-3" /> Receipt Footer</label>
                            <textarea 
                                rows={3}
                                defaultValue={tenant?.receiptFooter || ""}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-blue-400 transition-all font-mono text-[11px]"
                                placeholder="Terima kasih atas kunjungan Anda&#10;Barang yang sudah dibeli dapat ditukar 1x24 jam"
                            />
                        </div>
                    </div>

                    <button className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-[2rem] font-black text-sm shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> Save Preferences
                    </button>
                </div>

                {/* Receipt Preview */}
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center">Live Preview (Struk)</p>
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center">
                        <div className="w-[300px] bg-slate-50/50 p-8 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col items-center space-y-4 text-center">
                            <h4 className="font-black text-lg text-slate-800 uppercase tracking-tighter">{tenant?.name}</h4>
                            <p className="text-[10px] text-slate-500 whitespace-pre-wrap">{tenant?.receiptHeader || "Alamat Toko\nPhone Number"}</p>
                            
                            <div className="w-full border-t border-dashed border-slate-200 py-4 flex flex-col gap-2">
                                <div className="flex justify-between text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                                    <span>Product A x2</span>
                                    <span>Rp 20.000</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                                    <span>Product B x1</span>
                                    <span>Rp 15.000</span>
                                </div>
                            </div>

                            <div className="w-full border-t-2 border-slate-200 pt-4 flex flex-col gap-2">
                                <div className="flex justify-between text-xs font-black text-slate-900">
                                    <span>TOTAL</span>
                                    <span>Rp 35.000</span>
                                </div>
                            </div>

                            <p className="text-[10px] text-slate-500 whitespace-pre-wrap pt-4 italic">{tenant?.receiptFooter || "Thank you for your purchase!"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
