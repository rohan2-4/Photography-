import Link from 'next/link';
import { Camera, MapPin, Phone, Mail, Instagram, Facebook, Youtube, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050608] text-slate-400 border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent blur-xs"></div>
      <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1px] shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-[#08090D] rounded-[11px] flex items-center justify-center">
                  <Camera className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-brand font-bold text-white tracking-wider">
                  CINEMAYUR
                </span>
                <span className="block text-[9px] uppercase tracking-[0.25em] text-amber-400/80 font-medium">
                  Luxury Photography
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Capturing Your Moments, Creating Your Story. Owned & directed by Mayur Gadade, Cinemayur provides high-end cinematic wedding photography, pre-wedding films, maternity portraits, and corporate event documentation.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/cinemayur_?stkn=a20wbGNlZ2kzMndi"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase font-serif">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-amber-400 transition-colors">Services</Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-amber-400 transition-colors">Packages</Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-amber-400 transition-colors">Special Offers</Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-amber-400 transition-colors">Portfolio Gallery</Link>
              </li>
              <li>
                <Link href="/availability" className="hover:text-amber-400 transition-colors">Check Availability</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase font-serif">
              Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services" className="hover:text-amber-400 transition-colors">Wedding Photography</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-amber-400 transition-colors">Pre-Wedding Shoots</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-amber-400 transition-colors">Engagement & Sangeet</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-amber-400 transition-colors">Maternity & Pregnancy</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-amber-400 transition-colors">Baby & Milestone</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-amber-400 transition-colors">Corporate Galas</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase font-serif">
              Studio Contact
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Cinemayur Studio, Murti, Tal. Baramati, Dist. PUNE</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 7387209509</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>gadademayur13@gmail.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Cinemayur Photography. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-slate-300">Terms of Service</Link>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for timeless memories
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
