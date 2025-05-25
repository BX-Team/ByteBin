import { NextRequest } from 'next/server';
import { Config } from '@/common/config';
import { createPaste, getPaste } from '@/common/supabase-db';
import { Ratelimiter, RateLimitResponse } from '@/common/ratelimiter';
import { buildErrorResponse } from '@/common/error';
import { spamFilters } from '@/filter/filters';

/**
 * Configure the rate limit for this route.
 */
Ratelimiter.configRoute('/api/post', {
  windowMs: 1000 * 60,
  maxRequests: 15, // 15 requests per minute
});

async function handlePasteCreation(req: NextRequest) {
  // Handle rate limiting
  const rateLimitResponse: RateLimitResponse | undefined = Ratelimiter.check(req, `/api/post`);
  if (rateLimitResponse) {
    if (!rateLimitResponse.allowed) {
      return Ratelimiter.applyHeaders(buildErrorResponse('You have been rate limited!', 429), rateLimitResponse);
    }
  }

  try {
    const body = await req.text();
    const language = req.nextUrl.searchParams.get('language') || undefined;

    if (body == undefined || body == '') {
      return new Response('Invalid request body', {
        status: 400,
      });
    }

    const bodySize = Buffer.byteLength(body);
    if (bodySize / 1024 > Config.maxPasteSize) {
      return buildErrorResponse('Your paste exceeds the maximum size', 400);
    }

    for (const filter of spamFilters) {
      if (filter.checkFilter(body)) {
        console.log(`Paste upload has been filtered by our spam filter: ${filter.getName()}`);
        return buildErrorResponse('Your paste has been filtered by our spam filter', 400);
      }
    }

    const expiresAt = new Date(new Date().getTime() + Config.pasteExpiry * 24 * 60 * 60 * 1000);
    const paste = await createPaste(body, expiresAt, language);

    const verifyPaste = await getPaste(paste.id);
    if (!verifyPaste) {
      console.error('Failed to verify paste creation:', paste.id);
      return buildErrorResponse('Failed to create paste', 500);
    }

    return Response.json({
      id: paste.id,
      ext: paste.ext,
      expires_at: paste.expires_at,
      url: `${Config.siteUrl}/${paste.id}`,
    });
  } catch (error) {
    console.error('Error creating paste:', error);
    return buildErrorResponse('Failed to create paste', 500);
  }
}

export async function POST(req: NextRequest) {
  return handlePasteCreation(req);
}

export async function PUT(req: NextRequest) {
  return handlePasteCreation(req);
}
