import { prisma } from '@/lib/db/prisma';
import BookingManagementClient from '@/components/admin/BookingManagementClient';

export const revalidate = 0;

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { package: true },
    orderBy: { createdAt: 'desc' },
  });

  const formattedBookings = bookings.map((b) => ({
    id: b.id,
    bookingNumber: b.bookingNumber,
    customerName: b.customerName,
    customerEmail: b.customerEmail,
    customerPhone: b.customerPhone,
    eventType: b.eventType,
    eventDate: b.eventDate.toISOString(),
    startTime: b.startTime,
    endTime: b.endTime,
    location: b.location,
    amount: b.amount,
    paidAmount: b.paidAmount,
    bookingStatus: b.bookingStatus,
    paymentStatus: b.paymentStatus,
    packageName: b.package?.name,
    additionalNotes: b.additionalNotes,
  }));

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-mono font-bold tracking-widest text-gold-400 uppercase">
          RESERVATION MANAGEMENT
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
          Manage Customer Bookings
        </h1>
      </div>

      <BookingManagementClient initialBookings={formattedBookings} />
    </div>
  );
}
