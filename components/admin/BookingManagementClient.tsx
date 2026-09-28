'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  CreditCard,
  AlertCircle,
  Loader2,
  Calendar
} from 'lucide-react';

interface BookingItem {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  amount: number;
  paidAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  packageName?: string;
  additionalNotes?: string | null;
}

interface BookingManagementClientProps {
  initialBookings: BookingItem[];
}

export default function BookingManagementClient({ initialBookings }: BookingManagementClientProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (bookingId: string, bookingStatus: string, paymentStatus?: string) => {
    setLoadingAction(bookingId);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingStatus, paymentStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to update booking status');
        setLoadingAction(null);
        return;
      }

      // Update state
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: data.bookingStatus, paymentStatus: data.paymentStatus || b.paymentStatus } : b))
      );

      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, bookingStatus: data.bookingStatus, paymentStatus: data.paymentStatus || selectedBooking.paymentStatus });
      }

      router.refresh();
    } catch {
      setErrorMsg('Network error updating booking');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel rounded-2xl p-4 border border-[#262A3C]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search customer, email or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-100 border border-surface-300 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-100 border border-surface-300 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
          >
            <option value="ALL">All Booking Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-[#262A3C]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-surface-100 text-xs font-semibold uppercase text-slate-400 border-b border-[#262A3C]">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Event Date</th>
                <th className="p-4">Package</th>
                <th className="p-4">Amount / Paid</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262A3C]">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 text-sm">
                    No bookings found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-100/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-gold-400">{b.bookingNumber}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{b.customerName}</div>
                      <div className="text-xs text-slate-400">{b.customerEmail}</div>
                      <div className="text-xs text-slate-500">{b.customerPhone}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="font-semibold text-gold-300">
                        {new Date(b.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-slate-500">{b.startTime} - {b.endTime}</div>
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-200">
                      {b.packageName || b.eventType}
                    </td>
                    <td className="p-4">
                      <div className="font-serif font-bold text-white">₹{b.amount.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-emerald-400">Paid: ₹{b.paidAmount.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="p-4 space-y-1">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        b.bookingStatus === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        b.bookingStatus === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        b.bookingStatus === 'COMPLETED' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {b.bookingStatus}
                      </span>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">{b.paymentStatus}</div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="px-3 py-1.5 rounded-lg bg-surface-200 hover:bg-gold-500 hover:text-black text-xs font-semibold text-white flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-8 border border-gold-500/40 max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#262A3C] pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-gold-400 uppercase">
                  MANAGE BOOKING #{selectedBooking.bookingNumber}
                </span>
                <h3 className="text-2xl font-serif font-bold text-white mt-1">
                  {selectedBooking.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs space-y-1">
              <div>
                <span className="text-slate-400 block uppercase">Event Type & Package</span>
                <span className="font-semibold text-white">{selectedBooking.packageName || selectedBooking.eventType}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase">Scheduled Date</span>
                <span className="font-semibold text-gold-300">{new Date(selectedBooking.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} ({selectedBooking.startTime} - {selectedBooking.endTime})</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase">Customer Contact</span>
                <span className="font-semibold text-white">{selectedBooking.customerEmail} / {selectedBooking.customerPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase">Venue Location</span>
                <span className="font-semibold text-white">{selectedBooking.location}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase">Pricing</span>
                <span className="font-serif font-bold text-white text-sm">₹{selectedBooking.amount.toLocaleString('en-IN')} (Paid: ₹{selectedBooking.paidAmount.toLocaleString('en-IN')})</span>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="space-y-3 pt-4 border-t border-[#262A3C]">
              <span className="text-xs font-bold text-slate-300 uppercase">Admin Action Controls</span>
              <div className="flex flex-wrap gap-3">
                {selectedBooking.bookingStatus !== 'CONFIRMED' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'CONFIRMED')}
                    disabled={loadingAction === selectedBooking.id}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase flex items-center gap-1"
                  >
                    {loadingAction === selectedBooking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Confirm Booking (Lock Date)
                  </button>
                )}

                {selectedBooking.bookingStatus !== 'COMPLETED' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'COMPLETED', 'PAID')}
                    disabled={loadingAction === selectedBooking.id}
                    className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs uppercase flex items-center gap-1"
                  >
                    Mark Event Completed & Paid
                  </button>
                )}

                {selectedBooking.bookingStatus !== 'REJECTED' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'REJECTED')}
                    disabled={loadingAction === selectedBooking.id}
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs uppercase flex items-center gap-1"
                  >
                    Reject Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
