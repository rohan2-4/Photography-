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
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';

interface ChartsProps {
  monthlyTrends: Array<{ month: string; bookings: number; revenue: number }>;
  statusDistribution: Array<{ name: string; value: number; color: string }>;
  popularPackages: Array<{ name: string; bookings: number; revenue: number }>;
}

export default function AdminAnalyticsCharts({
  monthlyTrends,
  statusDistribution,
  popularPackages,
}: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* 1. Monthly Revenue & Bookings Trend */}
      <div className="bg-[#12141D] border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif font-bold text-white">Monthly Revenue & Bookings</h3>
          <span className="text-[10px] text-amber-400 font-mono">Past 6 Months</span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#22273A" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0D0F17', borderColor: '#262A3C', borderRadius: '12px' }}
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? `₹${value.toLocaleString('en-IN')}` : value,
                  name === 'revenue' ? 'Revenue (₹)' : 'Bookings',
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} name="revenue" />
              <Bar dataKey="bookings" fill="#3B82F6" radius={[4, 4, 0, 0]} name="bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Booking Status Distribution */}
      <div className="bg-[#12141D] border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif font-bold text-white">Booking Status Breakdown</h3>
          <span className="text-[10px] text-amber-400 font-mono">Live Ratio</span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0D0F17', borderColor: '#262A3C', borderRadius: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Popular Packages Performance */}
      <div className="lg:col-span-2 bg-[#12141D] border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif font-bold text-white">Top Performing Photography Packages</h3>
          <span className="text-[10px] text-amber-400 font-mono">Bookings Count</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={popularPackages} margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#22273A" />
              <XAxis type="number" stroke="#94A3B8" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={11} width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0D0F17', borderColor: '#262A3C', borderRadius: '12px' }}
              />
              <Bar dataKey="bookings" fill="#10B981" radius={[0, 4, 4, 0]} name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
