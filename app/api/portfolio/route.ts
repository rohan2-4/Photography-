import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const whereClause: Record<string, unknown> = {};

    if (category && category !== 'All') {
      whereClause.category = category;
    }

    if (featured === 'true') {
      whereClause.isFeatured = true;
    }

    const portfolio = await prisma.portfolioImage.findMany({
      where: whereClause,
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error('Fetch portfolio error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve portfolio images' },
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
    const { title, category, imageUrl, mediaType = 'IMAGE', videoUrl, isFeatured = false, displayOrder = 0 } = body;

    if (!title || !category || (!imageUrl && !videoUrl)) {
      return NextResponse.json(
        { error: 'Title, category, and media file URL are required' },
        { status: 400 }
      );
    }

    const newImage = await prisma.portfolioImage.create({
      data: {
        title,
        category,
        imageUrl: imageUrl || videoUrl || '',
        mediaType,
        videoUrl: videoUrl || null,
        isFeatured: Boolean(isFeatured),
        displayOrder: parseInt(displayOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, image: newImage });
  } catch (error) {
    console.error('Create portfolio item error:', error);
    return NextResponse.json(
      { error: 'Failed to add portfolio item' },
      { status: 500 }
    );
  }
}
