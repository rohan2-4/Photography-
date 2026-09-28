import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'PHOTOGRAPHER')) {
      return NextResponse.json({ error: 'Admin permission required' }, { status: 403 });
    }

    const body = await request.json();
    const { active, title, code, discountPercent, discountAmount, startDate, endDate, terms } = body;

    const updateData: Record<string, unknown> = {};

    if (active !== undefined) updateData.active = Boolean(active);
    if (title) updateData.title = title;
    if (code) updateData.code = code.toUpperCase().trim();
    if (discountPercent !== undefined) updateData.discountPercent = discountPercent;
    if (discountAmount !== undefined) updateData.discountAmount = discountAmount;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (terms) updateData.terms = terms;

    const updatedOffer = await prisma.offer.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, offer: updatedOffer });
  } catch (error) {
    console.error('Update offer error:', error);
    return NextResponse.json(
      { error: 'Failed to update offer' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'PHOTOGRAPHER')) {
      return NextResponse.json({ error: 'Admin permission required' }, { status: 403 });
    }

    await prisma.offer.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete offer error:', error);
    return NextResponse.json(
      { error: 'Failed to delete offer' },
      { status: 500 }
    );
  }
}
