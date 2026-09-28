import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const session = await getSession();
        if (!session || (session.role !== 'ADMIN' && session.role !== 'PHOTOGRAPHER')) {
          throw new Error('Admin permission required');
        }
        if (!/^portfolio\/[a-zA-Z0-9._-]+$/.test(pathname)) {
          throw new Error('Invalid upload filename');
        }

        return {
          allowedContentTypes: [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
            'video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/x-msvideo',
          ],
          maximumSizeInBytes: 500 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Portfolio upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload media file' },
      { status: 400 }
    );
  }
}
