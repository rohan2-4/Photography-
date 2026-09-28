import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  Camera, 
  LayoutDashboard, 
  CalendarDays, 
  BookOpen, 
  Package, 
  Tag, 
  Image as ImageIcon, 
  Users, 
  MessageSquare, 
  LogOut,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/session';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || (user.role !== 'ADMIN' && user.role !== 'PHOTOGRAPHER')) {
    redirect('/login');
  }

  const sidebarLinks = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Bookings Management', href: '/admin/bookings', icon: BookOpen },
    { name: 'Studio Calendar', href: '/admin/calendar', icon: CalendarDays },
    { name: 'Packages', href: '/admin/packages', icon: Package },
    { name: 'Special Offers', href: '/admin/offers', icon: Tag },
    { name: 'Portfolio Gallery', href: '/admin/portfolio', icon: ImageIcon },
    { name: 'Customer Directory', href: '/admin/customers', icon: Users },
    { name: 'Client Messages', href: '/admin/messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 flex flex-col md:flex-row selection:bg-amber-400 selection:text-black">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0D0F17] border-r border-white/10 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1px] shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-[#08090D] rounded-[11px] flex items-center justify-center">
                  <Camera className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="text-xl font-brand font-bold text-white tracking-wider">
                  CINEMAYUR
                </span>
                <span className="block text-[8px] uppercase tracking-[0.2em] text-amber-400 font-semibold">
                  Studio Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer Action */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2 bg-black/40 rounded-xl border border-white/5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="overflow-hidden text-xs">
              <span className="font-bold text-white block truncate">{user.name}</span>
              <span className="text-[10px] text-amber-400 block uppercase">{user.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 py-2 px-3 rounded-xl text-[11px] font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 text-center flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <form action="/api/auth/logout" method="POST" className="shrink-0">
              <button
                type="submit"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
