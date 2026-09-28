'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Trash2, Eye, Star } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  isFeatured: boolean;
}

export default function PortfolioManagementClient({ initialItems }: { initialItems: PortfolioItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Weddings');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          imageUrl,
          isFeatured,
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
    if (!confirm('Delete this portfolio image?')) return;
    await fetch(`/api/admin/portfolio?id=${id}`, { method: 'DELETE' });
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
          Upload / Add Portfolio Image
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((img) => (
          <div key={img.id} className="glass-panel rounded-2xl overflow-hidden border border-[#262A3C] group relative h-64">
            <Image src={img.imageUrl} alt={img.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 border border-gold-500/30 text-gold-400 text-[10px] font-bold uppercase">
                  {img.category}
                </span>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="p-1.5 rounded-lg bg-rose-500/80 text-white hover:bg-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-white">{img.title}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddImage} className="glass-panel rounded-3xl p-8 border border-gold-500/40 max-w-md w-full space-y-4">
            <h3 className="text-2xl font-serif font-bold text-white">Add Portfolio Image</h3>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Image Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Royal Mandap Sacred Vows"
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-2.5 text-sm text-white"
              >
                <option value="Weddings">Weddings</option>
                <option value="Pre-Wedding">Pre-Wedding</option>
                <option value="Events">Events</option>
                <option value="Portraits">Portraits</option>
                <option value="Maternity">Maternity</option>
                <option value="Baby">Baby</option>
                <option value="Fashion">Fashion</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Image URL (Unsplash or Cloudinary)</label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-2.5 text-sm text-white"
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
                Add Image
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
