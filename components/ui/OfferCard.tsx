import Link from 'next/link';
import { Tag, Calendar, ShieldAlert, ArrowRight, Copy } from 'lucide-react';

interface OfferCardProps {
  offer: {
    id: string;
    title: string;
    code: string;
    discountPercent?: number | null;
    discountAmount?: number | null;
    startDate: string | Date;
    endDate: string | Date;
    terms: string;
    package?: {
      id: string;
      name: string;
    } | null;
  };
}

export default function OfferCard({ offer }: OfferCardProps) {
  const expiryDate = new Date(offer.endDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const discountText = offer.discountPercent
    ? `${offer.discountPercent}% OFF`
    : offer.discountAmount
    ? `₹${offer.discountAmount.toLocaleString('en-IN')} OFF`
    : 'SPECIAL DISCOUNT';

  return (
    <div className="relative bg-[#12141D] border border-amber-500/30 rounded-2xl p-6 sm:p-8 overflow-hidden hover:border-amber-400 transition-all duration-300 shadow-xl group">
      {/* Decorative Gold Badge */}
      <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-amber-600 text-black font-bold text-xs px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1 shadow-md">
        <Tag className="w-3.5 h-3.5" />
        {discountText}
      </div>

      <div className="space-y-4 max-w-xl">
        <div className="space-y-1 pt-2">
          <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
            Limited Time Promotion
          </span>
          <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
            {offer.title}
          </h3>
        </div>

        {/* Promo Code Box */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl max-w-xs">
          <div className="text-xs text-slate-400 font-medium">Use Code:</div>
          <div className="font-mono text-sm font-bold text-amber-400 tracking-wider">
            {offer.code}
          </div>
        </div>

        {/* Target Package & Expiry */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
          {offer.package && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Applicable on:</span>
              <span className="text-slate-200 font-medium">{offer.package.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Valid until {expiryDate}</span>
          </div>
        </div>

        {/* Terms & Conditions */}
        <p className="text-[11px] text-slate-400 leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5">
          <span className="font-semibold text-slate-300">Terms: </span>
          {offer.terms}
        </p>

        {/* CTA */}
        <div className="pt-2">
          <Link
            href={offer.package ? `/book?packageId=${offer.package.id}&offerCode=${offer.code}` : `/book?offerCode=${offer.code}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-black bg-gradient-to-r from-amber-300 to-amber-500 hover:brightness-110 px-5 py-2.5 rounded-xl shadow-md shadow-amber-500/20 transition-all"
          >
            <span>Claim Offer & Book</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
