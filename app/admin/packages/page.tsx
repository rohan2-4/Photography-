'use client';

import { useState, useEffect } from 'react';
import { Plus, Package as PackageIcon, Check, Trash2, Edit, Loader2, X, Star } from 'lucide-react';

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
}

interface PackageItem {
  id: string;
  serviceId?: string | null;
  service?: ServiceCategory | null;
  name: string;
  eventType: string;
  price: number;
  discountedPrice?: number | null;
  duration: string;
  photographers: number;
  editedPhotos: number;
  features: string;
  isPopular: boolean;
  active: boolean;
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('All');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form inputs
  const [name, setName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [duration, setDuration] = useState('Full Day (8 Hours)');
  const [photographers, setPhotographers] = useState('2');
  const [editedPhotos, setEditedPhotos] = useState('300');
  const [featuresText, setFeaturesText] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchServicesAndPackages();
  }, []);

  const fetchServicesAndPackages = async () => {
    setLoading(true);
    try {
      const [servicesRes, packagesRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/packages?all=true'),
      ]);
      const servicesData = await servicesRes.json();
      const packagesData = await packagesRes.json();

      const fetchedServices = servicesData.services || [];
      setServices(fetchedServices);
      if (fetchedServices.length > 0 && !selectedServiceId) {
        setSelectedServiceId(fetchedServices[0].id);
      }

      setPackages(packagesData.packages || []);
    } catch {
      console.error('Failed to load services and packages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId) {
      alert('Please select a Shoot Category for this package.');
      return;
    }

    setIsSubmitting(true);

    const chosenService = services.find((s) => s.id === selectedServiceId);
    const eventType = chosenService ? chosenService.name : 'Shoot';

    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          serviceId: selectedServiceId,
          eventType,
          price: parseFloat(price),
          discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
          duration,
          photographers: parseInt(photographers),
          editedPhotos: parseInt(editedPhotos),
          features,
          isPopular,
        }),
      });

      if (!res.ok) throw new Error('Failed to create package');

      setModalOpen(false);
      setName('');
      setPrice('');
      setDiscountedPrice('');
      setFeaturesText('');
      await fetchServicesAndPackages();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error creating package');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPackages = selectedCategorySlug === 'All'
    ? packages
    : packages.filter((p) => p.service?.slug === selectedCategorySlug || p.serviceId === selectedCategorySlug);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Category Package Management
          </span>
          <h1 className="text-3xl font-serif font-bold text-white">
            Shoot Category Packages
          </h1>
          <p className="text-xs text-slate-400 mt-1">Assign customized photography & cinematography packages to specific Cinemayur shoot categories.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Package</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setSelectedCategorySlug('All')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selectedCategorySlug === 'All'
              ? 'bg-amber-400 text-black'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          All Shoots ({packages.length})
        </button>

        {services.map((srv) => {
          const count = packages.filter((p) => p.serviceId === srv.id || p.service?.slug === srv.slug).length;
          const isActive = selectedCategorySlug === srv.slug;

          return (
            <button
              key={srv.id}
              onClick={() => setSelectedCategorySlug(srv.slug)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-amber-400 text-black'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {srv.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div className="text-center py-20 bg-[#12141D] rounded-2xl border border-white/10">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 mt-2">Loading Category Packages...</p>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="text-center py-20 bg-[#12141D] rounded-2xl border border-white/10 space-y-2">
          <h3 className="text-sm font-serif font-bold text-white">No Packages in this Category</h3>
          <p className="text-xs text-slate-400">Click button above to add a package for this shoot category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            let featuresList: string[] = [];
            try {
              featuresList = JSON.parse(pkg.features);
            } catch {
              featuresList = [pkg.features];
            }

            return (
              <div
                key={pkg.id}
                className="bg-[#12141D] border border-white/10 rounded-2xl p-6 space-y-4 relative flex flex-col justify-between"
              >
                {pkg.isPopular && (
                  <div className="absolute top-4 right-4 bg-amber-400 text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-black" />
                    Popular Choice
                  </div>
                )}

                <div className="space-y-3">
                  <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-widest block font-mono">
                    {pkg.service?.name || pkg.eventType}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white">{pkg.name}</h3>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-serif font-bold text-amber-300">
                      ₹{(pkg.discountedPrice || pkg.price).toLocaleString('en-IN')}
                    </span>
                    {pkg.discountedPrice && (
                      <span className="text-xs text-slate-500 line-through">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400">Duration: {pkg.duration}</p>

                  <div className="space-y-1 pt-2 border-t border-white/5">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Included Features:</span>
                    {featuresList.slice(0, 4).map((f, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold">Active Package</span>
                </div>
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
              <h3 className="text-xl font-serif font-bold text-white">Create Category Package</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-4">
              
              {/* Service/Category Selection */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Target Shoot Category</label>
                <select
                  required
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                >
                  {services.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Package Title</label>
                <input
                  type="text"
                  required
                  placeholder="Premium Pre-Wedding Cinematic"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Day (8 Hours)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="35000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Features List (One feature per line)</label>
                <textarea
                  rows={4}
                  required
                  placeholder="2 Senior Photographers&#10;4K Cinematic Reel&#10;Aerial Drone Footage&#10;50 Retouched Fine Art Portraits"
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-sans resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="popular"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-white/20 text-amber-400 focus:ring-0"
                />
                <label htmlFor="popular" className="text-xs font-semibold text-slate-300">
                  Highlight as Popular Choice
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>Save Package to Category</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
