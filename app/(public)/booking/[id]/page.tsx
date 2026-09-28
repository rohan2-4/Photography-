import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, Calendar, MapPin, User, Mail, Phone, ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { prisma } from '@/lib/db/prisma';
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/ui/BookingStatusBadge';
import BookingTimeline from '@/components/ui/BookingTimeline';

interface PageProps {
  params: { id: string };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BookingConfirmationPage({ params }: PageProps) {
  const booking = await prisma.booking.findFirst({
    where: {
      OR: [
        { id: params.id },
        { bookingNumber: params.id },
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

  const eventDateFormatted = new Date(booking.eventDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
            Request Received
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Booking Request Submitted!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Your booking request has been received by Mayur Gadade. Studio team will review your event schedule and confirm date reservation.
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-[#12141D] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs text-slate-400 font-mono">Reference Number</span>
            <h2 className="text-2xl font-serif font-bold text-amber-300">
              {booking.bookingNumber}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <BookingStatusBadge status={booking.bookingStatus} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Customer Name</span>
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
                <span className="text-slate-500 block text-[10px] uppercase">Phone Number</span>
                <span className="font-semibold text-white">{booking.customerPhone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Event Date & Schedule</span>
                <span className="font-semibold text-white">{eventDateFormatted} ({booking.startTime} - {booking.endTime})</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Venue Location</span>
                <span className="font-semibold text-white">{booking.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold text-[10px] shrink-0">₹</span>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Package Price</span>
                <span className="font-semibold text-white">{booking.package?.name} — ₹{booking.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {booking.additionalNotes && (
          <div className="pt-4 border-t border-white/10 text-xs bg-black/30 p-4 rounded-xl border border-white/5 space-y-1">
            <span className="font-semibold text-slate-300">Special Notes: </span>
            <p className="text-slate-400 leading-relaxed">{booking.additionalNotes}</p>
          </div>
        )}
      </div>

      {/* Booking Timeline */}
      <BookingTimeline
        bookingStatus={booking.bookingStatus}
        paymentStatus={booking.paymentStatus}
      />

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-xl text-xs font-semibold text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4 text-amber-400" />
          <span>Go to My Customer Dashboard</span>
        </Link>

        <Link
          href="/"
          className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

    </div>
  );
}
