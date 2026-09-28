import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    const session = await getSession();

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id: bookingId },
          { bookingNumber: bookingId },
        ],
      },
      include: {
        package: {
          include: {
            service: true,
          }
        },
        payments: {
          orderBy: { paidAt: 'desc' },
        },
        customer: {
          select: { id: true, name: true, email: true, phone: true }
        }
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Authorization check
    if (session?.role === 'CUSTOMER' && booking.customerId && booking.customerId !== session.userId) {
      return NextResponse.json({ error: 'Unauthorized access to booking' }, { status: 403 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Fetch booking detail error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve booking details' },
      { status: 500 }
    );
  }
}
