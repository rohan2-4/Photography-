'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  Loader2,
  Check,
  X,
  CreditCard
} from 'lucide-react';
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/ui/BookingStatusBadge';

interface Booking {
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
  depositAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  additionalNotes?: string;
  package?: {
    name: string;
  };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      console.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, bookingStatus: string, paymentStatus?: string) => {
    setUpdatingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingStatus, paymentStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');

      // Refresh list
      await fetchBookings();
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(data.booking);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.bookingStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Studio Reservations
          </span>
          <h1 className="text-3xl font-serif font-bold text-white">
            Booking Management & Approvals
          </h1>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#12141D] p-4 rounded-2xl border border-white/10">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by ID, Customer Name, Email, Venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'REJECTED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table List */}
      {loading ? (
        <div className="text-center py-20 bg-[#12141D] rounded-2xl border border-white/10">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 mt-2">Loading Studio Bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-20 bg-[#12141D] rounded-2xl border border-white/10 space-y-2">
          <h3 className="text-sm font-serif font-bold text-white">No Bookings Found</h3>
          <p className="text-xs text-slate-400">Try changing your search keywords or status filters.</p>
        </div>
      ) : (
        <div className="bg-[#12141D] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Event & Date</th>
                  <th className="py-3.5 px-4">Venue</th>
                  <th className="py-3.5 px-4">Amount / Paid</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredBookings.map((booking) => {
                  const isUpdating = updatingId === booking.id;
                  const eventDateStr = new Date(booking.eventDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-amber-300">
                        {booking.bookingNumber}
                      </td>
                      <td className="py-4 px-4 space-y-0.5">
                        <span className="font-semibold text-white block">{booking.customerName}</span>
                        <span className="text-[10px] text-slate-400 block">{booking.customerPhone}</span>
                      </td>
                      <td className="py-4 px-4 space-y-0.5">
                        <span className="font-semibold text-slate-200 block">{booking.eventType}</span>
                        <span className="text-[10px] text-amber-400 block">{eventDateStr}</span>
                      </td>
                      <td className="py-4 px-4 max-w-xs truncate text-slate-400">
                        {booking.location}
                      </td>
                      <td className="py-4 px-4 space-y-0.5">
                        <span className="font-semibold text-white block">₹{booking.amount.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-emerald-400 block">Paid: ₹{booking.paidAmount.toLocaleString('en-IN')}</span>
                      </td>
                      <td className="py-4 px-4 space-y-1">
                        <BookingStatusBadge status={booking.bookingStatus} />
                        <div className="block">
                          <PaymentStatusBadge status={booking.paymentStatus} />
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right space-x-1">
                        {booking.bookingStatus === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                              disabled={isUpdating}
                              title="Confirm Booking & Block Date"
                              className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-lg hover:bg-emerald-500/30 text-[11px] font-semibold transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                              disabled={isUpdating}
                              title="Reject Booking"
                              className="px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/40 rounded-lg hover:bg-red-500/30 text-[11px] font-semibold transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {booking.bookingStatus === 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'COMPLETED', 'PAID')}
                            disabled={isUpdating}
                            title="Mark Shoot Completed"
                            className="px-2.5 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-lg hover:bg-blue-500/30 text-[11px] font-semibold transition-colors"
                          >
                            Mark Completed
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedBooking(booking)}
                          title="View Details Modal"
                          className="px-2.5 py-1 bg-white/5 text-slate-300 border border-white/10 rounded-lg hover:bg-white/10 text-[11px] font-semibold transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12141D] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs text-slate-400 font-mono">Reference</span>
                <h3 className="text-2xl font-serif font-bold text-amber-300">
                  {selectedBooking.bookingNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 text-slate-400 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Customer Name</span>
                  <span className="font-bold text-white text-sm">{selectedBooking.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Phone Contact</span>
                  <span className="font-bold text-white">{selectedBooking.customerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Email Address</span>
                  <span className="font-bold text-white">{selectedBooking.customerEmail}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Event Type</span>
                  <span className="font-bold text-amber-400">{selectedBooking.eventType}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Date: {new Date(selectedBooking.eventDate).toLocaleDateString('en-IN')} ({selectedBooking.startTime} - {selectedBooking.endTime})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Venue: {selectedBooking.location}</span>
                </div>
                {selectedBooking.package && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>Package: {selectedBooking.package.name}</span>
                  </div>
                )}
              </div>

              {selectedBooking.additionalNotes && (
                <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="font-semibold text-slate-400 text-[10px] uppercase">Notes:</span>
                  <p className="text-slate-300">{selectedBooking.additionalNotes}</p>
                </div>
              )}
            </div>

            {/* Quick Status Action Panel */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookingStatusBadge status={selectedBooking.bookingStatus} />
                <PaymentStatusBadge status={selectedBooking.paymentStatus} />
              </div>

              <div className="flex items-center gap-2">
                {selectedBooking.bookingStatus !== 'CONFIRMED' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'CONFIRMED')}
                    className="px-3 py-2 bg-emerald-500 text-black text-xs font-bold rounded-xl shadow-md"
                  >
                    Confirm Booking
                  </button>
                )}
                {selectedBooking.bookingStatus !== 'CANCELLED' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'CANCELLED')}
                    className="px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-semibold rounded-xl"
                  >
                    Cancel
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
