"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SalesData {
  name: string;
  sales: number;
}

export default function SalesBarChart({ data }: { data: SalesData[] }) {
  const maxSales = data.length > 0 ? Math.max(...data.map(d => d.sales)) : 0;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 w-full min-h-[350px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-200 font-bold text-[10px] uppercase tracking-widest italic">
            No sales data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f8fafc" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 700 }} 
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 700 }} 
              />
              <Tooltip 
                cursor={{ fill: '#fcfcfc' }}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: '1px solid #f1f5f9', 
                  boxShadow: 'none',
                  fontSize: '11px',
                  fontWeight: '700'
                }}
                formatter={(value: any) => [`Rp ${Number(value || 0).toLocaleString('id-ID')}`, 'Amount']}
              />
              <Bar 
                dataKey="sales" 
                radius={[4, 4, 4, 4]}
                barSize={32}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.sales === maxSales && maxSales > 0 ? '#0f172a' : '#f1f5f9'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
