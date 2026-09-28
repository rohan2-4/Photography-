'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Camera, 
  Calendar, 
  User, 
  Menu, 
  X, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  initialUser?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function Navbar({ initialUser }: NavbarProps) {
  const [user, setUser] = useState(initialUser || null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Fetch session if not passed initially
    if (initialUser === undefined) {
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => setUser(data.user))
        .catch(() => setUser(null));
    }
  }, [initialUser]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Packages', href: '/packages' },
    { name: 'Offers', href: '/offers' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Availability', href: '/availability' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08090D]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl shadow-black/80'
          : 'bg-gradient-to-b from-[#08090D]/90 via-[#08090D]/50 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1px] shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#08090D] rounded-[11px] flex items-center justify-center">
                <Camera className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-brand font-bold text-white tracking-wider group-hover:text-amber-300 transition-colors">
                CINEMAYUR
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-amber-400/80 font-medium">
                Luxury Photography
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs & Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/availability"
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-400 transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              Check Date
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'ADMIN' || user.role === 'PHOTOGRAPHER' ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl text-black bg-gradient-to-r from-amber-300 to-amber-500 hover:brightness-110 shadow-md shadow-amber-500/20 transition-all"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Studio
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all"
                  >
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    My Bookings
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 shadow-md shadow-amber-500/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0C12] border-b border-white/10 px-4 pt-4 pb-6 mt-3 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/availability"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30"
            >
              Check Availability
            </Link>

            {user ? (
              <div className="flex flex-col gap-2">
                {user.role === 'ADMIN' || user.role === 'PHOTOGRAPHER' ? (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-amber-300 to-amber-500"
                  >
                    Admin Studio Management
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800"
                  >
                    My Customer Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20"
                >
                  Sign Out ({user.name})
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-amber-300 to-amber-500"
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
