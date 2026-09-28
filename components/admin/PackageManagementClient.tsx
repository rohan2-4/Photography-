'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, CheckCircle2, Loader2 } from 'lucide-react';

interface PackageItem {
  id: string;
  name: string;
  eventType: string;
  price: number;
  discountedPrice?: number | null;
  duration: string;
  photographers: number;
  editedPhotos: number;
  videoCoverage: boolean;
  albumIncluded: boolean;
  droneCoverage: boolean;
  isPopular: boolean;
  active: boolean;
}

export default function PackageManagementClient({ initialPackages }: { initialPackages: PackageItem[] }) {
  const router = useRouter();
  const [packages, setPackages] = useState(initialPackages);
  const [showModal, setShowModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PackageItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [eventType, setEventType] = useState('Wedding Photography');
  const [price, setPrice] = useState(50000);
  const [discountedPrice, setDiscountedPrice] = useState<number | undefined>(undefined);
  const [duration, setDuration] = useState('Full Day');
  const [photographers, setPhotographers] = useState(2);
  const [editedPhotos, setEditedPhotos] = useState(200);
  const [videoCoverage, setVideoCoverage] = useState(true);
  const [albumIncluded, setAlbumIncluded] = useState(true);
  const [droneCoverage, setDroneCoverage] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [loading, setLoading] = useState(false);

  const openCreateModal = () => {
    setEditingPkg(null);
    setName('');
    setEventType('Wedding Photography');
    setPrice(50000);
    setDuration('Full Day');
    setPhotographers(2);
    setEditedPhotos(200);
    setVideoCoverage(true);
    setAlbumIncluded(true);
    setDroneCoverage(false);
    setIsPopular(false);
    setShowModal(true);
  };

  const openEditModal = (pkg: PackageItem) => {
    setEditingPkg(pkg);
    setName(pkg.name);
    setEventType(pkg.eventType);
    setPrice(pkg.price);
    setDiscountedPrice(pkg.discountedPrice || undefined);
    setDuration(pkg.duration);
    setPhotographers(pkg.photographers);
    setEditedPhotos(pkg.editedPhotos);
    setVideoCoverage(pkg.videoCoverage);
    setAlbumIncluded(pkg.albumIncluded);
    setDroneCoverage(pkg.droneCoverage);
    setIsPopular(pkg.isPopular);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        eventType,
        price,
        discountedPrice: discountedPrice || null,
        duration,
        photographers,
        editedPhotos,
        videoCoverage,
        albumIncluded,
        droneCoverage,
        isPopular,
        features: JSON.stringify([
          `${duration} Coverage`,
          `${photographers} Senior Photographers`,
          `${editedPhotos} Edited Photos`,
          videoCoverage ? '4K Highlight Film' : 'Photo Only',
          albumIncluded ? 'Flush-mount Velvet Album' : 'Digital Gallery',
          droneCoverage ? 'Drone Aerial Shots' : '',
        ].filter(Boolean)),
      };

      const res = await fetch('/api/admin/packages', {
        method: editingPkg ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPkg ? { id: editingPkg.id, ...payload } : payload),
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
    if (!confirm('Are you sure you want to deactivate this package?')) return;
    await fetch(`/api/admin/packages?id=${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={openCreateModal}
          className="px-6 py-3 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-gold-glow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="glass-panel rounded-3xl p-6 border border-[#262A3C] flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest">{pkg.eventType}</span>
                {pkg.isPopular && (
                  <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-[10px] font-bold">POPULAR</span>
                )}
              </div>
              <h3 className="text-xl font-serif font-bold text-white">{pkg.name}</h3>
              <div className="text-2xl font-serif font-bold text-gold-400">
                ₹{pkg.price.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-[#262A3C]">
              <button
                onClick={() => openEditModal(pkg)}
                className="flex-1 py-2 rounded-xl bg-surface-100 hover:bg-gold-500 hover:text-black text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(pkg.id)}
                className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-white text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="glass-panel rounded-3xl p-8 border border-gold-500/40 max-w-xl w-full space-y-4">
            <h3 className="text-2xl font-serif font-bold text-white">
              {editingPkg ? 'Edit Package' : 'Create Package'}
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Package Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-300">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-2.5 text-sm text-white"
                >
                  <option value="Wedding Photography">Wedding Photography</option>
                  <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                  <option value="Engagement">Engagement & Sangeet</option>
                  <option value="Maternity">Maternity & Pregnancy</option>
                  <option value="Corporate Events">Corporate Events</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-300">Price (INR)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={videoCoverage}
                  onChange={(e) => setVideoCoverage(e.target.checked)}
                  className="accent-gold-500"
                />
                4K Video Coverage
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={albumIncluded}
                  onChange={(e) => setAlbumIncluded(e.target.checked)}
                  className="accent-gold-500"
                />
                Album Included
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="accent-gold-500"
                />
                Mark Popular
              </label>
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
                Save Package
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
