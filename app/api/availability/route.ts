import { NextResponse } from 'next/server';
import { checkDateAvailability } from '@/lib/booking/availability';

export const dynamic = 'force-dynamic';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');
    const startTime = searchParams.get('startTime') || undefined;
    const endTime = searchParams.get('endTime') || undefined;

    if (!dateStr) {
      return NextResponse.json(
        { error: 'Date query parameter is required (YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    const result = await checkDateAvailability(date, startTime, endTime);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Failed to verify availability' },
      { status: 500 }
    );
  }
}
