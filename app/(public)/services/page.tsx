import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db/prisma';
import { CheckCircle2, ArrowRight, Sparkles, Clock, Camera } from 'lucide-react';

export const revalidate = 0;

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    include: { packages: true },
  });

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          OUR EXPERTISE & OFFERINGS
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white">
          Photography Services
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          From grand royal wedding sagas to intimate fine-art portraits, explore our dedicated services crafted with passion and cinematic mastery.
        </p>
      </div>

      {/* Services List */}
      <div className="space-y-16">
        {services.map((service, idx) => {
          const features = JSON.parse(service.includedFeatures || '[]');
          const isEven = idx % 2 === 0;
          return (
            <div
              key={service.id}
              id={service.slug}
              className={`glass-panel rounded-3xl p-8 sm:p-12 border border-[#262A3C] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center scroll-mt-28`}
            >
              {/* Cover Image */}
              <div className={`lg:col-span-6 relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <Image
                  src={service.coverImage}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className={`lg:col-span-6 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold tracking-widest text-gold-400 uppercase">
                    SERVICE CATEGORY
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                    {service.name}
                  </h2>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {service.description}
                </p>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#262A3C]">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Coverage Duration</span>
                    <span className="text-base font-semibold text-white flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-4 h-4 text-gold-400" />
                      {service.duration}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Investment Starts From</span>
                    <span className="text-xl font-bold font-serif text-gold-400">
                      ₹{service.startingPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">What’s Included:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {features.map((feat: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/book?eventType=${encodeURIComponent(service.name)}`}
                    className="px-6 py-3 rounded-full bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Book {service.name}
                  </Link>
                  <Link
                    href="/packages"
                    className="px-6 py-3 rounded-full bg-surface-200 text-white hover:text-gold-300 text-xs font-semibold uppercase tracking-wider border border-surface-300 transition-colors"
                  >
                    View Packages
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
