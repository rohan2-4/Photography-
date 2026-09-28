'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';

interface AvailabilityCheckerProps {
  initialPackageId?: string;
}

export default function AvailabilityChecker({ initialPackageId }: AvailabilityCheckerProps) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [eventType, setEventType] = useState('Wedding Photography');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: 'AVAILABLE' | 'BOOKED' | 'HOLD';
    message: string;
    conflictingReason?: string;
  } | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/availability?date=${date}&startTime=${startTime}&endTime=${endTime}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        status: 'BOOKED',
        message: 'Could not connect to availability server. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#12141D] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
          Live Booking Engine
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          Check Your Special Date
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Select your event details below to check whether Cinemayur lead photographers are available.
        </p>
      </div>

      <form onSubmit={handleCheck} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Event Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Event Category</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="Wedding Photography">Wedding Photography</option>
              <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
              <option value="Engagement">Engagement & Sangeet</option>
              <option value="Maternity">Maternity & Pregnancy</option>
              <option value="Baby">Baby & Newborn</option>
              <option value="Corporate Events">Corporate Events</option>
              <option value="Other Events">Other Events</option>
            </select>
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Preferred Event Date</label>
            <div className="relative">
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Time Slots */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Expected Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 [color-scheme:dark]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Expected End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 [color-scheme:dark]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !date}
          className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Calendar Schedule...</span>
            </>
          ) : (
            <>
              <CalendarIcon className="w-4 h-4" />
              <span>Check Date Availability</span>
            </>
          )}
        </button>
      </form>

      {/* Result Status Display */}
      {result && (
        <div className="pt-4 border-t border-white/10 animate-in fade-in duration-300">
          {result.status === 'AVAILABLE' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-serif font-bold text-emerald-300">
                  ✓ Your Date & Time is Available!
                </h4>
                <p className="text-xs text-slate-300">{result.message}</p>
              </div>
              <div className="pt-2">
                <Link
                  href={`/book?date=${date}&eventType=${encodeURIComponent(eventType)}&startTime=${startTime}&endTime=${endTime}${initialPackageId ? `&packageId=${initialPackageId}` : ''}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 px-6 py-3 rounded-xl shadow-lg transition-all"
                >
                  <span>Continue Booking Process</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {result.status === 'BOOKED' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                <XCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-serif font-bold text-red-300">
                  ✕ Sorry, Date is Already Booked
                </h4>
                <p className="text-xs text-slate-300">{result.message}</p>
                {result.conflictingReason && (
                  <p className="text-[11px] text-red-400 italic">
                    Reason: {result.conflictingReason}
                  </p>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Please pick another preferred date or contact our team directly for custom schedule arrangements.
              </p>
            </div>
          )}

          {result.status === 'HOLD' && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-serif font-bold text-amber-300">
                  ⚠ Temporarily On Hold
                </h4>
                <p className="text-xs text-slate-300">{result.message}</p>
              </div>
              <div className="pt-2">
                <Link
                  href={`/contact?subject=${encodeURIComponent(`Availability inquiry for ${date}`)}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 px-5 py-2.5 rounded-xl transition-all"
                >
                  Contact Studio Lead
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
