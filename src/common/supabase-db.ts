import { supabase } from './supabase';
import { generatePasteId } from '@/common/utils/paste.util';
import { getLanguage, getLanguageName } from '@/common/utils/lang.util';
import { User } from '@supabase/supabase-js';

export type Paste = {
  id: string;
  content: string;
  size: number;
  ext: string;
  language: string;
  owner_id?: string;
  expires_at?: string;
  timestamp: string;
  views: number;
};

/**
 * Creates a new paste with a random ID.
 */
export async function createPaste(content: string, expiresAt?: Date, uploader?: User) {
  if (expiresAt && expiresAt.getTime() < new Date().getTime()) {
    expiresAt = undefined;
  }

  const ext = await getLanguage(content);
  const paste = {
    id: await generatePasteId(),
    content,
    size: Buffer.byteLength(content),
    ext,
    language: getLanguageName(ext),
    owner_id: uploader?.id,
    expires_at: expiresAt?.toISOString(),
    timestamp: new Date().toISOString(),
    views: 0,
  };

  const { data, error } = await supabase.from('pastes').insert(paste).select().single();

  if (error) {
    console.error('Error creating paste:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to create paste: no data returned');
  }

  return data;
}

/**
 * Gets a paste by ID.
 */
export async function getPaste(id: string, incrementViews = false) {
  try {
    if (incrementViews) {
      // First get the current paste
      const { data: currentPaste, error: getError } = await supabase
        .from('pastes')
        .select('views')
        .eq('id', id)
        .single();

      if (getError) {
        console.error('Error getting current paste:', getError);
        throw getError;
      }

      if (!currentPaste) {
        console.log('Paste not found for view increment');
        return null;
      }

      // Then update the views
      const { data: updateData, error: updateError } = await supabase
        .from('pastes')
        .update({ views: (currentPaste.views || 0) + 1 })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating views:', updateError);
        throw updateError;
      }

      if (updateData) {
        return updateData;
      }
    }

    const { data, error } = await supabase.from('pastes').select().eq('id', id).single();

    if (error) {
      console.error('Error getting paste:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getPaste:', error);
    return null;
  }
}

/**
 * Expires all pastes that have expired.
 */
export async function expirePastes() {
  const { data, error } = await supabase.from('pastes').delete().lt('expires_at', new Date().toISOString());

  if (error) throw error;
  console.log(`Expired ${(data as unknown[] | null)?.length || 0} pastes`);
}

/**
 * Gets all pastes for a user.
 */
export async function getUsersPastes(
  user: User,
  options?: {
    skip?: number;
    take?: number;
    countOnly?: boolean;
  },
): Promise<{ pastes: Paste[]; totalItems: number }> {
  const { count, error: countError } = await supabase
    .from('pastes')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user.id);

  if (countError) throw countError;

  if (options?.countOnly) {
    return { pastes: [], totalItems: count || 0 };
  }

  const { data, error } = await supabase
    .from('pastes')
    .select()
    .eq('owner_id', user.id)
    .order('timestamp', { ascending: false })
    .range(options?.skip || 0, (options?.skip || 0) + (options?.take || 10) - 1);

  if (error) throw error;
  return { pastes: data || [], totalItems: count || 0 };
}

/**
 * Gets the statistics for a user.
 */
export async function getUserPasteStatistics(user: User) {
  const { data, error } = await supabase.from('pastes').select('views').eq('owner_id', user.id);

  if (error) throw error;

  const totalPastes = data?.length || 0;
  const totalViews = data?.reduce((sum, paste) => sum + (paste.views || 0), 0) || 0;

  return {
    totalPastes,
    totalViews,
  };
}
