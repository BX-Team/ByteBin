import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { buildErrorResponse } from '@/common/error';
import { getUsersPastes } from '@/common/supabase-db';
import { Pagination } from '@/common/pagination/pagination';
import SuperJSON from 'superjson';
import { Paste } from '@/types/paste';
import { getPublicPaste } from '@/common/utils/paste.util';

const itemsPerPage = 16;

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return buildErrorResponse('Invalid session', 401);
    }

    const pageParam = req.nextUrl.searchParams.get('page');
    const page = pageParam ? Math.max(1, parseInt(pageParam)) : 1;

    const { totalItems } = await getUsersPastes(session.user, {
      countOnly: true,
    });

    // Create the page object
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalItems === 0) {
      return NextResponse.json(SuperJSON.serialize({
        items: [],
        metadata: {
          page: 1,
          totalItems: 0,
          itemsPerPage,
          totalPages: 1,
        },
      }));
    }

    if (page > totalPages) {
      return buildErrorResponse('Invalid page number', 400);
    }

    // Get the pastes for the current page
    const { pastes } = await getUsersPastes(session.user, {
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
    });

    const pageData = {
      items: pastes.map(paste => getPublicPaste(paste)),
      metadata: {
        page,
        totalItems,
        itemsPerPage,
        totalPages,
      },
    };

    return NextResponse.json(SuperJSON.serialize(pageData));
  } catch (error) {
    console.error('Error getting pastes:', error);
    return buildErrorResponse('Failed to get pastes', 500);
  }
}
