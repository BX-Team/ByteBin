import { NextRequest } from 'next/server';
import { createPaste } from '@/common/supabase-db';
import { Config } from '@/common/config';
import { buildErrorResponse } from '@/common/error';
import { spamFilters } from '@/filter/filters';

async function handlePasteCreation(req: NextRequest) {
  const body = await req.text();
  const userAgent = req.headers.get('User-Agent');

  // Basic validation
  if (!body || body.trim() === '') {
    return buildErrorResponse('Invalid request body', 400);
  }

  if (!userAgent) {
    return buildErrorResponse('User-Agent header is required', 400);
  }

  // Size validation
  const bodySize = Buffer.byteLength(body);
  if (bodySize / 1024 > Config.maxPasteSize) {
    return buildErrorResponse('Your paste exceeds the maximum size', 400);
  }

  // Spam check
  for (const filter of spamFilters) {
    if (filter.checkFilter(body)) {
      console.log(`Paste upload has been filtered by our spam filter: ${filter.getName()}`);
      return buildErrorResponse('Your paste has been filtered by our spam filter', 400);
    }
  }

  // Create paste - language will be auto-detected
  const paste = await createPaste(body);

  // Return response with Location header and JSON body
  return Response.json(
    { id: paste.id },
    {
      status: 201,
      headers: {
        Location: `/api/${paste.id}`,
      },
    },
  );
}

export async function POST(req: NextRequest) {
  try {
    return await handlePasteCreation(req);
  } catch (error) {
    console.error('Error creating paste:', error);
    return buildErrorResponse('Failed to create paste', 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    return await handlePasteCreation(req);
  } catch (error) {
    console.error('Error creating paste:', error);
    return buildErrorResponse('Failed to create paste', 500);
  }
}
