import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { CheckCircle2, Sparkles, Camera, Film, Award, Plane, BookOpen } from 'lucide-react';

export const revalidate = 0;

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({
    where: { active: true },
    orderBy: { price: 'desc' },
  });

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          TRANSPARENT LUXURY PACKAGES
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white">
          Photography Packages & Pricing
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Select the ideal coverage for your special occasion. Every package includes fine-art color grading, high-resolution digital deliverables, and guaranteed timeline execution.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg) => {
          const features = JSON.parse(pkg.features || '[]');
          return (
            <div
              key={pkg.id}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                pkg.isPopular
                  ? 'bg-gradient-to-b from-[#1E2235] via-[#141724] to-[#0D0F18] border-2 border-gold-500 shadow-gold-glow scale-105'
                  : 'glass-panel border border-[#262A3C] hover:border-gold-500/40'
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold-gradient text-black font-bold text-xs uppercase tracking-widest shadow-md">
                  MOST POPULAR PACKAGE
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                    {pkg.eventType}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white mt-1">
                    {pkg.name}
                  </h3>
                </div>

                <div className="space-y-1">
                  {pkg.discountedPrice ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-serif font-bold text-white">
                        ₹{pkg.discountedPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-base text-slate-500 line-through">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ) : (
                    <span className="text-4xl font-serif font-bold text-white">
                      ₹{pkg.price.toLocaleString('en-IN')}
                    </span>
                  )}
                  <div className="text-xs text-slate-400">Duration: {pkg.duration}</div>
                </div>

                {/* Quick Spec Badges */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#262A3C]">
                  <span className="px-2.5 py-1 rounded-md bg-surface-200 text-[11px] text-slate-300 flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-gold-400" />
                    {pkg.photographers} Photographers
                  </span>
                  {pkg.videoCoverage && (
                    <span className="px-2.5 py-1 rounded-md bg-surface-200 text-[11px] text-slate-300 flex items-center gap-1">
                      <Film className="w-3.5 h-3.5 text-gold-400" />
                      4K Video
                    </span>
                  )}
                  {pkg.albumIncluded && (
                    <span className="px-2.5 py-1 rounded-md bg-surface-200 text-[11px] text-slate-300 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-gold-400" />
                      Luxury Album
                    </span>
                  )}
                  {pkg.droneCoverage && (
                    <span className="px-2.5 py-1 rounded-md bg-surface-200 text-[11px] text-slate-300 flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5 text-gold-400" />
                      Drone Shots
                    </span>
                  )}
                </div>

                {/* Feature list */}
                <ul className="space-y-3 pt-4 border-t border-[#262A3C]">
                  {features.map((feat: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href={`/book?packageId=${pkg.id}`}
                  className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all ${
                    pkg.isPopular
                      ? 'bg-gold-gradient text-black shadow-gold-glow hover:scale-105'
                      : 'bg-surface-200 text-white hover:bg-gold-500 hover:text-black'
                  }`}
                >
                  Book Package Now
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
