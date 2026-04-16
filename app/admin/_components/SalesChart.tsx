"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { name: 'May', sales: 18000 },
  { name: 'Jun', sales: 12000 },
  { name: 'Jul', sales: 15000 },
  { name: 'Aug', sales: 22000 },
  { name: 'Sep', sales: 16500 },
  { name: 'Oct', sales: 21000 },
  { name: 'Nov', sales: 18500 },
];

export default function SalesChart() {
  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="font-black text-slate-900 text-xl tracking-tight">Sales Overview</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Monthly performance insights</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-[11px] font-black text-slate-500 uppercase cursor-pointer hover:bg-slate-100 transition-all">
           Filter ▼
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0066FF" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
                fontWeight: '800'
              }}
              cursor={{ stroke: '#0066FF', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#0066FF" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorSales)" 
              dot={{ r: 6, fill: '#0066FF', strokeWidth: 3, stroke: '#fff' }}
              activeDot={{ r: 8, fill: '#0066FF', strokeWidth: 4, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
