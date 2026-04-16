import { ShoppingBag, TrendingUp } from "lucide-react";

const popularMenu = [
  { name: 'Kopi Susu Aren', price: 'Rp 22.000', sold: '2.340', income: 'Rp 51.480.000', trend: '+12%' },
  { name: 'Blueiy Latte', price: 'Rp 28.000', sold: '1.850', income: 'Rp 51.800.000', trend: '+8%' },
  { name: 'Croissant Butter', price: 'Rp 25.000', sold: '1.120', income: 'Rp 28.000.000', trend: '+15%' },
  { name: 'Iced Peach Tea', price: 'Rp 18.000', sold: '980', income: 'Rp 17.640.000', trend: '+5%' },
];

export default function TopProducts() {
  return (
    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-10 border-b border-slate-50 flex items-center justify-between">
        <div>
          <h3 className="font-black text-slate-900 text-xl tracking-tight">Popular Menu</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Best selling items this month</p>
        </div>
        <div className="relative">
           <input 
              type="text" 
              placeholder="Search menu..." 
              className="pl-5 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-medium outline-none focus:border-[#0066FF] transition-all w-48"
           />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#EBF5FF]">
              <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-blue-100">No</th>
              <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-blue-100">Menu</th>
              <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-blue-100">Price</th>
              <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-blue-100 text-center">Sold Quantity</th>
              <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-blue-100 text-right">Total Income</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {popularMenu.map((item, i) => (
              <tr key={i} className="group hover:bg-slate-50 transition-all">
                <td className="px-10 py-6 text-[13px] font-bold text-slate-400">{i + 1}</td>
                <td className="px-6 py-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                         <ShoppingBag className="w-5 h-5 text-slate-200" />
                      </div>
                      <span className="text-[14px] font-bold text-slate-900">{item.name}</span>
                   </div>
                </td>
                <td className="px-6 py-6 text-[13px] font-bold text-slate-500">{item.price}</td>
                <td className="px-6 py-6 text-center">
                   <div className="flex flex-col items-center">
                      <span className="text-[14px] font-black text-slate-900">{item.sold}</span>
                      <span className="text-[10px] font-bold text-emerald-500">{item.trend}</span>
                   </div>
                </td>
                <td className="px-6 py-6 text-right font-black text-slate-900 text-[14px]">{item.income}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
