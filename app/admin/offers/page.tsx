import { prisma } from '@/lib/db/prisma';
import OfferManagementClient from '@/components/admin/OfferManagementClient';

export const revalidate = 0;

export default async function AdminOffersPage() {
  const offers = await prisma.offer.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const formattedOffers = offers.map((o) => ({
    id: o.id,
    title: o.title,
    code: o.code,
    discountPercent: o.discountPercent,
    discountAmount: o.discountAmount,
    startDate: o.startDate.toISOString(),
    endDate: o.endDate.toISOString(),
    terms: o.terms,
    active: o.active,
  }));

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-mono font-bold tracking-widest text-gold-400 uppercase">
          PROMOTIONS MANAGEMENT
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
          Manage Special Offers & Promo Codes
        </h1>
      </div>

      <OfferManagementClient initialOffers={formattedOffers} />
    </div>
  );
}
