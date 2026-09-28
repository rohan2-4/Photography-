'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, AlertTriangle, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface PackageOption {
  id: string;
  name: string;
  eventType: string;
  price: number;
}

interface AvailabilityCheckerProps {
  packages: PackageOption[];
}

export default function AvailabilityChecker({ packages }: AvailabilityCheckerProps) {
  const [eventType, setEventType] = useState('Wedding Photography');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<{
    status: 'AVAILABLE' | 'BOOKED' | 'HOLD';
    message: string;
    conflictingBookingId?: string;
    conflictingReason?: string;
  } | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDate) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/availability/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventDate,
          startTime,
          endTime,
          eventType,
          packageId: selectedPackageId || undefined,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        status: 'BOOKED',
        message: 'Unable to check availability. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages.filter(
    (p) => !eventType || p.eventType.toLowerCase().includes(eventType.toLowerCase()) || eventType.toLowerCase().includes(p.eventType.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Form Card */}
      <form onSubmit={handleCheck} className="glass-panel rounded-3xl p-8 sm:p-10 border border-[#262A3C] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Event Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              1. Event Type
            </label>
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

          {/* Preferred Date */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              2. Event Date
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Start Time */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              3. Approx Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              4. Approx End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        {/* Optional Package Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Select Package (Optional)
          </label>
          <select
            value={selectedPackageId}
            onChange={(e) => setSelectedPackageId(e.target.value)}
            className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
          >
            <option value="">Select a package (Optional)</option>
            {filteredPackages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — ₹{p.price.toLocaleString('en-IN')}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !eventDate}
          className="w-full py-4 rounded-xl bg-gold-gradient text-black font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Checking Studio Schedule...
            </>
          ) : (
            <>
              <CalendarIcon className="w-5 h-5" />
              Check Date Availability
            </>
          )}
        </button>
      </form>

      {/* Result Card Display */}
      {result && (
        <div className="animate-in fade-in duration-300">
          {result.status === 'AVAILABLE' && (
            <div className="rounded-3xl p-8 bg-emerald-950/40 border-2 border-emerald-500/60 space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-emerald-300">
                ✓ Your Date Is Available!
              </h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                {result.message} Reserve your date now before another client locks it in.
              </p>
              <div className="pt-2">
                <Link
                  href={`/book?eventType=${encodeURIComponent(eventType)}&date=${eventDate}&startTime=${startTime}&endTime=${endTime}${selectedPackageId ? `&packageId=${selectedPackageId}` : ''}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
                >
                  Continue Booking Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {result.status === 'BOOKED' && (
            <div className="rounded-3xl p-8 bg-rose-950/40 border-2 border-rose-500/60 space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/40">
                <XCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-rose-300">
                ✕ Sorry, This Date Is Already Booked
              </h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                {result.message} {result.conflictingReason && `Reason: ${result.conflictingReason}`}
              </p>
              <p className="text-xs text-slate-400">
                Please select an alternate date or contact our studio directly for custom arrangement options.
              </p>
            </div>
          )}

          {result.status === 'HOLD' && (
            <div className="rounded-3xl p-8 bg-amber-950/40 border-2 border-amber-500/60 space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-amber-300">
                ⚠ Date Temporarily On Hold
              </h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                {result.message}
              </p>
              <div className="pt-2">
                <Link
                  href={`/contact?subject=Availability+Inquiry+${eventDate}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 text-black font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Inquire Studio Directly
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
