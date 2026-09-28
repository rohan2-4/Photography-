'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Tag } from 'lucide-react';

interface LightboxProps {
  images: {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
  }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold flex items-center gap-1.5 border border-gold-500/30">
            <Tag className="w-3.5 h-3.5" />
            {currentImage.category}
          </span>
          <span className="text-slate-400 text-xs font-mono">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-surface-100/80 hover:bg-gold-500 text-slate-300 hover:text-black transition-all border border-surface-300"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden group">
        <div className="relative w-full h-full max-w-5xl max-h-[75vh]">
          <Image
            src={currentImage.imageUrl}
            alt={currentImage.title}
            fill
            className="object-contain rounded-lg shadow-2xl"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
          />
        </div>

        {/* Previous Button */}
        <button
          onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
          className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/60 hover:bg-gold-500 text-white hover:text-black border border-white/10 transition-all backdrop-blur-md"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={() => onNavigate((currentIndex + 1) % images.length)}
          className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/60 hover:bg-gold-500 text-white hover:text-black border border-white/10 transition-all backdrop-blur-md"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Footer Title */}
      <div className="text-center z-10 pb-2">
        <h3 className="text-xl sm:text-2xl font-serif font-semibold text-white tracking-wide">
          {currentImage.title}
        </h3>
        <p className="text-xs text-gold-400/80 tracking-widest uppercase mt-1">Cinemayur Studio Collection</p>
      </div>
    </div>
  );
}
