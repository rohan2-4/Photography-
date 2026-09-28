import Link from 'next/link';
import { Check, Star, Camera, Video, Sparkles, Clock } from 'lucide-react';

interface PackageCardProps {
  pkg: {
    id: string;
    name: string;
    slug: string;
    eventType: string;
    price: number;
    discountedPrice?: number | null;
    duration: string;
    photographers: number;
    editedPhotos: number;
    videoCoverage: boolean;
    albumIncluded: boolean;
    droneCoverage: boolean;
    preWeddingSession: boolean;
    features: string;
    isPopular: boolean;
  };
}

export default function PackageCard({ pkg }: PackageCardProps) {
  let featuresList: string[] = [];
  try {
    featuresList = JSON.parse(pkg.features);
  } catch {
    featuresList = [pkg.features];
  }

  const effectivePrice = pkg.discountedPrice || pkg.price;
  const savings = pkg.discountedPrice ? pkg.price - pkg.discountedPrice : 0;

  return (
    <div
      className={`relative bg-[#12141D] rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
        pkg.isPopular
          ? 'border-2 border-amber-400/80 shadow-2xl shadow-amber-500/20 bg-gradient-to-b from-[#1A1D2B] to-[#12141D] scale-[1.02]'
          : 'border border-white/10 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10'
      }`}
    >
      {/* Popular Ribbon Badge */}
      {pkg.isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-black text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-lg flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-black" />
          Most Popular Choice
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
            {pkg.eventType}
          </span>
          <h3 className="text-2xl font-serif font-bold text-white">
            {pkg.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{pkg.duration} Coverage</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="pt-2 border-t border-white/10">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-white">
              ₹{effectivePrice.toLocaleString('en-IN')}
            </span>
            {pkg.discountedPrice && (
              <span className="text-sm line-through text-slate-500">
                ₹{pkg.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {savings > 0 && (
            <div className="mt-1 text-xs text-emerald-400 font-medium">
              Save ₹{savings.toLocaleString('en-IN')} with current offer
            </div>
          )}
          <div className="text-[11px] text-slate-400 mt-1">
            * 30% advance deposit required to lock date
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-white/5 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>{pkg.photographers} Photographers</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{pkg.editedPhotos}+ Edited Photos</span>
          </div>
          {pkg.videoCoverage && (
            <div className="flex items-center gap-1.5 text-slate-300">
              <Video className="w-3.5 h-3.5 text-amber-400" />
              <span>4K Cinematic Film</span>
            </div>
          )}
          {pkg.droneCoverage && (
            <div className="flex items-center gap-1.5 text-amber-300 font-medium">
              <span>Drone Included</span>
            </div>
          )}
        </div>

        {/* Full Features List */}
        <div className="space-y-2.5">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Included in this package:
          </p>
          <ul className="space-y-2">
            {featuresList.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-tight">
                <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-amber-400" />
                </div>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-8 space-y-2">
        <Link
          href={`/book?packageId=${pkg.id}`}
          className={`w-full text-center py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            pkg.isPopular
              ? 'bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-black hover:brightness-110 shadow-lg shadow-amber-500/25'
              : 'bg-white/10 text-white hover:bg-amber-500 hover:text-black border border-white/10'
          }`}
        >
          Select & Book Package
        </Link>
        <Link
          href={`/availability?packageId=${pkg.id}`}
          className="block w-full text-center text-xs text-slate-400 hover:text-amber-400 transition-colors py-1"
        >
          Check Date Availability →
        </Link>
      </div>
    </div>
  );
}
