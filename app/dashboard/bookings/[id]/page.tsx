import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, User, Mail, Phone, Receipt, CreditCard, ShieldCheck } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/ui/BookingStatusBadge';
import BookingTimeline from '@/components/ui/BookingTimeline';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

interface PageProps {
  params: { id: string };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CustomerBookingDetailPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const booking = await prisma.booking.findFirst({
    where: {
      OR: [
        { id: params.id },
        { bookingNumber: params.id },
      ],
    },
    include: {
      package: {
        include: { service: true }
      },
      payments: {
        orderBy: { paidAt: 'desc' }
      }
    }
  });

  if (!booking) notFound();

  // Guard access
  if (user.role === 'CUSTOMER' && booking.customerId && booking.customerId !== user.id && booking.customerEmail !== user.email) {
    redirect('/dashboard');
  }

  const dateFormatted = new Date(booking.eventDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-black">
      <Navbar initialUser={user} />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
        
        {/* Navigation back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Bookings</span>
        </Link>

        {/* Header Summary */}
        <div className="bg-[#12141D] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs text-slate-400 font-mono">Booking ID</span>
              <h1 className="text-3xl font-serif font-bold text-amber-300">
                {booking.bookingNumber}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <BookingStatusBadge status={booking.bookingStatus} />
              <PaymentStatusBadge status={booking.paymentStatus} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-300">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Primary Customer</span>
                  <span className="font-semibold text-white">{booking.customerName}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Email Contact</span>
                  <span className="font-semibold text-white">{booking.customerEmail}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Phone / WhatsApp</span>
                  <span className="font-semibold text-white">{booking.customerPhone}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Event Schedule</span>
                  <span className="font-semibold text-white">{dateFormatted} ({booking.startTime} - {booking.endTime})</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Venue Location</span>
                  <span className="font-semibold text-white">{booking.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <BookingTimeline
          bookingStatus={booking.bookingStatus}
          paymentStatus={booking.paymentStatus}
        />

        {/* Financial Receipts & Payments */}
        <div className="bg-[#12141D] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
            <Receipt className="w-5 h-5 text-amber-400" />
            <span>Financial & Payment Receipts</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase">Total Contract Value</span>
              <div className="text-xl font-serif font-bold text-white">₹{booking.amount.toLocaleString('en-IN')}</div>
            </div>

            <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase">Amount Paid</span>
              <div className="text-xl font-serif font-bold text-emerald-400">₹{booking.paidAmount.toLocaleString('en-IN')}</div>
            </div>

            <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase">Remaining Due</span>
              <div className="text-xl font-serif font-bold text-amber-300">
                ₹{Math.max(0, booking.amount - booking.paidAmount).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Payment Transactions ({booking.payments.length})
            </h4>

            {booking.payments.length === 0 ? (
              <p className="text-xs text-slate-500">No payment transaction records registered.</p>
            ) : (
              <div className="space-y-2">
                {booking.payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between bg-black/30 p-3.5 rounded-xl border border-white/5 text-xs"
                  >
                    <div>
                      <span className="font-mono text-amber-400 font-semibold">{p.transactionId}</span>
                      <span className="text-slate-400 block text-[10px]">
                        Method: {p.paymentMethod} • Type: {p.paymentType} • Date: {new Date(p.paidAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-emerald-400">₹{p.amount.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-slate-400 block uppercase">{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
