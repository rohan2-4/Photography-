import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import BookingFormClient from '@/components/booking/BookingFormClient';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Sparkles } from 'lucide-react';

export const revalidate = 0;

export default async function BookPage() {
  const currentUser = await getCurrentUser();

  const packages = await prisma.package.findMany({
    where: { active: true },
    select: {
      id: true,
      name: true,
      eventType: true,
      price: true,
      discountedPrice: true,
      duration: true,
    },
    orderBy: { price: 'desc' },
  });

  const offers = await prisma.offer.findMany({
    where: { active: true },
    select: {
      id: true,
      code: true,
      title: true,
      discountPercent: true,
      discountAmount: true,
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-slate-100">
      <Navbar currentUser={currentUser} />
      <main className="flex-1 pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            ONLINE RESERVATION & CHECKOUT
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white">
            Book Your Photography Experience
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Reserve your date with Cinemayur in a few simple steps. Instant booking verification and secure deposit authorization.
          </p>
        </div>

        <BookingFormClient
          packages={packages}
          offers={offers}
          currentUser={currentUser}
        />
      </main>
      <Footer />
    </div>
  );
}
