'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/ui/Lightbox';
import { Eye, Sparkles } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

interface HomeClientGalleryProps {
  portfolioImages: PortfolioItem[];
}

export default function HomeClientGallery({ portfolioImages }: HomeClientGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const categories = ['All', 'Weddings', 'Pre-Wedding', 'Events', 'Portraits', 'Maternity', 'Baby', 'Fashion'];

  const filteredImages = selectedCategory === 'All'
    ? portfolioImages
    : portfolioImages.filter((img) => img.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleOpenLightbox = (index: number) => {
    setActiveImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-10">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
              selectedCategory === cat
                ? 'bg-gold-gradient text-black font-bold shadow-gold-glow scale-105'
                : 'bg-surface-100/80 text-slate-300 hover:text-white border border-surface-300 hover:border-gold-500/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((img, idx) => (
          <div
            key={img.id}
            onClick={() => handleOpenLightbox(idx)}
            className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-[#262A3C] bg-surface-100 shadow-card-glow hover:border-gold-500/50 transition-all duration-500"
          >
            <Image
              src={img.imageUrl}
              alt={img.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

            {/* Hover Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-gold-gradient text-black flex items-center justify-center shadow-gold-glow scale-75 group-hover:scale-100 transition-transform duration-300">
                <Eye className="w-6 h-6" />
              </div>
            </div>

            {/* Card Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-[10px] tracking-widest text-gold-400 uppercase font-bold px-2.5 py-0.5 rounded-full bg-black/60 border border-gold-500/30 inline-block mb-1">
                {img.category}
              </span>
              <h4 className="text-lg font-serif font-semibold text-white group-hover:text-gold-300 transition-colors">
                {img.title}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Component */}
      <Lightbox
        images={filteredImages}
        currentIndex={activeImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIndex) => setActiveImageIndex(newIndex)}
      />
    </div>
  );
}
