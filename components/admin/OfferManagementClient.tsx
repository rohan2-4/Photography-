'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Tag, Trash2, Loader2 } from 'lucide-react';

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

export default function OfferManagementClient({ initialOffers }: { initialOffers: OfferItem[] }) {
  const router = useRouter();
  const [offers, setOffers] = useState(initialOffers);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number | undefined>(20);
  const [terms, setTerms] = useState('Valid on all wedding bookings.');
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          code,
          discountPercent,
          startDate: new Date().toISOString(),
          endDate: new Date(endDate).toISOString(),
          terms,
          active: true,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate this offer?')) return;
    await fetch(`/api/admin/offers?id=${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-gold-glow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Special Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="glass-panel rounded-3xl p-6 border border-gold-500/30 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 font-mono text-xs font-bold">
                  {offer.code}
                </span>
                <span className="text-xl font-serif font-bold text-gold-400">
                  {offer.discountPercent ? `${offer.discountPercent}% OFF` : `₹${offer.discountAmount} OFF`}
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-white">{offer.title}</h3>
              <p className="text-xs text-slate-400">{offer.terms}</p>
            </div>

            <div className="pt-4 border-t border-[#262A3C] flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Valid to: {new Date(offer.endDate).toLocaleDateString('en-IN')}</span>
              <button
                onClick={() => handleDelete(offer.id)}
                className="text-rose-400 hover:text-rose-300 text-xs font-bold"
              >
                Deactivate
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="glass-panel rounded-3xl p-8 border border-gold-500/40 max-w-md w-full space-y-4">
            <h3 className="text-2xl font-serif font-bold text-white">Create Promotional Offer</h3>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Offer Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Festival Wedding Discount"
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-300">Promo Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="FESTIVAL20"
                  className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-2.5 text-sm text-white uppercase font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-300">Discount %</label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Expiration Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Terms</label>
              <textarea
                rows={2}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl bg-surface-200 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gold-gradient text-black text-xs font-bold uppercase"
              >
                Create Offer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
