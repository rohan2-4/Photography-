import Link from 'next/link';
import { Camera, Mail, Phone, MapPin, Instagram, Facebook, Youtube, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050608] border-t border-[#1E2232] pt-16 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1E2232]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-gradient p-0.5">
                <div className="w-full h-full bg-[#08090D] rounded-full flex items-center justify-center">
                  <Camera className="w-5 h-5 text-gold-400" />
                </div>
              </div>
              <span className="font-brand text-2xl font-bold tracking-widest text-white">
                CINEMAYUR
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Cinemayur — Capturing Your Moments, Creating Your Story. Premier photography studio crafting timeless cinematic memories for weddings, celebrations, and luxury events.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-surface-100 border border-surface-300 flex items-center justify-center text-slate-300 hover:text-gold-400 hover:border-gold-500/40 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-surface-100 border border-surface-300 flex items-center justify-center text-slate-300 hover:text-gold-400 hover:border-gold-500/40 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-surface-100 border border-surface-300 flex items-center justify-center text-slate-300 hover:text-gold-400 hover:border-gold-500/40 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase font-serif">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-gold-400 transition-colors">Home</Link></li>
              <li><Link href="/services" className="hover:text-gold-400 transition-colors">Services</Link></li>
              <li><Link href="/packages" className="hover:text-gold-400 transition-colors">Packages & Pricing</Link></li>
              <li><Link href="/portfolio" className="hover:text-gold-400 transition-colors">Portfolio Gallery</Link></li>
              <li><Link href="/offers" className="hover:text-gold-400 transition-colors">Special Offers</Link></li>
              <li><Link href="/availability" className="hover:text-gold-400 transition-colors">Check Availability</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase font-serif">Our Expertise</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/services#wedding" className="hover:text-gold-400 transition-colors">Wedding Photography</Link></li>
              <li><Link href="/services#pre-wedding" className="hover:text-gold-400 transition-colors">Pre-Wedding Shoots</Link></li>
              <li><Link href="/services#engagement" className="hover:text-gold-400 transition-colors">Engagement & Sangeet</Link></li>
              <li><Link href="/services#maternity" className="hover:text-gold-400 transition-colors">Maternity & Pregnancy</Link></li>
              <li><Link href="/services#baby" className="hover:text-gold-400 transition-colors">Newborn & Baby</Link></li>
              <li><Link href="/services#corporate" className="hover:text-gold-400 transition-colors">Corporate Summits</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase font-serif">Studio Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
                <span>104 Luxury Studio Avenue, Film City Road, Mumbai, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>contact@cinemayur.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Cinemayur Photography Studio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
