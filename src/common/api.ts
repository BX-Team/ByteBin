import ky from 'ky';
import { Config } from './config';
import { Paste } from './supabase-db';

export type Page<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
};

export type ApiError = {
  message: string;
};

export type ApiResponse<T> = {
  paste: T | null;
  error: ApiError | null;
};

/**
 * Uploads a paste to the server.
 *
 * @param content the content to upload.
 * @param expires the number of seconds until the paste expires.
 * @param language the language of the paste.
 * @returns the paste and any error that occurred.
 */
export async function uploadPaste(
  content: string,
  expires?: number,
  language = 'plaintext',
): Promise<ApiResponse<Paste>> {
  const response = await ky.post('/api/post', {
    body: content,
    searchParams: {
      ...(expires && expires > 0 ? { expires } : {}),
      language,
    },
    throwHttpErrors: false,
  });

  if (response.status !== 200) {
    return {
      paste: null,
      error: await response.json(),
    };
  }

  return {
    paste: await response.json(),
    error: null,
  };
}

/**
 * Gets a paste by ID.
 *
 * @param id the ID of the paste to get.
 * @returns the paste.
 */
export function getPaste(id: string): Promise<Paste> {
  return ky.get(`/api/${id}`).json();
}
