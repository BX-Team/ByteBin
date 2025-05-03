import { NextRequest } from 'next/server';
import { getPaste } from '@/common/supabase-db';
import { Config } from '@/common/config';

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

    return Response.json({
      id: foundPaste.id,
      ext: foundPaste.ext,
      language: foundPaste.language,
      expires_at: foundPaste.expires_at,
      url: `${Config.siteUrl}/${foundPaste.id}`,
      content: foundPaste.content,
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
