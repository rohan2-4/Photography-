import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';
import { checkDateAvailability } from '@/lib/booking/availability';
import { processPayment } from '@/lib/payments/mockPayment';

export const dynamic = 'force-dynamic';


export async function GET(request: Request) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let whereClause: Record<string, unknown> = {};

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Customer only sees their own bookings; ADMIN/PHOTOGRAPHER sees all
    if (session.role === 'CUSTOMER') {
      whereClause.customerId = session.userId;
    }

    if (status) {
      whereClause.bookingStatus = status;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        package: true,
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getSession();

    const {
      customerName,
      customerEmail,
      customerPhone,
      eventType,
      serviceId,
      eventDate,
      startTime = '09:00',
      endTime = '18:00',
      isFullDay = false,
      location,
      city,
      packageId,
      categoryDetails,
      additionalNotes,
    } = body;

    // 1. Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !eventType || !eventDate || !location || !packageId) {
      return NextResponse.json(
        { error: 'All mandatory booking fields are required.' },
        { status: 400 }
      );
    }

    const parsedDate = new Date(eventDate);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid event date' }, { status: 400 });
    }

    // Wrap conflict check and booking creation in a transaction for zero double-bookings
    const result = await prisma.$transaction(async (tx) => {
      // 2. Strict Transactional Availability Check
      const availability = await checkDateAvailability(
        parsedDate,
        isFullDay ? '00:00' : startTime,
        isFullDay ? '23:59' : endTime,
        Boolean(isFullDay)
      );

      if (availability.status === 'BOOKED') {
        throw new Error('BOOKING_CONFLICT: This date or time slot is already booked by another customer.');
      }

      // 3. Retrieve package pricing
      const pkg = await tx.package.findUnique({
        where: { id: packageId },
      });

      if (!pkg) {
        throw new Error('PACKAGE_NOT_FOUND: Selected package does not exist.');
      }

      const packagePrice = pkg.discountedPrice || pkg.price;
      const depositAmount = Math.round(packagePrice * 0.3);

      // 4. Generate unique booking number CIN-YYYY-XXXX
      const count = await tx.booking.count();
      const year = new Date().getFullYear();
      const bookingNumber = `CIN-${year}-${String(count + 1).padStart(4, '0')}`;

      // 5. Save Booking Request directly
      const newBooking = await tx.booking.create({
        data: {
          bookingNumber,
          customerId: session?.userId || null,
          customerName,
          customerEmail: customerEmail.toLowerCase().trim(),
          customerPhone,
          serviceId: serviceId || pkg.serviceId || null,
          eventType,
          eventDate: parsedDate,
          startTime: isFullDay ? '06:00' : startTime,
          endTime: isFullDay ? '23:59' : endTime,
          isFullDay: Boolean(isFullDay),
          location,
          city: city || null,
          packageId,
          categoryDetails: typeof categoryDetails === 'object' ? JSON.stringify(categoryDetails) : (categoryDetails || null),
          additionalNotes: additionalNotes || null,
          amount: packagePrice,
          depositAmount,
          paidAmount: 0,
          bookingStatus: 'PENDING',
          paymentStatus: 'UNPAID',
        },
        include: {
          package: true,
          service: true,
        },
      });

      return newBooking;
    });

    return NextResponse.json({
      success: true,
      booking: result,
      message: 'Your booking request has been submitted successfully to Mayur Gadade Studio!',
    });
  } catch (error: any) {
    console.error('Create booking error:', error);
    if (error.message?.startsWith('BOOKING_CONFLICT:')) {
      return NextResponse.json(
        { error: error.message.replace('BOOKING_CONFLICT: ', '') },
        { status: 409 }
      );
    }
    if (error.message?.startsWith('PACKAGE_NOT_FOUND:')) {
      return NextResponse.json(
        { error: error.message.replace('PACKAGE_NOT_FOUND: ', '') },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'An error occurred while creating your booking.' },
      { status: 500 }
    );
  }
}
