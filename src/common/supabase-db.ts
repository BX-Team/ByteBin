import { supabase } from './supabase';
import { generatePasteId } from '@/common/utils/paste.util';

export type Paste = {
  id: string;
  content: string;
  size: number;
  language: string;
  expires_at?: string;
  timestamp: string;
  views: number;
};

/**
 * Creates a new paste with a random ID.
 */
export async function createPaste(content: string, expiresAt?: Date, language?: string) {
  const TWO_WEEKS = 60 * 60 * 24 * 14 * 1000;
  expiresAt = new Date(Date.now() + TWO_WEEKS);

  let detectedLanguage = language || 'plain';
  const formattedLanguage = detectedLanguage.charAt(0).toUpperCase() + detectedLanguage.slice(1);

  const paste = {
    id: await generatePasteId(),
    content,
    size: Buffer.byteLength(content),
    language: formattedLanguage,
    expires_at: expiresAt.toISOString(),
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
  const { data: expiredPastes, error: selectError } = await supabase
    .from('pastes')
    .select('id, views')
    .lt('expires_at', new Date().toISOString());

  if (selectError) throw selectError;

  const { data, error } = await supabase.from('pastes').delete().lt('expires_at', new Date().toISOString());

  if (error) throw error;
  console.log(`Expired ${expiredPastes?.length || 0} pastes`);
}

/**
 * Updates the language of a paste.
 */
export async function updatePasteLanguage(id: string, language: string) {
  const formattedLanguage = language.charAt(0).toUpperCase() + language.slice(1);

  const { data, error } = await supabase
    .from('pastes')
    .update({ language: formattedLanguage })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating paste language:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to update paste language: no data returned');
  }

  return data;
}
