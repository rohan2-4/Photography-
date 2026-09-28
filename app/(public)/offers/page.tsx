import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { Sparkles, Percent, Tag, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function OffersPage() {
  const now = new Date();
  const offers = await prisma.offer.findMany({
    where: {
      active: true,
      endDate: { gte: now },
    },
    include: { package: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono font-bold uppercase tracking-widest">
          <Percent className="w-3.5 h-3.5 text-gold-400" />
          DATABASE DRIVEN PROMOTIONS
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white">
          Special Offers & Packages
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Exclusive discounts and promotional benefits for wedding seasons, early bookings, and corporate packages.
        </p>
      </div>

      {offers.length === 0 ? (
        <div className="text-center glass-panel rounded-3xl p-12 border border-[#262A3C] max-w-xl mx-auto space-y-4">
          <Tag className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-xl font-serif font-bold text-white">No Active Offers Right Now</h3>
          <p className="text-sm text-slate-400">
            Check back soon for upcoming seasonal promotional codes and package discounts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="glass-panel rounded-3xl p-8 border border-gold-500/30 hover:border-gold-500/60 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold font-mono border border-gold-500/40">
                    CODE: {offer.code}
                  </span>
                  {offer.discountPercent && (
                    <span className="text-2xl font-serif font-bold text-gold-400">
                      {offer.discountPercent}% OFF
                    </span>
                  )}
                  {offer.discountAmount && (
                    <span className="text-2xl font-serif font-bold text-gold-400">
                      ₹{offer.discountAmount.toLocaleString('en-IN')} OFF
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-serif font-bold text-white">
                  {offer.title}
                </h3>

                {offer.package && (
                  <div className="text-xs text-gold-300 bg-gold-500/10 px-3 py-1.5 rounded-lg border border-gold-500/20">
                    Applicable on: <span className="font-bold">{offer.package.name}</span>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-[#262A3C]">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Terms & Conditions:</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {offer.terms}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#262A3C] space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gold-400" />
                    Valid Until:
                  </span>
                  <span className="font-semibold text-slate-300">
                    {new Date(offer.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <Link
                  href={`/book?offerCode=${offer.code}`}
                  className="w-full py-3.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-gold-glow hover:scale-105 transition-all"
                >
                  Book with Offer Code
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
