import { cache } from 'react';
import { randomString } from '@/common/utils/string.util';
import { Config } from '@/common/config';
import { getPaste } from '@/common/supabase-db';
import { Paste } from '@/types/paste';
import { Paste as SupabasePaste } from '@/common/supabase-db';

/**
 * Generates a paste ID.
 *
 * @returns the generated paste ID.
 */
export async function generatePasteId(): Promise<string> {
  let foundId: string | null = null;
  let iterations = 0;

  while (!foundId) {
    iterations++;
    const id = randomString(Config.idLength);

    try {
      const paste = await getPaste(id);
      if (!paste) {
        foundId = id;
        break;
      }
    } catch (error) {
      console.error('Error checking paste ID:', error);
      // Continue to next iteration
    }

    // Attempt to generate an id 100 times,
    // if it fails, return null
    if (iterations > 100) {
      console.error('Failed to generate a unique paste ID after 100 attempts, please increase your paste id length.');
      throw new Error('Failed to generate a unique paste ID');
    }
  }

  if (!foundId) {
    throw new Error('Failed to generate a unique paste ID');
  }

  return foundId;
}

/**
 * Gets a paste from the cache or the database.
 *
 * @param id The ID of the paste to get.
 * @param incrementViews Whether to increment the views of the paste.
 * @returns The paste with the given ID.
 */
export const lookupPaste = cache(async (id: string, incrementViews = false): Promise<Paste | null> => {
  try {
    // Remove extension if present
    const pasteId = id.split('.')[0];
    const paste = await getPaste(pasteId, incrementViews);

    if (!paste) {
      console.error(`Paste not found: ${pasteId}`);
      return null;
    }

    return {
      ...paste,
      key: pasteId,
    };
  } catch (error) {
    console.error('Error looking up paste:', error);
    return null;
  }
});

/**
 * Adds the additional properties to a paste.
 *
 * @param paste the paste to add the properties to.
 * @returns the paste.
 */
export function getPublicPaste(paste: Paste | SupabasePaste): Paste {
  return {
    ...paste,
    key: paste.id,
    expires_at: paste.expires_at ?? null,
  };
}
