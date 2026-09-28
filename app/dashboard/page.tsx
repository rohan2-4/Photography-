import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Camera, Calendar, Clock, MapPin, Eye, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/ui/BookingStatusBadge';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export const revalidate = 0;

export default async function CustomerDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { customerId: user.id },
        { customerEmail: user.email.toLowerCase() },
      ],
    },
    include: {
      package: true,
      payments: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.bookingStatus === 'PENDING').length;
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length;
  const completedBookings = bookings.filter((b) => b.bookingStatus === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-black">
      <Navbar initialUser={user} />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-10">
        
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#12141D] border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Customer Portal
            </span>
            <h1 className="text-3xl font-serif font-bold text-white">
              Welcome, {user.name}
            </h1>
            <p className="text-xs text-slate-400">
              Manage your event photo reservations, track studio confirmation status, and view receipts.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <Link
              href="/book"
              className="px-5 py-3 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Shoot</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#12141D] border border-white/10 p-6 rounded-2xl space-y-2">
            <span className="text-slate-400 text-xs font-semibold">Total Bookings</span>
            <div className="text-2xl font-serif font-bold text-white">{totalBookings}</div>
          </div>

          <div className="bg-[#12141D] border border-white/10 p-6 rounded-2xl space-y-2">
            <span className="text-slate-400 text-xs font-semibold">Pending Review</span>
            <div className="text-2xl font-serif font-bold text-amber-400">{pendingBookings}</div>
          </div>

          <div className="bg-[#12141D] border border-white/10 p-6 rounded-2xl space-y-2">
            <span className="text-slate-400 text-xs font-semibold">Confirmed Events</span>
            <div className="text-2xl font-serif font-bold text-emerald-400">{confirmedBookings}</div>
          </div>

          <div className="bg-[#12141D] border border-white/10 p-6 rounded-2xl space-y-2">
            <span className="text-slate-400 text-xs font-semibold">Completed Shoots</span>
            <div className="text-2xl font-serif font-bold text-blue-400">{completedBookings}</div>
          </div>
        </div>

        {/* My Bookings Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-serif font-bold text-white">My Photography Bookings</h2>
            <span className="text-xs text-slate-400">{bookings.length} Events Total</span>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-[#12141D] rounded-3xl border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-full bg-white/5 text-amber-400 flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif font-bold text-white">No Bookings Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You have not placed any photography booking requests yet. Check out our packages and availability to reserve your date.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-amber-300 to-amber-500 shadow-md"
              >
                <span>Book Your First Event</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const dateStr = new Date(booking.eventDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <div
                    key={booking.id}
                    className="bg-[#12141D] border border-white/10 hover:border-amber-500/40 rounded-2xl p-6 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-xs text-amber-300 font-bold bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                          {booking.bookingNumber}
                        </span>
                        <BookingStatusBadge status={booking.bookingStatus} />
                        <PaymentStatusBadge status={booking.paymentStatus} />
                      </div>

                      <div>
                        <h3 className="text-lg font-serif font-bold text-white">
                          {booking.package?.name || booking.eventType}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            <span>{dateStr} ({booking.startTime} - {booking.endTime})</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            <span className="truncate max-w-xs">{booking.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase">Total Amount</span>
                        <span className="text-lg font-serif font-bold text-white">
                          ₹{booking.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-amber-300/80 block">
                          Paid: ₹{booking.paidAmount.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <Link
                        href={`/dashboard/bookings/${booking.id}`}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
