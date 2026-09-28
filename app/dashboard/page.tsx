import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  CalendarCheck,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MapPin,
  Package,
  PlusCircle,
  Eye,
  CreditCard
} from 'lucide-react';

export const revalidate = 0;

export default async function CustomerDashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/login');
  }

  // Query customer bookings
  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { customerId: currentUser.id },
        { customerEmail: currentUser.email },
      ],
    },
    include: {
      package: true,
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.bookingStatus === 'PENDING').length;
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length;
  const completedBookings = bookings.filter((b) => b.bookingStatus === 'COMPLETED').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-slate-100">
      <Navbar currentUser={currentUser} />
      <main className="flex-1 pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel rounded-3xl p-8 border border-[#262A3C]">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-gold-400 uppercase">
              CUSTOMER DASHBOARD
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your photography reservations, view status timelines, and track payment receipts.
            </p>
          </div>

          <Link
            href="/book"
            className="px-6 py-3.5 rounded-full bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow hover:scale-105 transition-all w-fit"
          >
            <PlusCircle className="w-4 h-4" />
            Book New Experience
          </Link>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-[#262A3C] space-y-2">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Bookings</span>
            <div className="text-3xl font-serif font-bold text-white">{totalBookings}</div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-[#262A3C] space-y-2">
            <span className="text-xs text-amber-400 uppercase font-semibold">Pending Confirmation</span>
            <div className="text-3xl font-serif font-bold text-amber-300">{pendingBookings}</div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-[#262A3C] space-y-2">
            <span className="text-xs text-gold-400 uppercase font-semibold">Confirmed Events</span>
            <div className="text-3xl font-serif font-bold text-gold-300">{confirmedBookings}</div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-[#262A3C] space-y-2">
            <span className="text-xs text-emerald-400 uppercase font-semibold">Completed Celebrations</span>
            <div className="text-3xl font-serif font-bold text-emerald-300">{completedBookings}</div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-white">My Photography Bookings</h2>

          {bookings.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center border border-[#262A3C] space-y-4">
              <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-xl font-serif font-bold text-white">No Bookings Found</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                You haven't reserved any photography package with Cinemayur yet.
              </p>
              <Link
                href="/packages"
                className="inline-block px-6 py-2.5 rounded-full bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider shadow-gold-glow"
              >
                Browse Packages
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="glass-panel rounded-2xl p-6 border border-[#262A3C] hover:border-gold-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold font-mono border border-gold-500/30">
                        {booking.bookingNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 uppercase">
                        {booking.eventType}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-white">
                      {booking.package?.name || booking.eventType}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 text-gold-300 font-semibold">
                        <Calendar className="w-4 h-4 text-gold-400" />
                        {new Date(booking.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} ({booking.startTime} - {booking.endTime})
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        {booking.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start md:items-end lg:items-center gap-4 border-t md:border-t-0 border-[#262A3C] pt-4 md:pt-0">
                    <div className="text-left md:text-right space-y-1">
                      <div className="text-lg font-bold font-serif text-white">
                        ₹{booking.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          booking.bookingStatus === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          booking.bookingStatus === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          booking.bookingStatus === 'COMPLETED' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {booking.bookingStatus}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-200 text-slate-300 border border-surface-300">
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/bookings/${booking.id}`}
                      className="px-5 py-2.5 rounded-xl bg-surface-200 hover:bg-gold-500 hover:text-black text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
