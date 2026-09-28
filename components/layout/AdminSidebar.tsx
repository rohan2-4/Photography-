'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  Package,
  Sparkles,
  Image as ImageIcon,
  Users,
  Home,
  LogOut,
  Camera
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
    { href: '/admin/calendar', label: 'Calendar', icon: CalendarDays },
    { href: '/admin/packages', label: 'Packages', icon: Package },
    { href: '/admin/offers', label: 'Special Offers', icon: Sparkles },
    { href: '/admin/portfolio', label: 'Portfolio', icon: ImageIcon },
    { href: '/admin/customers', label: 'Customers', icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#08090D] border-r border-[#262A3C] min-h-screen flex flex-col justify-between shrink-0 sticky top-0 h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#262A3C] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold-gradient p-0.5 shadow-gold-glow">
            <div className="w-full h-full bg-[#08090D] rounded-full flex items-center justify-center">
              <Camera className="w-4 h-4 text-gold-400" />
            </div>
          </div>
          <div>
            <h2 className="font-brand text-lg font-bold text-white tracking-wider">CINEMAYUR</h2>
            <span className="text-[9px] tracking-widest text-gold-500 uppercase font-semibold">ADMIN PORTAL</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gold-500/10 border border-gold-500/30 text-gold-300 font-semibold shadow-gold-glow'
                    : 'text-slate-400 hover:text-white hover:bg-surface-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-gold-400' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-[#262A3C] space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-surface-100 transition-colors"
        >
          <Home className="w-4 h-4" />
          View Public Site
        </Link>
        <a
          href="/api/auth/logout"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </a>
      </div>
    </aside>
  );
}
