import { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getPaste } from '@/common/supabase-db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const id = (await params).id;
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
      expiresAt: foundPaste.expires_at,
      content: foundPaste.content,
      size: foundPaste.size,
      timestamp: foundPaste.timestamp,
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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const id = (await params).id;
    const { error } = await supabase.from('pastes').delete().eq('id', id);

    if (error) {
      console.error('Error deleting paste:', error);
      return Response.json(
        {
          message: 'Failed to delete paste',
        },
        {
          status: 500,
        },
      );
    }

    return Response.json({ success: true });
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
