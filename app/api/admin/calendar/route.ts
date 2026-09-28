import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';


export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'PHOTOGRAPHER')) {
      return NextResponse.json({ error: 'Admin permission required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // YYYY-MM
    
    let startDate: Date;
    let endDate: Date;

    if (month) {
      const [year, m] = month.split('-').map(Number);
      startDate = new Date(year, m - 1, 1);
      endDate = new Date(year, m, 0, 23, 59, 59);
    } else {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);
    }

    const [bookings, blocks] = await Promise.all([
      prisma.booking.findMany({
        where: {
          eventDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          package: true,
        },
      }),
      prisma.availabilityBlock.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
    ]);

    return NextResponse.json({ bookings, blocks });
  } catch (error) {
    console.error('Fetch calendar error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve calendar items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'PHOTOGRAPHER')) {
      return NextResponse.json({ error: 'Admin permission required' }, { status: 403 });
    }

    const { date, reason, startTime, endTime } = await request.json();

    if (!date || !reason) {
      return NextResponse.json(
        { error: 'Date and reason for block are required' },
        { status: 400 }
      );
    }

    const block = await prisma.availabilityBlock.create({
      data: {
        date: new Date(date),
        reason,
        startTime: startTime || null,
        endTime: endTime || null,
        createdBy: session.name || 'ADMIN',
      },
    });

    return NextResponse.json({ success: true, block });
  } catch (error) {
    console.error('Create block error:', error);
    return NextResponse.json(
      { error: 'Failed to block date' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'PHOTOGRAPHER')) {
      return NextResponse.json({ error: 'Admin permission required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const blockId = searchParams.get('id');

    if (!blockId) {
      return NextResponse.json({ error: 'Block ID is required' }, { status: 400 });
    }

    await prisma.availabilityBlock.delete({
      where: { id: blockId },
    });

    return NextResponse.json({ success: true, message: 'Availability block removed' });
  } catch (error) {
    console.error('Delete block error:', error);
    return NextResponse.json(
      { error: 'Failed to unblock date' },
      { status: 500 }
    );
  }
}
