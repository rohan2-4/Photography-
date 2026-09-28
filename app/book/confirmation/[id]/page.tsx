import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getCurrentUser } from '@/lib/auth/session';
import { CheckCircle2, Calendar, MapPin, Package, CreditCard, Clock, ArrowRight, User } from 'lucide-react';

export const revalidate = 0;

export default async function BookingConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const currentUser = await getCurrentUser();

  const booking = await prisma.booking.findFirst({
    where: {
      OR: [
        { bookingNumber: params.id },
        { id: params.id },
      ],
    },
    include: {
      package: true,
      payments: true,
    },
  });

  if (!booking) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-slate-100">
      <Navbar currentUser={currentUser} />
      <main className="flex-1 pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Success Banner */}
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-12 border border-gold-500/40 text-center space-y-6 relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-gold-gradient text-black flex items-center justify-center mx-auto shadow-gold-glow">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-gold-400 uppercase">
              RESERVATION SUCCESSFUL
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white">
              Booking Request Submitted
            </h1>
            <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
              Thank you for choosing Cinemayur. Your booking request and deposit have been registered in our studio database.
            </p>
          </div>

          {/* Key Reference Badge */}
          <div className="inline-block px-6 py-3 rounded-2xl bg-[#08090D] border border-gold-500/30 text-center space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">YOUR BOOKING ID</span>
            <span className="text-2xl font-mono font-bold text-gold-400">{booking.bookingNumber}</span>
          </div>
        </div>

        {/* Receipt Card Details */}
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-[#262A3C] space-y-8">
          <h3 className="text-2xl font-serif font-bold text-white border-b border-[#262A3C] pb-4">
            Booking Receipt & Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Customer Name</span>
              <span className="font-semibold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-gold-400" />
                {booking.customerName}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Event Date & Time</span>
              <span className="font-semibold text-gold-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold-400" />
                {new Date(booking.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} ({booking.startTime} - {booking.endTime})
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Photography Package</span>
              <span className="font-semibold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-gold-400" />
                {booking.package?.name || booking.eventType}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Venue Location</span>
              <span className="font-semibold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400" />
                {booking.location}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface-100 border border-surface-300 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Total Agreed Amount:</span>
              <span className="font-serif font-bold text-white text-lg">₹{booking.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Amount Paid So Far:</span>
              <span className="font-serif font-bold text-emerald-400 text-lg">₹{booking.paidAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-[#262A3C] pt-3">
              <span className="text-slate-400">Booking Status:</span>
              <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold uppercase tracking-wider border border-gold-500/30">
                {booking.bookingStatus}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Payment Status:</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                {booking.paymentStatus}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider text-center shadow-gold-glow hover:scale-105 transition-all"
            >
              Go To My Bookings Dashboard
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-surface-200 text-white hover:text-gold-300 text-xs font-semibold uppercase tracking-wider text-center border border-surface-300 transition-colors"
            >
              Back To Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
