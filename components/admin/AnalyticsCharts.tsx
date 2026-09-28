'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AnalyticsChartsProps {
  revenueData: { month: string; revenue: number }[];
  statusData: { name: string; value: number }[];
}

const COLORS = ['#D4AF37', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

export default function AnalyticsCharts({ revenueData, statusData }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Revenue Bar Chart */}
      <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-[#262A3C] space-y-4">
        <h3 className="text-xl font-serif font-bold text-white">Monthly Studio Revenue (INR)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#12141D', borderColor: '#D4AF37', borderRadius: '12px' }}
                formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="url(#goldGradientBar)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="goldGradientBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F7E7B4" />
                  <stop offset="100%" stopColor="#B89228" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution Pie Chart */}
      <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-[#262A3C] space-y-4">
        <h3 className="text-xl font-serif font-bold text-white">Booking Distribution</h3>
        <div className="h-72 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#12141D', borderColor: '#262A3C', borderRadius: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
