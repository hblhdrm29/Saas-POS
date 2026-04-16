"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Cash', value: 350 },
  { name: 'QRIS', value: 1550 },
  { name: 'Card', value: 800 },
];

const COLORS = ['#818cf8', '#0066FF', '#c7d2fe'];

export default function PaymentDonut() {
  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-black text-slate-900 text-xl tracking-tight">Payment</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Transaction split</p>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: '800' }}
            />
            <Legend 
               verticalAlign="bottom" 
               height={36} 
               iconType="circle"
               formatter={(value) => <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest translate-y-[2px] inline-block ml-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
