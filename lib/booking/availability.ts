import { prisma } from '@/lib/db/prisma';

export interface AvailabilityCheckResult {
  status: 'AVAILABLE' | 'BOOKED' | 'HOLD';
  message: string;
  conflictingBookingId?: string;
  conflictingReason?: string;
}

/**
 * Converts "HH:MM" string to total minutes from midnight for easy range comparison
 */
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

/**
 * Checks if two time ranges overlap.
 * Formula: requestedStart < existingEnd AND requestedEnd > existingStart
 */
export function doTimesOverlap(
  reqStart: string,
  reqEnd: string,
  existStart: string,
  existEnd: string
): boolean {
  const rStart = timeToMinutes(reqStart);
  const rEnd = timeToMinutes(reqEnd);
  const eStart = timeToMinutes(existStart);
  const eEnd = timeToMinutes(existEnd);

  return rStart < eEnd && rEnd > eStart;
}

export async function checkDateAvailability(
  date: Date,
  startTime?: string,
  endTime?: string,
  isFullDay: boolean = false
): Promise<AvailabilityCheckResult> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // 1. Check explicit admin availability blocks
  const adminBlock = await prisma.availabilityBlock.findFirst({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (adminBlock) {
    // If admin block has no specific time OR request is full day, block the full day
    if (!adminBlock.startTime || isFullDay || !startTime || !endTime) {
      return {
        status: 'BOOKED',
        message: 'Sorry, this date is blocked by the photographer studio.',
        conflictingReason: adminBlock.reason,
      };
    }

    if (
      adminBlock.startTime &&
      adminBlock.endTime &&
      doTimesOverlap(startTime, endTime, adminBlock.startTime, adminBlock.endTime)
    ) {
      return {
        status: 'BOOKED',
        message: 'Sorry, the photographer is unavailable during your requested time slot.',
        conflictingReason: adminBlock.reason,
      };
    }
  }

  // 2. Check existing bookings on this date
  const bookingsOnDate = await prisma.booking.findMany({
    where: {
      eventDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
      bookingStatus: {
        in: ['CONFIRMED', 'PENDING', 'COMPLETED'],
      },
    },
  });

  // Check confirmed / completed first
  for (const booking of bookingsOnDate) {
    if (booking.bookingStatus === 'CONFIRMED' || booking.bookingStatus === 'COMPLETED') {
      // If either requested booking or existing booking is Full Day, or time missing
      if (isFullDay || booking.isFullDay || !startTime || !endTime || !booking.startTime || !booking.endTime) {
        return {
          status: 'BOOKED',
          message: 'Sorry, this date is already booked by another customer.',
          conflictingBookingId: booking.bookingNumber,
        };
      }

      if (doTimesOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
        return {
          status: 'BOOKED',
          message: `Sorry, this date/time slot (${booking.startTime} - ${booking.endTime}) is already booked.`,
          conflictingBookingId: booking.bookingNumber,
        };
      }
    }
  }

  // Check pending bookings
  for (const booking of bookingsOnDate) {
    if (booking.bookingStatus === 'PENDING') {
      if (isFullDay || booking.isFullDay || !startTime || !endTime || !booking.startTime || !booking.endTime) {
        return {
          status: 'HOLD',
          message: 'This date is temporarily on hold pending review by the photographer.',
          conflictingBookingId: booking.bookingNumber,
        };
      }

      if (doTimesOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
        return {
          status: 'HOLD',
          message: `This time slot is temporarily on hold pending review by the photographer.`,
          conflictingBookingId: booking.bookingNumber,
        };
      }
    }
  }

  return {
    status: 'AVAILABLE',
    message: 'Your requested date and time slot is available!',
  };
}
