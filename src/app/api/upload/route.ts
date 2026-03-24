import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return errorResponse('No file provided', 400, 'MISSING_FILE');
    }

    if (!file.type.startsWith('image/')) {
      return errorResponse('File must be an image (image/* type required)', 400, 'INVALID_FILE_TYPE');
    }

    if (file.size > 10 * 1024 * 1024) {
      return errorResponse('File must be less than 10MB', 400, 'FILE_TOO_LARGE');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      success: true,
      data: {
        url: dataUri,
        filename: file.name,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/upload');
  }
}
