import Link from 'next/link';
import { 
  BookOpen, 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  IndianRupee, 
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { prisma } from '@/lib/db/prisma';
import AdminAnalyticsCharts from '@/components/admin/AdminAnalyticsCharts';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    upcomingEvents,
    payments,
    bookings,
    packages,
    recentBookings,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { bookingStatus: 'PENDING' } }),
    prisma.booking.count({ where: { bookingStatus: 'CONFIRMED' } }),
    prisma.booking.count({ where: { bookingStatus: 'COMPLETED' } }),
    prisma.booking.count({ where: { eventDate: { gte: today }, bookingStatus: { in: ['CONFIRMED', 'PENDING'] } } }),
    prisma.payment.findMany({ where: { status: 'SUCCESS' } }),
    prisma.booking.findMany({ include: { package: true } }),
    prisma.package.findMany({ include: { _count: { select: { bookings: true } } } }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { package: true },
    })
  ]);

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalBookedValue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const pendingPayments = Math.max(0, totalBookedValue - totalRevenue);

  // Prepare chart data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyStatsMap = new Map<string, { month: string; bookings: number; revenue: number }>();
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
    monthlyStatsMap.set(key, { month: months[d.getMonth()], bookings: 0, revenue: 0 });
  }

  bookings.forEach((b) => {
    const d = new Date(b.createdAt);
    const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
    if (monthlyStatsMap.has(key)) {
      const item = monthlyStatsMap.get(key)!;
      item.bookings += 1;
      item.revenue += b.paidAmount;
    }
  });

  const monthlyTrends = Array.from(monthlyStatsMap.values());

  const statusDistribution = [
    { name: 'Confirmed', value: confirmedBookings, color: '#3B82F6' },
    { name: 'Pending', value: pendingBookings, color: '#F59E0B' },
    { name: 'Completed', value: completedBookings, color: '#10B981' },
    { name: 'Rejected/Cancelled', value: Math.max(0, totalBookings - (confirmedBookings + pendingBookings + completedBookings)), color: '#EF4444' },
  ];

  const popularPackages = packages.map((pkg) => ({
    name: pkg.name,
    bookings: pkg._count.bookings,
    revenue: pkg._count.bookings * (pkg.discountedPrice || pkg.price),
  })).sort((a, b) => b.bookings - a.bookings).slice(0, 5);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Studio Management Center
          </span>
          <h1 className="text-3xl font-serif font-bold text-white">
            Cinemayur Executive Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/calendar"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <CalendarDays className="w-4 h-4 text-amber-400" />
            <span>Studio Calendar</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-amber-300 to-amber-500 hover:brightness-110 shadow-md transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Manage Bookings</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        <div className="bg-[#12141D] border border-white/10 p-5 rounded-2xl space-y-1">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase">Total Bookings</span>
          <div className="text-2xl font-serif font-bold text-white">{totalBookings}</div>
          <span className="text-[10px] text-slate-500">All-time reservations</span>
        </div>

        <div className="bg-[#12141D] border border-amber-500/30 p-5 rounded-2xl space-y-1">
          <span className="text-amber-400 text-[11px] font-semibold block uppercase">Pending Review</span>
          <div className="text-2xl font-serif font-bold text-amber-300">{pendingBookings}</div>
          <span className="text-[10px] text-amber-400/80">Requires approval</span>
        </div>

        <div className="bg-[#12141D] border border-blue-500/30 p-5 rounded-2xl space-y-1">
          <span className="text-blue-400 text-[11px] font-semibold block uppercase">Confirmed Events</span>
          <div className="text-2xl font-serif font-bold text-blue-300">{confirmedBookings}</div>
          <span className="text-[10px] text-blue-400/80">Calendar reserved</span>
        </div>

        <div className="bg-[#12141D] border border-emerald-500/30 p-5 rounded-2xl space-y-1">
          <span className="text-emerald-400 text-[11px] font-semibold block uppercase">Upcoming Events</span>
          <div className="text-2xl font-serif font-bold text-emerald-300">{upcomingEvents}</div>
          <span className="text-[10px] text-emerald-400/80">Next 30 days</span>
        </div>

        <div className="bg-[#12141D] border border-white/10 p-5 rounded-2xl space-y-1">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase">Total Revenue</span>
          <div className="text-2xl font-serif font-bold text-white">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-emerald-400">Collected deposits</span>
        </div>

        <div className="bg-[#12141D] border border-white/10 p-5 rounded-2xl space-y-1">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase">Pending Payments</span>
          <div className="text-2xl font-serif font-bold text-slate-300">₹{pendingPayments.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-amber-400">Balance receivables</span>
        </div>

      </div>

      {/* Analytics Charts */}
      <AdminAnalyticsCharts
        monthlyTrends={monthlyTrends}
        statusDistribution={statusDistribution}
        popularPackages={popularPackages}
      />

      {/* Recent Bookings Activity */}
      <div className="bg-[#12141D] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-base font-serif font-bold text-white">Recent Booking Requests</h3>
          <Link href="/admin/bookings" className="text-xs text-amber-400 hover:underline">
            View All Bookings →
          </Link>
        </div>

        <div className="divide-y divide-white/5">
          {recentBookings.map((b) => (
            <div key={b.id} className="py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-mono text-amber-400 font-bold">{b.bookingNumber}</span>
                <span className="text-white font-semibold ml-3">{b.customerName}</span>
                <span className="text-slate-400 block text-[11px]">
                  {b.eventType} • {new Date(b.eventDate).toLocaleDateString('en-IN')} • {b.location}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold">₹{b.amount.toLocaleString('en-IN')}</span>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    b.bookingStatus === 'CONFIRMED'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : b.bookingStatus === 'PENDING'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {b.bookingStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
