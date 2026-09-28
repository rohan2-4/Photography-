'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';

interface PackageOption {
  id: string;
  name: string;
  eventType: string;
  price: number;
  discountedPrice?: number | null;
  duration: string;
}

interface OfferOption {
  id: string;
  code: string;
  title: string;
  discountPercent?: number | null;
  discountAmount?: number | null;
}

interface BookingFormClientProps {
  packages: PackageOption[];
  offers: OfferOption[];
  currentUser?: {
    name: string;
    email: string;
    phone?: string | null;
  } | null;
}

export default function BookingFormClient({ packages, offers, currentUser }: BookingFormClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial params
  const initialPackageId = searchParams.get('packageId') || '';
  const initialEventType = searchParams.get('eventType') || 'Wedding Photography';
  const initialDate = searchParams.get('date') || '';
  const initialStartTime = searchParams.get('startTime') || '09:00';
  const initialEndTime = searchParams.get('endTime') || '18:00';
  const initialOfferCode = searchParams.get('offerCode') || '';

  // Form State
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Event & Package, 2: Customer Info, 3: Review & Mock Payment
  const [eventType, setEventType] = useState(initialEventType);
  const [packageId, setPackageId] = useState(initialPackageId);
  const [eventDate, setEventDate] = useState(initialDate);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [location, setLocation] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Customer Details
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');

  // Payment Selection
  const [paymentType, setPaymentType] = useState<'ADVANCE' | 'FULL'>('ADVANCE');
  const [appliedOfferCode, setAppliedOfferCode] = useState(initialOfferCode);
  const [cardHolder, setCardHolder] = useState(customerName || 'Test Cardholder');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8899');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculations
  const selectedPackage = packages.find((p) => p.id === packageId) || packages[0];
  const basePrice = selectedPackage?.discountedPrice || selectedPackage?.price || 50000;

  let discountAmount = 0;
  if (appliedOfferCode) {
    const foundOffer = offers.find((o) => o.code.toUpperCase() === appliedOfferCode.toUpperCase());
    if (foundOffer) {
      if (foundOffer.discountPercent) {
        discountAmount = (basePrice * foundOffer.discountPercent) / 100;
      } else if (foundOffer.discountAmount) {
        discountAmount = foundOffer.discountAmount;
      }
    }
  }

  const finalAmount = Math.max(0, basePrice - discountAmount);
  const depositAmount = Math.round(finalAmount * 0.3); // 30% advance
  const payableAmount = paymentType === 'ADVANCE' ? depositAmount : finalAmount;

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDate) {
      setErrorMsg('Please select an event date');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !location) {
      setErrorMsg('Please complete all required fields');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleSubmitBooking = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          eventType,
          eventDate,
          startTime,
          endTime,
          location,
          packageId: selectedPackage?.id,
          additionalNotes,
          paymentType,
          amount: finalAmount,
          payableAmount,
          offerCode: appliedOfferCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Booking creation failed. Please check availability.');
        setLoading(false);
        return;
      }

      // Successful creation -> Redirect to booking confirmation receipt
      router.push(`/book/confirmation/${data.bookingNumber}`);
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 border-b border-[#262A3C] pb-6">
        <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${step >= 1 ? 'text-gold-400' : 'text-slate-500'}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono ${step >= 1 ? 'bg-gold-gradient text-black font-bold' : 'bg-surface-200 text-slate-400'}`}>1</span>
          Select Package & Date
        </div>
        <span className="text-slate-600">→</span>
        <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${step >= 2 ? 'text-gold-400' : 'text-slate-500'}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono ${step >= 2 ? 'bg-gold-gradient text-black font-bold' : 'bg-surface-200 text-slate-400'}`}>2</span>
          Customer Info
        </div>
        <span className="text-slate-600">→</span>
        <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${step >= 3 ? 'text-gold-400' : 'text-slate-500'}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono ${step >= 3 ? 'bg-gold-gradient text-black font-bold' : 'bg-surface-200 text-slate-400'}`}>3</span>
          Review & Mock Payment
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <form onSubmit={handleNextStep1} className="glass-panel rounded-3xl p-8 sm:p-10 border border-[#262A3C] space-y-6">
          <h3 className="text-2xl font-serif font-bold text-white">Event & Package Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
              >
                <option value="Wedding Photography">Wedding Photography</option>
                <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                <option value="Engagement">Engagement & Sangeet</option>
                <option value="Maternity">Maternity & Pregnancy</option>
                <option value="Baby">Baby & Newborn</option>
                <option value="Corporate Events">Corporate Events</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Select Package</label>
              <select
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
              >
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.eventType}) — ₹{(p.discountedPrice || p.price).toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Event Date *</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:scale-[1.02] transition-all"
            >
              Continue To Customer Details →
            </button>
          </div>
        </form>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <form onSubmit={handleNextStep2} className="glass-panel rounded-3xl p-8 sm:p-10 border border-[#262A3C] space-y-6">
          <h3 className="text-2xl font-serif font-bold text-white">Customer Information & Location</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Full Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Priya & Vikram Malhotra"
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Email Address *</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="priya@example.com"
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Phone Number *</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-300">Event Location / Venue Address *</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. The Leela Palace, Udaipur, Rajasthan"
              className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-300">Additional Instructions or Special Requests</label>
            <textarea
              rows={3}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Mention any specific ritual focuses, entry themes, or drone preferences..."
              className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500 resize-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-xl bg-surface-200 text-slate-300 text-xs font-semibold uppercase hover:bg-surface-300 transition-colors"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:scale-[1.02] transition-all"
            >
              Review & Pay →
            </button>
          </div>
        </form>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Summary */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-8 sm:p-10 border border-[#262A3C] space-y-6">
            <h3 className="text-2xl font-serif font-bold text-white">Review Booking Order</h3>

            <div className="space-y-4 text-sm border-y border-[#262A3C] py-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Package:</span>
                <span className="font-bold text-white">{selectedPackage?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Event Type:</span>
                <span className="text-slate-200">{eventType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="text-gold-400 font-semibold">{eventDate} ({startTime} - {endTime})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Venue Location:</span>
                <span className="text-slate-200 text-right max-w-xs">{location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="text-slate-200">{customerName} ({customerPhone})</span>
              </div>
            </div>

            {/* Offer Code Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Have a Promotional Code?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={appliedOfferCode}
                  onChange={(e) => setAppliedOfferCode(e.target.value)}
                  placeholder="e.g. ROYALWED20"
                  className="flex-1 bg-surface-100 border border-surface-300 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-gold-500 font-mono uppercase"
                />
              </div>
              {discountAmount > 0 && (
                <p className="text-xs text-emerald-400 font-semibold">
                  ✓ Offer Code Applied! Saved ₹{discountAmount.toLocaleString('en-IN')}
                </p>
              )}
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 pt-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Base Package Price:</span>
                <span>₹{basePrice.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount Savings:</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-white border-t border-[#262A3C] pt-2">
                <span>Total Amount:</span>
                <span className="text-gold-400">₹{finalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Payment Card & Checkout Action */}
          <div className="lg:col-span-5 glass-panel-gold rounded-3xl p-8 border border-gold-500/40 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gold-400 font-mono text-xs font-bold uppercase">
                <ShieldCheck className="w-4 h-4" />
                SECURE MOCK CHECKOUT
              </div>

              <h4 className="text-xl font-serif font-bold text-white">Payment Options</h4>

              <div className="space-y-3">
                <label className={`block p-4 rounded-xl border cursor-pointer transition-all ${paymentType === 'ADVANCE' ? 'bg-gold-500/10 border-gold-500 text-gold-300' : 'bg-surface-100 border-surface-300 text-slate-400'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentType"
                        checked={paymentType === 'ADVANCE'}
                        onChange={() => setPaymentType('ADVANCE')}
                        className="accent-gold-500"
                      />
                      <div>
                        <div className="font-bold text-sm text-white">Pay 30% Advance Deposit</div>
                        <div className="text-xs text-slate-400">Lock date on calendar</div>
                      </div>
                    </div>
                    <span className="font-bold font-serif text-gold-400 text-base">₹{depositAmount.toLocaleString('en-IN')}</span>
                  </div>
                </label>

                <label className={`block p-4 rounded-xl border cursor-pointer transition-all ${paymentType === 'FULL' ? 'bg-gold-500/10 border-gold-500 text-gold-300' : 'bg-surface-100 border-surface-300 text-slate-400'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentType"
                        checked={paymentType === 'FULL'}
                        onChange={() => setPaymentType('FULL')}
                        className="accent-gold-500"
                      />
                      <div>
                        <div className="font-bold text-sm text-white">Pay Full Amount Now</div>
                        <div className="text-xs text-slate-400">Complete payment</div>
                      </div>
                    </div>
                    <span className="font-bold font-serif text-gold-400 text-base">₹{finalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </label>
              </div>

              {/* Card info */}
              <div className="p-4 rounded-2xl bg-[#08090D] border border-gold-500/20 space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-gold-400" /> Mock Card Simulation</span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Dev Sandbox</span>
                </div>
                <div className="font-mono text-slate-200 text-sm tracking-wider">{cardNumber}</div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Holder: {cardHolder}</span>
                  <span>Expires: 12/28</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button
                type="button"
                onClick={handleSubmitBooking}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow hover:scale-[1.01] transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment & Securing Date...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Authorize Payment of ₹{payableAmount.toLocaleString('en-IN')}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-2.5 text-center text-xs text-slate-400 hover:text-white"
              >
                ← Back to Customer Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
