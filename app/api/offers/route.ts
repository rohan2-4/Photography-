import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all');
    const now = new Date();

    const whereClause: Record<string, unknown> = {};

    if (!all) {
      whereClause.active = true;
      whereClause.startDate = { lte: now };
      whereClause.endDate = { gte: now };
    }

    const offers = await prisma.offer.findMany({
      where: whereClause,
      include: {
        package: true,
      },
      orderBy: {
        endDate: 'asc',
      },
    });

    return NextResponse.json({ offers });
  } catch (error) {
    console.error('Fetch offers error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve offers' },
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

    const body = await request.json();
    const {
      title,
      code,
      discountPercent,
      discountAmount,
      startDate,
      endDate,
      terms,
      packageId,
      active = true,
    } = body;

    if (!title || !code || !startDate || !endDate || !terms) {
      return NextResponse.json(
        { error: 'Title, offer code, start/end dates, and terms are required' },
        { status: 400 }
      );
    }

    const newOffer = await prisma.offer.create({
      data: {
        title,
        code: code.toUpperCase().trim(),
        discountPercent: discountPercent ? parseFloat(discountPercent) : null,
        discountAmount: discountAmount ? parseFloat(discountAmount) : null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        terms,
        packageId: packageId || null,
        active: Boolean(active),
      },
    });

    return NextResponse.json({ success: true, offer: newOffer });
  } catch (error) {
    console.error('Create offer error:', error);
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    );
  }
}
