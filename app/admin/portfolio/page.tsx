'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { upload } from '@vercel/blob/client';
import { Plus, Image as ImageIcon, Video as VideoIcon, Sparkles, Trash2, Loader2, X, Upload } from 'lucide-react';

interface PortfolioMediaItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  mediaType: string;
  videoUrl?: string | null;
  isFeatured: boolean;
  displayOrder: number;
}

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Weddings');
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState('0');

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      setItems(data.portfolio || []);
    } catch {
      console.error('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaFile(file);
    setIsUploading(true);

    try {
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const blob = await upload(`portfolio/${safeFileName}`, file, {
        access: 'public',
        handleUploadUrl: '/api/portfolio/upload',
        multipart: file.size > 5 * 1024 * 1024,
      });

      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi)$/i.test(file.name);
      setUploadedUrl(blob.url);
      setMediaType(isVideo ? 'VIDEO' : 'IMAGE');
      if (!title) {
        // Auto set title from filename without extension
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error uploading media file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedUrl) {
      alert('Please upload a photo or video file before saving.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          mediaType,
          imageUrl: mediaType === 'IMAGE' ? uploadedUrl : uploadedUrl,
          videoUrl: mediaType === 'VIDEO' ? uploadedUrl : null,
          isFeatured,
          displayOrder: parseInt(displayOrder) || 0,
        }),
      });

      if (!res.ok) throw new Error('Failed to add portfolio media');

      setModalOpen(false);
      resetForm();
      await fetchPortfolio();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error saving portfolio item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio media item?')) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');
      await fetchPortfolio();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting item');
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategory('Weddings');
    setMediaType('IMAGE');
    setMediaFile(null);
    setUploadedUrl('');
    setIsFeatured(false);
    setDisplayOrder('0');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Gallery & Cinema Curation
          </span>
          <h1 className="text-3xl font-serif font-bold text-white">
            Portfolio Media Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">Upload high-resolution photos and video clips directly to Mayur Gadade&apos;s portfolio.</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Photo or Video</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 bg-[#12141D] rounded-2xl border border-white/10">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 mt-2">Loading Portfolio Gallery...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-[#12141D] rounded-2xl border border-white/10 space-y-2">
          <h3 className="text-sm font-serif font-bold text-white">No Portfolio Media Found</h3>
          <p className="text-xs text-slate-400">Click button above to upload photos and video teasers to your portfolio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#12141D] border border-white/10 rounded-2xl overflow-hidden shadow-xl space-y-3 p-3 group relative"
            >
              <div className="relative h-48 w-full rounded-xl overflow-hidden bg-black/60">
                {item.mediaType === 'VIDEO' || item.videoUrl ? (
                  <video
                    src={item.videoUrl || item.imageUrl}
                    controls
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                )}

                {item.isFeatured && (
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-bold text-amber-300 flex items-center gap-1 border border-amber-500/30">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured</span>
                  </div>
                )}

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  title="Delete Portfolio Item"
                  className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-all shadow-md"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="px-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-amber-400 tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-[10px] uppercase font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                    {item.mediaType || (item.videoUrl ? 'VIDEO' : 'IMAGE')}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12141D] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-serif font-bold text-white">Upload Portfolio Media</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedia} className="space-y-4">
              
              {/* File Upload Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Choose Photo or Video File</label>
                
                <label className="border-2 border-dashed border-white/20 hover:border-amber-400/80 bg-slate-900/60 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all space-y-2 group">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform" />
                  
                  {isUploading ? (
                    <div className="flex items-center gap-2 text-xs text-amber-300">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading file to portfolio...</span>
                    </div>
                  ) : uploadedUrl ? (
                    <div className="text-center space-y-1">
                      <span className="text-xs font-semibold text-emerald-400 block">File Uploaded Successfully!</span>
                      <span className="text-[10px] text-slate-400 block font-mono truncate max-w-xs">{uploadedUrl}</span>
                    </div>
                  ) : (
                    <div className="text-center space-y-1">
                      <span className="text-xs font-medium text-slate-200 block">Click or Drag & Drop File to Upload</span>
                      <span className="text-[10px] text-slate-400 block">Supports JPG, PNG, WEBP, MP4, WEBM, MOV</span>
                    </div>
                  )}
                </label>
              </div>

              {/* Title & Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Royal Wedding Ceremony Highlights"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                  >
                    <option value="Weddings">Weddings</option>
                    <option value="Pre-Wedding">Pre-Wedding</option>
                    <option value="Events">Events</option>
                    <option value="Portraits">Portraits</option>
                    <option value="Maternity">Maternity</option>
                    <option value="Baby">Baby</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-white/20 text-amber-400 focus:ring-0"
                />
                <label htmlFor="featured" className="text-xs font-semibold text-slate-300">
                  Feature on Home Page Portfolio Showcase
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isUploading || !uploadedUrl}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : mediaType === 'VIDEO' ? (
                  <VideoIcon className="w-4 h-4" />
                ) : (
                  <ImageIcon className="w-4 h-4" />
                )}
                <span>Save to Portfolio</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
