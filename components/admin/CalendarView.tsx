'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Lock, Unlock, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CalendarViewProps {
  bookings: {
    id: string;
    bookingNumber: string;
    customerName: string;
    eventDate: string;
    eventType: string;
    bookingStatus: string;
  }[];
  blocks: {
    id: string;
    date: string;
    reason: string;
  }[];
}

export default function CalendarView({ bookings, blocks }: CalendarViewProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [blockReason, setBlockReason] = useState('Photographer Studio Maintenance');
  const [loading, setLoading] = useState(false);

  const handleBlockDate = async () => {
    if (!selectedDate) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/availability-blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate, reason: blockReason }),
      });

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockDate = async (blockId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/availability-blocks?id=${blockId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Block Date Form */}
      <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-[#262A3C] space-y-6">
        <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-gold-400" />
          Block Calendar Date
        </h3>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold uppercase text-slate-300">Select Date To Block</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold uppercase text-slate-300">Reason For Blocking</label>
            <input
              type="text"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="e.g. Destination Shoot, Maintenance"
              className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <button
            type="button"
            onClick={handleBlockDate}
            disabled={loading || !selectedDate}
            className="w-full py-3 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider shadow-gold-glow cursor-pointer disabled:opacity-50"
          >
            Block Date On Schedule
          </button>
        </div>

        {/* Existing Blocks List */}
        <div className="pt-4 border-t border-[#262A3C] space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-300">Current Studio Blocks</h4>
          {blocks.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No manual date blocks set.</p>
          ) : (
            blocks.map((blk) => (
              <div key={blk.id} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-rose-300">{new Date(blk.date).toLocaleDateString('en-IN')}</div>
                  <div className="text-[10px] text-slate-400">{blk.reason}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleUnblockDate(blk.id)}
                  className="text-slate-400 hover:text-rose-400 text-xs font-bold"
                  title="Unblock date"
                >
                  <Unlock className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Booked Events Schedule List */}
      <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-[#262A3C] space-y-6">
        <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-gold-400" />
          Studio Calendar Reservations
        </h3>

        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-surface-100 border border-surface-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gold-400">{b.bookingNumber}</span>
                  <span className="text-xs font-bold text-white">{b.customerName}</span>
                </div>
                <div className="text-xs text-slate-400">{b.eventType}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gold-300 bg-black/40 px-3 py-1.5 rounded-lg border border-gold-500/30">
                  {new Date(b.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  b.bookingStatus === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  b.bookingStatus === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {b.bookingStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
