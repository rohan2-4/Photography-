import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'PHOTOGRAPHER')) {
      return NextResponse.json({ error: 'Admin authorization required' }, { status: 403 });
    }

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
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { bookingStatus: 'PENDING' } }),
      prisma.booking.count({ where: { bookingStatus: 'CONFIRMED' } }),
      prisma.booking.count({ where: { bookingStatus: 'COMPLETED' } }),
      prisma.booking.count({ where: { eventDate: { gte: today }, bookingStatus: { in: ['CONFIRMED', 'PENDING'] } } }),
      prisma.payment.findMany({ where: { status: 'SUCCESS' } }),
      prisma.booking.findMany({
        include: { package: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.package.findMany({
        include: {
          _count: {
            select: { bookings: true }
          }
        }
      })
    ]);

    // Financial Metrics
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalBookedValue = bookings.reduce((sum, b) => sum + b.amount, 0);
    const pendingPayments = totalBookedValue - totalRevenue;

    // Monthly Analytics (Last 6 Months)
    const monthlyStatsMap = new Map<string, { month: string; bookings: number; revenue: number }>();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Pre-populate last 6 months
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

    // Status Distribution
    const statusDistribution = [
      { name: 'Confirmed', value: confirmedBookings, color: '#3B82F6' },
      { name: 'Pending', value: pendingBookings, color: '#F59E0B' },
      { name: 'Completed', value: completedBookings, color: '#10B981' },
      { name: 'Rejected/Cancelled', value: totalBookings - (confirmedBookings + pendingBookings + completedBookings), color: '#EF4444' },
    ].filter((item) => item.value >= 0);

    // Popular Packages Data
    const popularPackages = packages.map((pkg) => ({
      name: pkg.name,
      bookings: pkg._count.bookings,
      revenue: pkg._count.bookings * (pkg.discountedPrice || pkg.price),
    })).sort((a, b) => b.bookings - a.bookings).slice(0, 5);

    return NextResponse.json({
      kpis: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        upcomingEvents,
        totalRevenue,
        pendingPayments: Math.max(0, pendingPayments),
      },
      charts: {
        monthlyTrends,
        statusDistribution,
        popularPackages,
      }
    });
  } catch (error) {
    console.error('Fetch admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to generate admin statistics' },
      { status: 500 }
    );
  }
}
