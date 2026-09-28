import Link from 'next/link';
import Image from 'next/image';
import { Camera, MapPin, Mail, Instagram, Sparkles, Award, Heart, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            About Cinemayur Studio
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white leading-tight">
            Capturing Your Moments, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
              Creating Your Story.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Welcome to <strong className="text-white">Cinemayur</strong>, founded and directed by lead photographer <strong className="text-amber-300">Mayur Gadade</strong>. Based in Murti, Baramati (Pune), Cinemayur brings timeless luxury, emotion, and royal cinematic flair to wedding photography, pre-wedding films, maternity sessions, and high-impact celebrations.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/portfolio"
              className="px-6 py-3 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Explore Portfolio</span>
            </Link>

            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        {/* Feature Image / Banner */}
        <div className="relative h-[420px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
            alt="Mayur Gadade Cinemayur Studio"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-8 flex flex-col justify-end">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Founder & Director
            </span>
            <h3 className="text-2xl font-serif font-bold text-white">Mayur Gadade</h3>
            <p className="text-xs text-slate-300 mt-1">Lead Cinematographer & Creative Director</p>
          </div>
        </div>
      </div>

      {/* Photography Philosophy */}
      <div className="bg-[#12141D] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Our Craft & Philosophy
          </span>
          <h2 className="text-3xl font-serif font-bold text-white">
            Why Choose Cinemayur?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every celebration is a personal saga. We blend traditional ritual aesthetics with modern 4K cinematic storytelling to capture unscripted joy and raw emotions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-black/30 border border-white/5 rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-serif font-bold text-white">4K Cinematic Mastery</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Equipped with high-end camera rigs, aerial drone photography, and prime portrait lenses to ensure crisp details in every frame.
            </p>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Heart className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-serif font-bold text-white">Authentic Storytelling</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We focus on genuine smiles, emotional rituals, and tender family moments rather than stiff poses.
            </p>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-serif font-bold text-white">Handcrafted Albums</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Custom velvet and leatherette flush-mount physical photo albums designed to stay vibrant for generations.
            </p>
          </div>
        </div>
      </div>

      {/* Studio Location & Contact Details */}
      <div className="bg-[#12141D] border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3">
          <h3 className="text-2xl font-serif font-bold text-white">
            Visit Mayur Gadade&apos;s Studio
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Murti, Taluka Baramati, District Pune, Maharashtra, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>gadademayur13@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-amber-400 shrink-0" />
              <a href="https://www.instagram.com/cinemayur_/" target="_blank" rel="noreferrer" className="text-amber-400 underline">
                @cinemayur_
              </a>
            </div>
          </div>
        </div>

        <Link
          href="/availability"
          className="px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all shrink-0"
        >
          Check Date Availability
        </Link>
      </div>

    </div>
  );
}
