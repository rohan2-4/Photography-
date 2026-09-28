import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, phone, eventType, message } = await request.json();

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Name, email, phone, and message are required' },
        { status: 400 }
      );
    }

    const contactMsg = await prisma.contactMessage.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        phone,
        eventType: eventType || null,
        message,
        status: 'UNREAD',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out to Cinemayur! Our team will contact you shortly.',
      contactMsg,
    });
  } catch (error) {
    console.error('Contact message error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact request' },
      { status: 500 }
    );
  }
}
