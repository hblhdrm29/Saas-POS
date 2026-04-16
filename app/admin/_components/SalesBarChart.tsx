"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesData {
  name: string;
  sales: number;
}

export default function SalesBarChart({ data }: { data: SalesData[] }) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 w-full min-h-[300px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-300 text-xs font-semibold italic">
            No sales data available for this week
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }} 
                dy={12}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }} 
              />
              <Tooltip 
                cursor={{ fill: '#F1F5F9' }}
                contentStyle={{ 
                  borderRadius: '6px', 
                  border: '1px solid #E2E8F0', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '11px',
                  fontWeight: '600'
                }}
                formatter={(value: any) => [`Rp ${Number(value || 0).toLocaleString('id-ID')}`, 'Value']}
              />
              <Bar 
                dataKey="sales" 
                fill="#0066FF"
                radius={[4, 4, 0, 0]}
                barSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
