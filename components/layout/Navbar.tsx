'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, Calendar, Sparkles, Menu, X, User, ShieldAlert, LogOut } from 'lucide-react';

interface NavbarProps {
  currentUser?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function Navbar({ currentUser }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/packages', label: 'Packages' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/offers', label: 'Offers' },
    { href: '/availability', label: 'Check Date' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#08090D]/90 backdrop-blur-md border-b border-[#262A3C] py-3 shadow-2xl' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gold-gradient p-0.5 shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#08090D] rounded-full flex items-center justify-center">
                <Camera className="w-5 h-5 text-gold-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-brand text-2xl font-bold tracking-widest text-white group-hover:text-gold-300 transition-colors">
                CINEMAYUR
              </span>
              <span className="text-[10px] tracking-[0.25em] text-gold-500 uppercase font-medium">
                LUXURY PHOTOGRAPHY
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wider uppercase font-medium transition-colors duration-200 relative py-1 ${
                    isActive ? 'text-gold-400 font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-gradient rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTA & User Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {currentUser.role === 'ADMIN' || currentUser.role === 'PHOTOGRAPHER' ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold hover:bg-gold-500/20 transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-100 border border-surface-300 text-slate-200 text-xs font-semibold hover:border-gold-500/40 transition-colors"
                  >
                    <User className="w-4 h-4 text-gold-400" />
                    My Bookings
                  </Link>
                )}

                <a
                  href="/api/auth/logout"
                  className="text-slate-400 hover:text-rose-400 text-xs font-medium flex items-center gap-1 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-slate-300 hover:text-gold-300 text-xs uppercase font-medium tracking-wider px-3 py-1.5"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/book"
              className="relative group overflow-hidden rounded-full p-[1px] font-semibold text-xs tracking-wider uppercase"
            >
              <span className="absolute inset-0 bg-gold-gradient rounded-full"></span>
              <span className="relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#08090D] text-gold-300 group-hover:bg-transparent group-hover:text-black transition-all duration-300 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Book Now
              </span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              href="/book"
              className="px-3 py-1.5 rounded-full bg-gold-gradient text-black text-xs font-bold uppercase tracking-wider"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-surface-100 border border-surface-300 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#08090D]/95 backdrop-blur-xl border-b border-[#262A3C] px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium tracking-wider ${
                  pathname === link.href ? 'text-gold-400 font-bold' : 'text-slate-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-[#262A3C] flex flex-col gap-3">
            {currentUser ? (
              <>
                <div className="text-xs text-slate-400">Signed in as <span className="text-gold-300 font-semibold">{currentUser.email}</span></div>
                {currentUser.role === 'ADMIN' || currentUser.role === 'PHOTOGRAPHER' ? (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg bg-gold-500/20 text-gold-300 border border-gold-500/30 text-sm font-semibold"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg bg-surface-100 text-slate-200 border border-surface-300 text-sm font-semibold"
                  >
                    My Bookings
                  </Link>
                )}
                <a
                  href="/api/auth/logout"
                  className="w-full text-center py-2 text-rose-400 text-xs font-semibold"
                >
                  Logout
                </a>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-surface-100 text-slate-200 border border-surface-300 text-sm font-semibold"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
