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
      <div className="py-10 text-center text-slate-400 text-xs font-medium italic">
         No transactions recorded today
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
         <button className="text-[11px] font-bold text-[#0066FF] hover:underline">View All</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment</th>
              <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
              <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sales.map((sale, i) => (
              <tr key={i} className="group hover:bg-slate-50 transition-colors">
                <td className="py-3 pr-4">
                  <p className="text-[13px] font-bold text-slate-900 leading-none mb-1">{sale.payment}</p>
                  <p className="text-[10px] font-medium text-slate-400">{sale.time}</p>
                </td>
                <td className="py-3 text-center">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                     SUCCESS
                  </span>
                </td>
                <td className="py-3 text-right">
                  <p className="text-[13px] font-bold text-slate-900 tracking-tight">{sale.amount}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
