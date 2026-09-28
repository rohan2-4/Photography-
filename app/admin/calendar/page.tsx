'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Unlock, 
  Plus, 
  X, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { BookingStatusBadge } from '@/components/ui/BookingStatusBadge';

interface Booking {
  id: string;
  bookingNumber: string;
  customerName: string;
  eventType: string;
  eventDate: string;
  bookingStatus: string;
}

interface Block {
  id: string;
  date: string;
  reason: string;
  startTime?: string | null;
  endTime?: string | null;
}

export default function AdminCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  // Block Modal state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCalendarData();
  }, [currentMonth]);

  const fetchCalendarData = async () => {
    setLoading(true);
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    try {
      const res = await fetch(`/api/admin/calendar?month=${year}-${month}`);
      const data = await res.json();
      setBookings(data.bookings || []);
      setBlocks(data.blocks || []);
    } catch {
      console.error('Failed to fetch calendar');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !blockReason) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          reason: blockReason,
        }),
      });

      if (!res.ok) throw new Error('Failed to block date');

      setBlockReason('');
      setSelectedDate(null);
      await fetchCalendarData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error creating block');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnblock = async (blockId: string) => {
    try {
      const res = await fetch(`/api/admin/calendar?id=${blockId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to unblock');
      await fetchCalendarData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error unblocking date');
    }
  };

  // Generate calendar grid days
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const getDayStatus = (dayNumber: number) => {
    const d = new Date(year, month, dayNumber);
    d.setHours(0, 0, 0, 0);

    const dateStr = d.toISOString().split('T')[0];

    // Check blocks
    const block = blocks.find((b) => {
      const bd = new Date(b.date);
      return bd.toISOString().split('T')[0] === dateStr;
    });

    if (block) return { status: 'BLOCKED', block };

    // Check bookings
    const dayBookings = bookings.filter((bk) => {
      const bkd = new Date(bk.eventDate);
      return bkd.toISOString().split('T')[0] === dateStr;
    });

    const confirmed = dayBookings.find((b) => b.bookingStatus === 'CONFIRMED');
    if (confirmed) return { status: 'BOOKED', booking: confirmed, dayBookings };

    const pending = dayBookings.find((b) => b.bookingStatus === 'PENDING');
    if (pending) return { status: 'PENDING', booking: pending, dayBookings };

    return { status: 'AVAILABLE', dayBookings };
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Studio Availability Engine
          </span>
          <h1 className="text-3xl font-serif font-bold text-white">
            Interactive Photography Calendar
          </h1>
        </div>

        {/* Legend Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="text-slate-300">Pending Hold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-slate-300">Confirmed Booking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-slate-300">Studio Blocked</span>
          </div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-[#12141D] p-4 rounded-2xl border border-white/10">
        <button
          onClick={handlePrevMonth}
          className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Month</span>
        </button>

        <h2 className="text-xl font-serif font-bold text-amber-300">
          {monthName}
        </h2>

        <button
          onClick={handleNextMonth}
          className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
        >
          <span>Next Month</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#12141D] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
        
        {/* Day Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider pb-2 border-b border-white/10">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Grid */}
        {loading ? (
          <div className="text-center py-24">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Updating Calendar Matrix...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {/* Empty offset cells */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-28 bg-slate-900/30 rounded-2xl opacity-30"></div>
            ))}

            {/* Calendar Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(year, month, dayNum);
              const info = getDayStatus(dayNum);

              let bgColor = 'bg-slate-900/60 hover:bg-slate-900 border-white/5';
              let badgeColor = 'text-emerald-400 bg-emerald-500/10';
              let statusText = 'AVAILABLE';

              if (info.status === 'BLOCKED') {
                bgColor = 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20';
                badgeColor = 'text-red-400 bg-red-500/20';
                statusText = 'BLOCKED';
              } else if (info.status === 'BOOKED') {
                bgColor = 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20';
                badgeColor = 'text-blue-400 bg-blue-500/20';
                statusText = 'BOOKED';
              } else if (info.status === 'PENDING') {
                bgColor = 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20';
                badgeColor = 'text-amber-300 bg-amber-500/20';
                statusText = 'PENDING';
              }

              return (
                <div
                  key={`day-${dayNum}`}
                  onClick={() => setSelectedDate(dateObj)}
                  className={`h-28 p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${bgColor}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white group-hover:text-amber-300">
                      {dayNum}
                    </span>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${badgeColor}`}>
                      {statusText}
                    </span>
                  </div>

                  <div className="space-y-1 text-[10px] overflow-hidden">
                    {info.status === 'BLOCKED' && (
                      <div className="text-red-300 truncate italic">
                        🚫 {info.block?.reason}
                      </div>
                    )}
                    {info.booking && (
                      <div className="text-slate-300 truncate font-medium">
                        📌 {info.booking.customerName} ({info.booking.eventType})
                      </div>
                    )}
                  </div>

                  <div className="text-[9px] text-slate-500 group-hover:text-amber-400 flex items-center justify-end gap-1">
                    <Plus className="w-3 h-3" />
                    <span>Manage</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Date Block / Manage Modal */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12141D] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs text-slate-400 font-mono">Date Selection</span>
                <h3 className="text-xl font-serif font-bold text-amber-300">
                  {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-2 text-slate-400 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Active Block? */}
            {(() => {
              const dateStr = selectedDate.toISOString().split('T')[0];
              const activeBlock = blocks.find((b) => new Date(b.date).toISOString().split('T')[0] === dateStr);

              if (activeBlock) {
                return (
                  <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-red-300 font-bold text-xs">
                      <Lock className="w-4 h-4" />
                      <span>This date is currently BLOCKED</span>
                    </div>
                    <p className="text-xs text-slate-300">Reason: {activeBlock.reason}</p>
                    <button
                      onClick={() => handleUnblock(activeBlock.id)}
                      className="w-full py-2.5 bg-red-500 hover:bg-red-400 text-black text-xs font-bold rounded-xl transition-all"
                    >
                      Unblock This Date
                    </button>
                  </div>
                );
              }

              return (
                <form onSubmit={handleCreateBlock} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Reason to Block Date</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Studio Equipment Maintenance, Destination Travel Day"
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    <span>Block Date in Studio Calendar</span>
                  </button>
                </form>
              );
            })()}

          </div>
        </div>
      )}

    </div>
  );
}
