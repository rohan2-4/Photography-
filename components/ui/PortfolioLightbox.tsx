'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Camera, Video } from 'lucide-react';
import { PortfolioItem } from './PortfolioGrid';

interface LightboxProps {
  items: PortfolioItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function PortfolioLightbox({
  items,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const currentItem = items[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items.length]);

  if (!currentItem) return null;

  const isVideo = currentItem.mediaType === 'VIDEO' || Boolean(currentItem.videoUrl) || currentItem.imageUrl.endsWith('.mp4');

  const handlePrev = () => {
    const prev = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    onNavigate(prev);
  };

  const handleNext = () => {
    const next = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    onNavigate(next);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="p-4 sm:p-6 flex items-center justify-between z-10 border-b border-white/10 bg-black/50">
        <div className="flex items-center gap-3">
          {isVideo ? <Video className="w-5 h-5 text-amber-400" /> : <Camera className="w-5 h-5 text-amber-400" />}
          <div>
            <h3 className="text-sm font-serif font-bold text-white">
              {currentItem.title}
            </h3>
            <span className="text-[10px] uppercase tracking-widest text-amber-400">
              {currentItem.category} • {currentIndex + 1} of {items.length} {isVideo ? '• Video Film' : ''}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Container */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 sm:left-8 z-20 p-3 text-white bg-black/50 border border-white/20 hover:bg-amber-500 hover:text-black hover:border-amber-400 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="relative w-full h-full max-w-5xl max-h-[80vh] flex items-center justify-center">
          {isVideo ? (
            <video
              src={currentItem.videoUrl || currentItem.imageUrl}
              controls
              autoPlay
              className="max-w-full max-h-[80vh] rounded-2xl border border-white/10 shadow-2xl"
            />
          ) : (
            <Image
              src={currentItem.imageUrl}
              alt={currentItem.title}
              fill
              className="object-contain"
              priority
            />
          )}
        </div>

        <button
          onClick={handleNext}
          className="absolute right-4 sm:right-8 z-20 p-3 text-white bg-black/50 border border-white/20 hover:bg-amber-500 hover:text-black hover:border-amber-400 rounded-full transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Bar Info */}
      <div className="p-4 bg-black/80 border-t border-white/10 text-center">
        <p className="text-xs text-slate-400 font-serif italic">
          Cinemayur Studio Collection — Directed & Captured by Mayur Gadade.
        </p>
      </div>
    </div>
  );
}
