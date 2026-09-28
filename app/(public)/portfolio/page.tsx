import { prisma } from '@/lib/db/prisma';
import HomeClientGallery from '@/components/public/HomeClientGallery';
import { Camera, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default async function PortfolioPage() {
  const portfolioImages = await prisma.portfolioImage.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          FINE ART GALLERY
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white">
          Portfolio Gallery
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Explore our collection of captured moments, sacred rituals, romantic couple sessions, and executive events. Click any image to view in high-resolution lightbox.
        </p>
      </div>

      {/* Interactive Gallery */}
      <HomeClientGallery portfolioImages={portfolioImages} />
    </div>
  );
}
