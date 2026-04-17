'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface RevenuePoint {
  month: string;
  revenue: number;
}

export default function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#4b5563' }} />
          <YAxis tick={{ fontSize: 12, fill: '#4b5563' }} tickFormatter={(v) => `$${v}`} />
          <Tooltip
            formatter={(value) => [
              `$${Number(value ?? 0).toFixed(2)}`,
              'Revenue',
            ]}
          />
          <Bar dataKey="revenue" fill="#111827" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
