import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    slug: string;
    shortDesc: string;
    description: string;
    startingPrice: number;
    duration: string;
    coverImage: string;
    includedFeatures: string;
  };
}

export default function ServiceCard({ service }: ServiceCardProps) {
  let features: string[] = [];
  try {
    features = JSON.parse(service.includedFeatures);
  } catch {
    features = [service.includedFeatures];
  }

  return (
    <div className="group relative bg-[#12141D] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col h-full">
      {/* Cover Image */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={service.coverImage}
          alt={service.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12141D] via-[#12141D]/40 to-transparent"></div>
        
        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/30 text-xs font-semibold text-amber-300">
          From ₹{service.startingPrice.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-amber-400 font-medium">
            {service.duration}
          </div>
          <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
            {service.name}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {service.shortDesc}
          </p>
        </div>

        {/* Key Features */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          {features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{feature}</span>
            </div>
          ))}
          {features.length > 3 && (
            <div className="text-[11px] text-amber-400/80 font-medium pl-5">
              +{features.length - 3} more included services
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="pt-4 flex items-center justify-between gap-3">
          <Link
            href={`/packages?eventType=${encodeURIComponent(service.name)}`}
            className="flex-1 text-center py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-center gap-1.5"
          >
            <span>View Packages</span>
          </Link>
          <Link
            href={`/book?serviceId=${service.id}`}
            className="flex-1 text-center py-2.5 px-4 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-amber-300 to-amber-500 hover:brightness-110 shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
