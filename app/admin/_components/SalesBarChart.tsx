"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart2 } from 'lucide-react';

interface SalesData {
  name: string;
  sales: number;
}

export default function SalesBarChart({ data }: { data: SalesData[] }) {
  const isDataEmpty = !data || data.length === 0 || data.every(d => d.sales === 0);

  const dayMap: Record<string, string> = {
    'MON': 'SEN', 'TUE': 'SEL', 'WED': 'RAB', 'THU': 'KAM', 
    'FRI': 'JUM', 'SAT': 'SAB', 'SUN': 'MIN'
  };

  // Fixed Monday-Sunday skeleton data as requested
  const skeletonData = [
    { name: 'SEN', sales: 2200000 },
    { name: 'SEL', sales: 1100000 },
    { name: 'RAB', sales: 2400000 },
    { name: 'KAM', sales: 1800000 },
    { name: 'JUM', sales: 900000 },
    { name: 'SAB', sales: 2100000 },
    { name: 'MIN', sales: 2800000 },
  ];

  const chartData = isDataEmpty 
    ? skeletonData 
    : data.map(d => ({ ...d, name: dayMap[d.name.toUpperCase()] || d.name }));

  return (
    <div className="w-full flex flex-col pt-4">
      <div className="relative w-full h-[320px]">
        {/* Skeleton Overlay - Modern SaaS style */}
        {isDataEmpty && (
          <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
            <div className="bg-white/80 border border-slate-100 px-6 py-4 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-700">
               <div className="w-10 h-10 bg-blue-50 text-[#0066FF] rounded-xl flex items-center justify-center">
                  <BarChart2 className="w-5 h-5" />
               </div>
               <div className="text-center">
                  <p className="text-[13px] font-bold text-slate-900 leading-none">Belum ada data penjualan</p>
                  <p className="text-[10px] font-medium text-slate-400 mt-2">Grafik akan muncul otomatis setelah transaksi pertama.</p>
               </div>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} 
              dy={12}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} 
              domain={[0, 5000000]}
              ticks={[0, 1000000, 2000000, 3000000, 4000000, 5000000]}
              tickFormatter={(value) => {
                if (value === 0) return '0';
                if (value >= 1000000) return `${value / 1000000}jt`;
                if (value >= 1000) return `${value / 1000}rb`;
                return value;
              }}
            />
            {!isDataEmpty && (
              <Tooltip 
                cursor={{ fill: '#F8FAFC' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid #E2E8F0', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontSize: '11px',
                  fontWeight: '700'
                }}
                formatter={(value: any) => [`Rp ${Number(value || 0).toLocaleString('id-ID')}`, 'Penjualan']}
              />
            )}
            <Bar 
              dataKey="sales" 
              fill={isDataEmpty ? "#F1F5F9" : "#0066FF"}
              radius={[6, 6, 0, 0]}
              barSize={32}
              className={isDataEmpty ? "opacity-50" : ""}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
