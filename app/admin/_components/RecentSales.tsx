"use client";

interface Sale {
  id: string;
  name: string;
  time: string;
  amount: string;
  payment: string;
  date: string;
}

export default function RecentSales({ sales }: { sales: Sale[] }) {
  if (!sales || sales.length === 0) {
    return (
      <div className="py-12 text-slate-300 font-bold text-[12px] uppercase tracking-widest italic">
         No transactions recorded
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-black text-slate-900 tracking-tight">Recent activity</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <tbody className="divide-y divide-slate-50">
            {sales.map((sale, i) => (
              <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                <td className="py-5 pr-4">
                  <p className="text-[12px] font-black text-slate-900 mb-0.5">{sale.payment} Payment</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{sale.time} • {sale.id}</p>
                </td>
                <td className="py-5 text-right">
                  <p className="text-[12px] font-black text-slate-900">{sale.amount}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="text-[10px] font-bold text-slate-300 uppercase tracking-widest hover:text-slate-900 transition-colors">
         View full history
      </button>
    </div>
  );
}
