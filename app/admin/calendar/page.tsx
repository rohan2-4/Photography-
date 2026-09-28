import { prisma } from '@/lib/db/prisma';
import CalendarView from '@/components/admin/CalendarView';

export const revalidate = 0;

export default async function AdminCalendarPage() {
  const bookings = await prisma.booking.findMany({
    select: {
      id: true,
      bookingNumber: true,
      customerName: true,
      eventDate: true,
      eventType: true,
      bookingStatus: true,
    },
    orderBy: { eventDate: 'asc' },
  });

  const blocks = await prisma.availabilityBlock.findMany({
    orderBy: { date: 'asc' },
  });

  const formattedBookings = bookings.map((b) => ({
    ...b,
    eventDate: b.eventDate.toISOString(),
  }));

  const formattedBlocks = blocks.map((b) => ({
    id: b.id,
    date: b.date.toISOString(),
    reason: b.reason,
  }));

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-mono font-bold tracking-widest text-gold-400 uppercase">
          AVAILABILITY & DATES
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
          Interactive Booking Calendar
        </h1>
      </div>

      <CalendarView bookings={formattedBookings} blocks={formattedBlocks} />
    </div>
  );
}
