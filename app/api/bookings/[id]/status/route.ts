import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

const VALID_BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED'];
const VALID_PAYMENT_STATUSES = ['UNPAID', 'PARTIAL', 'PAID', 'REFUNDED'];

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || (session.role !== 'ADMIN' && session.role !== 'PHOTOGRAPHER')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { bookingStatus, paymentStatus } = await request.json();

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (bookingStatus) {
      if (!VALID_BOOKING_STATUSES.includes(bookingStatus)) {
        return NextResponse.json({ error: 'Invalid booking status' }, { status: 400 });
      }
      updateData.bookingStatus = bookingStatus;
    }

    if (paymentStatus) {
      if (!VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
        return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
      }
      updateData.paymentStatus = paymentStatus;

      if (paymentStatus === 'PAID') {
        updateData.paidAmount = booking.amount;
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: updateData,
      include: {
        package: true,
        payments: true,
      },
    });

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: `Booking status updated to ${bookingStatus || updatedBooking.bookingStatus}`,
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
