import { CheckCircle2, Clock, Check, XCircle } from 'lucide-react';

interface TimelineProps {
  bookingStatus: string; // PENDING, CONFIRMED, REJECTED, CANCELLED, COMPLETED
  paymentStatus: string; // UNPAID, PARTIAL, PAID, REFUNDED
}

export default function BookingTimeline({ bookingStatus, paymentStatus }: TimelineProps) {
  const isRejectedOrCancelled = bookingStatus === 'REJECTED' || bookingStatus === 'CANCELLED';

  const steps = [
    {
      id: 'requested',
      title: 'Booking Requested',
      desc: 'Booking submitted by customer',
      completed: true,
      active: bookingStatus === 'PENDING',
    },
    {
      id: 'reviewed',
      title: 'Reviewed by Studio',
      desc: 'Photographer schedule reviewed',
      completed: ['CONFIRMED', 'COMPLETED'].includes(bookingStatus),
      active: bookingStatus === 'PENDING',
    },
    {
      id: 'confirmed',
      title: 'Confirmed',
      desc: 'Date & crew reserved',
      completed: ['CONFIRMED', 'COMPLETED'].includes(bookingStatus),
      active: bookingStatus === 'CONFIRMED' && paymentStatus !== 'PAID',
    },
    {
      id: 'payment',
      title: 'Payment Status',
      desc: paymentStatus === 'PAID' ? 'Fully Paid' : paymentStatus === 'PARTIAL' ? 'Advance Paid (Deposit)' : 'Payment Pending',
      completed: paymentStatus === 'PAID' || (paymentStatus === 'PARTIAL' && ['CONFIRMED', 'COMPLETED'].includes(bookingStatus)),
      active: paymentStatus === 'PARTIAL',
    },
    {
      id: 'completed',
      title: 'Event Completed',
      desc: 'Photos & films delivered',
      completed: bookingStatus === 'COMPLETED',
      active: bookingStatus === 'COMPLETED',
    },
  ];

  if (isRejectedOrCancelled) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <XCircle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-serif font-bold text-red-300">
          Booking {bookingStatus}
        </h4>
        <p className="text-xs text-slate-300">
          This booking has been {bookingStatus.toLowerCase()}. Please contact our studio support for refund processing or rescheduling.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#12141D] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
      <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
        <span>Booking Lifecycle Timeline</span>
      </h3>

      <div className="relative">
        <div className="hidden sm:block absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 z-0"></div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center text-center space-y-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                  step.completed
                    ? 'bg-amber-400 text-black ring-4 ring-amber-500/20'
                    : step.active
                    ? 'bg-amber-500/20 text-amber-300 border-2 border-amber-400 animate-pulse'
                    : 'bg-slate-900 text-slate-500 border border-white/10'
                }`}
              >
                {step.completed ? <Check className="w-5 h-5 stroke-[3]" /> : idx + 1}
              </div>

              <div>
                <div
                  className={`text-xs font-semibold ${
                    step.completed || step.active ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
