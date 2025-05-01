import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { buildErrorResponse } from '@/common/error';
import { getUserPasteStatistics } from '@/common/supabase-db';

export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return buildErrorResponse('Invalid session', 401);
    }

    return NextResponse.json(await getUserPasteStatistics(session.user));
  } catch (error) {
    console.error('Error getting paste statistics:', error);
    return buildErrorResponse('Failed to get paste statistics', 500);
  }
}
