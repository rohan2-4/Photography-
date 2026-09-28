import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get('eventType');
    const all = searchParams.get('all');

    const whereClause: Record<string, unknown> = {};

    if (!all) {
      whereClause.active = true;
    }

    if (eventType) {
      whereClause.eventType = eventType;
    }

    const packages = await prisma.package.findMany({
      where: whereClause,
      include: {
        service: true,
      },
      orderBy: [
        { isPopular: 'desc' },
        { price: 'asc' },
      ],
    });

    return NextResponse.json({ packages });
  } catch (error) {
    console.error('Fetch packages error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve packages' },
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
      name,
      eventType,
      price,
      discountedPrice,
      duration,
      photographers = 1,
      editedPhotos = 100,
      videoCoverage = false,
      albumIncluded = false,
      droneCoverage = false,
      preWeddingSession = false,
      features,
      isPopular = false,
      active = true,
      serviceId,
    } = body;

    if (!name || !eventType || !price || !duration) {
      return NextResponse.json(
        { error: 'Package name, event type, price, and duration are required' },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newPackage = await prisma.package.create({
      data: {
        name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        eventType,
        price: parseFloat(price),
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
        duration,
        photographers: parseInt(photographers),
        editedPhotos: parseInt(editedPhotos),
        videoCoverage: Boolean(videoCoverage),
        albumIncluded: Boolean(albumIncluded),
        droneCoverage: Boolean(droneCoverage),
        preWeddingSession: Boolean(preWeddingSession),
        features: Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([features]),
        isPopular: Boolean(isPopular),
        active: Boolean(active),
        serviceId: serviceId || null,
      },
    });

    return NextResponse.json({ success: true, package: newPackage });
  } catch (error) {
    console.error('Create package error:', error);
    return NextResponse.json(
      { error: 'Failed to create package' },
      { status: 500 }
    );
  }
}
