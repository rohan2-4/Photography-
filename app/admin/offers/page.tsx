'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Calendar, Loader2, X, CheckCircle2, Trash2, Power } from 'lucide-react';

interface OfferItem {
  id: string;
  title: string;
  code: string;
  discountPercent?: number | null;
  discountAmount?: number | null;
  startDate: string;
  endDate: string;
  terms: string;
  active: boolean;
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form inputs
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [terms, setTerms] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/offers?all=true');
      const data = await res.json();
      setOffers(data.offers || []);
    } catch {
      console.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          code,
          discountPercent: discountPercent ? parseFloat(discountPercent) : null,
          discountAmount: discountAmount ? parseFloat(discountAmount) : null,
          startDate,
          endDate,
          terms,
        }),
      });

      if (!res.ok) throw new Error('Failed to create offer');

      setModalOpen(false);
      setTitle('');
      setCode('');
      setDiscountPercent('');
      setDiscountAmount('');
      setTerms('');
      await fetchOffers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error creating offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/offers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus }),
      });

      if (!res.ok) throw new Error('Failed to update offer status');
      await fetchOffers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error updating status');
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete offer');
      await fetchOffers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting offer');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Admin Promotional Engine
          </span>
          <h1 className="text-3xl font-serif font-bold text-white">
            Special Offers & Coupon Codes
          </h1>
          <p className="text-xs text-slate-400 mt-1">Create, activate, or remove promotional discounts displayed on Mayur Gadade&apos;s portfolio.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* Offers List */}
      {loading ? (
        <div className="text-center py-20 bg-[#12141D] rounded-2xl border border-white/10">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 mt-2">Loading Promotional Offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-20 bg-[#12141D] rounded-2xl border border-white/10 space-y-2">
          <h3 className="text-sm font-serif font-bold text-white">No Offers Created</h3>
          <p className="text-xs text-slate-400">Click button above to add promotional codes for wedding season.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => {
            const isExpired = new Date(offer.endDate) < new Date();

            return (
              <div
                key={offer.id}
                className={`bg-[#12141D] border rounded-2xl p-6 space-y-4 relative shadow-xl transition-all ${
                  offer.active && !isExpired
                    ? 'border-amber-500/40'
                    : 'border-white/10 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20">
                    CODE: {offer.code}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(offer.id, offer.active)}
                      className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                        offer.active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{offer.active ? 'Active' : 'Inactive'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Offer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-bold text-white">{offer.title}</h3>
                  <div className="text-sm font-bold text-amber-300">
                    {offer.discountPercent
                      ? `${offer.discountPercent}% OFF`
                      : offer.discountAmount
                      ? `₹${offer.discountAmount.toLocaleString('en-IN')} OFF`
                      : 'Discount Applied'}
                  </div>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Valid: {new Date(offer.startDate).toLocaleDateString('en-IN')} – {new Date(offer.endDate).toLocaleDateString('en-IN')}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 bg-black/30 p-3 rounded-lg border border-white/5">
                  <span className="font-semibold text-slate-300">Terms: </span>
                  {offer.terms}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12141D] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-serif font-bold text-white">Create Admin Offer</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Offer Title</label>
                <input
                  type="text"
                  required
                  placeholder="Baramati Wedding Season Special"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Promo Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="MAYUR20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-amber-400 font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Discount Percent (%)</label>
                  <input
                    type="number"
                    placeholder="20"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Or Flat Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white [color-scheme:dark]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">End Date (Expiry)</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Terms & Conditions</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Valid on Royal Heritage Wedding package bookings made directly through Mayur Gadade."
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
                <span>Activate Special Offer</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
