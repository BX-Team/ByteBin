import { NextRequest } from 'next/server';
import { getPaste } from '@/common/supabase-db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const foundPaste = await getPaste(id, true);

    if (foundPaste == null) {
      return Response.json(
        {
          message: 'Paste not found',
        },
        {
          status: 404,
        },
      );
    }

    return new Response(foundPaste.content, {
      headers: {
        'Content-Type': `text/${foundPaste.language || 'plain'}`,
      },
    });
  } catch (error) {
    console.error('Error in paste route:', error);
    return Response.json(
      {
        message: 'Internal server error',
      },
      {
        status: 500,
      },
    );
  }
}
