import { prisma } from '@/lib/db/prisma';
import AvailabilityChecker from '@/components/booking/AvailabilityChecker';
import { Calendar, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default async function AvailabilityPage() {
  const packages = await prisma.package.findMany({
    where: { active: true },
    select: { id: true, name: true, eventType: true, price: true },
  });

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          REAL-TIME STUDIO SCHEDULE
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white">
          Check Date Availability
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Verify whether our lead photography crew and equipment are available for your event date.
        </p>
      </div>

      <AvailabilityChecker packages={packages} />
    </div>
  );
}
