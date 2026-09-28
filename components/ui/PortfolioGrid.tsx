'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Eye, Expand, Sparkles, Play } from 'lucide-react';
import PortfolioLightbox from './PortfolioLightbox';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  mediaType?: string;
  videoUrl?: string | null;
  width?: number;
  height?: number;
  isFeatured?: boolean;
}

interface PortfolioGridProps {
  items: PortfolioItem[];
  categories?: string[];
  initialCategory?: string;
}

export default function PortfolioGrid({ items, categories, initialCategory = 'All' }: PortfolioGridProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const defaultCategories = ['All', 'Weddings', 'Pre-Wedding', 'Events', 'Portraits', 'Maternity', 'Baby', 'Fashion'];
  const categoryList = categories || defaultCategories;

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter((item) => {
        const catItem = item.category.toLowerCase().trim();
        const catSel = selectedCategory.toLowerCase().trim();
        return catItem === catSel || catItem.includes(catSel) || catSel.includes(catItem);
      });

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categoryList.map((cat) => {
          const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 text-slate-300 border border-white/10 hover:border-amber-500/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid Gallery */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-[#12141D] rounded-2xl border border-white/10">
          <p className="text-slate-400 text-sm">No portfolio items found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => {
            const isVideo = item.mediaType === 'VIDEO' || Boolean(item.videoUrl) || item.imageUrl.endsWith('.mp4');

            return (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(index)}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-amber-400/80 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 bg-black/80"
              >
                {isVideo ? (
                  <div className="relative w-full h-full">
                    <video
                      src={item.videoUrl || item.imageUrl}
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-amber-400/90 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-black ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                )}
                
                {/* Dark Overlay with Title */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                  <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
                    {item.category} {isVideo ? '• Video Film' : ''}
                  </span>
                  <h4 className="text-base font-serif font-bold text-white leading-tight">
                    {item.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-300 font-medium">
                    <Expand className="w-3.5 h-3.5" />
                    <span>{isVideo ? 'Play Video' : 'View Fullscreen'}</span>
                  </div>
                </div>

                {/* Featured Badge */}
                {item.isFeatured && (
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md p-1.5 rounded-full border border-amber-500/40 text-amber-300 z-10">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Viewer */}
      {lightboxIndex !== null && (
        <PortfolioLightbox
          items={filteredItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}
    </div>
  );
}
