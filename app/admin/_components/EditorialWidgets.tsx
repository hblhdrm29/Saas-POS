"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function EditorialWidgets() {
  const data = [
    { name: 'Completed', value: 72 },
    { name: 'Remaining', value: 28 },
  ];

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Campaign Performance */}
      <div className="bg-[#003580] p-10 rounded-[2.5rem] text-white overflow-hidden relative group flex-1 flex flex-col justify-between">
         <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Campaign Performance</span>
            <h3 className="text-3xl font-black leading-tight tracking-tight">Holiday Season Launch</h3>
         </div>
         
         <div className="flex items-center gap-6 mt-10 relative z-10">
            <div className="w-24 h-24 relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={45}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                     >
                        <Cell fill="#FFFFFF" />
                        <Cell fill="#ffffff15" />
                     </Pie>
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[14px] font-black">72%</span>
               </div>
            </div>
            <p className="text-[12px] font-medium leading-relaxed opacity-70">Inventory target reached for the quarter.</p>
         </div>
      </div>

      {/* System Status */}
      <div className="bg-[#E9EDF5] p-8 rounded-[2rem] space-y-5">
         <h4 className="text-[13px] font-black text-slate-800 tracking-tight">System Status</h4>
         <div className="space-y-3">
            <div className="flex items-center justify-between">
               <span className="text-[12px] font-bold text-slate-500">Cloud Sync</span>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  <span className="text-[11px] font-black text-blue-900 italic">Operational</span>
               </div>
            </div>
            <div className="flex items-center justify-between">
               <span className="text-[12px] font-bold text-slate-500">Payment Gateways</span>
               <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-slate-900 opacity-60">Active</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
