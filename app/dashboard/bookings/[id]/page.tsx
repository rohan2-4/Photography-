import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  CalendarCheck,
  Calendar,
  Clock,
  MapPin,
  Package,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Receipt,
  FileText
} from 'lucide-react';

export const revalidate = 0;

export default async function CustomerBookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/login');
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: params.id,
      OR: [
        { customerId: currentUser.id },
        { customerEmail: currentUser.email },
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

  // Determine timeline progress
  const steps = [
    { label: 'Booking Requested', done: true, current: booking.bookingStatus === 'PENDING' },
    { label: 'Studio Reviewed', done: booking.bookingStatus !== 'PENDING', current: false },
    { label: 'Confirmed', done: ['CONFIRMED', 'COMPLETED'].includes(booking.bookingStatus), current: booking.bookingStatus === 'CONFIRMED' },
    { label: 'Deposit Paid', done: booking.paidAmount > 0, current: booking.paymentStatus === 'PARTIAL' },
    { label: 'Event Completed', done: booking.bookingStatus === 'COMPLETED', current: booking.bookingStatus === 'COMPLETED' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-slate-100">
      <Navbar currentUser={currentUser} />
      <main className="flex-1 pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase text-slate-400 hover:text-gold-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back To Dashboard
        </Link>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-3xl p-8 border border-[#262A3C]">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 font-mono text-xs font-bold border border-gold-500/40">
                {booking.bookingNumber}
              </span>
              <span className="text-xs text-slate-400 uppercase font-semibold">
                Created: {new Date(booking.createdAt).toLocaleDateString('en-IN')}
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mt-2">
              {booking.package?.name || booking.eventType}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              booking.bookingStatus === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
              booking.bookingStatus === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
              booking.bookingStatus === 'COMPLETED' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
              'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}>
              {booking.bookingStatus}
            </span>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="glass-panel rounded-3xl p-8 border border-[#262A3C] space-y-6">
          <h3 className="text-xl font-serif font-bold text-white">Booking Progress Timeline</h3>

          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-2">
            {steps.map((step, idx) => (
              <div key={idx} className="flex md:flex-col items-center gap-3 md:text-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                    step.done
                      ? 'bg-gold-gradient text-black shadow-gold-glow'
                      : 'bg-surface-200 text-slate-500 border border-surface-300'
                  }`}
                >
                  {step.done ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <span className={`text-xs font-semibold ${step.done ? 'text-gold-300' : 'text-slate-500'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Details Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel rounded-3xl p-8 border border-[#262A3C] space-y-6">
            <h3 className="text-xl font-serif font-bold text-white border-b border-[#262A3C] pb-3">
              Event & Location Details
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 block uppercase">Scheduled Date</span>
                  <span className="font-semibold text-white">
                    {new Date(booking.eventDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 block uppercase">Timings</span>
                  <span className="font-semibold text-white">{booking.startTime} – {booking.endTime}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 block uppercase">Venue Address</span>
                  <span className="font-semibold text-white">{booking.location}</span>
                </div>
              </div>

              {booking.additionalNotes && (
                <div className="flex items-start gap-3 pt-2 border-t border-[#262A3C]">
                  <FileText className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block uppercase">Special Instructions</span>
                    <span className="text-xs text-slate-300 italic">{booking.additionalNotes}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-8 border border-[#262A3C] space-y-6">
            <h3 className="text-xl font-serif font-bold text-white border-b border-[#262A3C] pb-3">
              Financial Summary & Payments
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Total Agreement Amount:</span>
                <span className="font-bold text-white">₹{booking.amount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Total Paid:</span>
                <span className="font-bold text-emerald-400">₹{booking.paidAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-400 border-t border-[#262A3C] pt-3">
                <span>Remaining Balance Due:</span>
                <span className="font-bold text-gold-400">₹{(booking.amount - booking.paidAmount).toLocaleString('en-IN')}</span>
              </div>

              {/* Transactions log */}
              <div className="pt-4 space-y-2">
                <span className="text-xs uppercase font-bold text-slate-400">Payment Transactions</span>
                {booking.payments.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No payments logged yet.</p>
                ) : (
                  booking.payments.map((p) => (
                    <div key={p.id} className="p-3 rounded-xl bg-surface-100 border border-surface-300 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-mono text-slate-300 font-bold">{p.transactionId}</div>
                        <div className="text-[10px] text-slate-500">{new Date(p.paidAt).toLocaleDateString('en-IN')} ({p.paymentType})</div>
                      </div>
                      <span className="font-serif font-bold text-emerald-400">₹{p.amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
