import { createClient } from '@supabase/supabase-js';
import { Config } from './config';

if (!Config.supabaseUrl || !Config.supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(Config.supabaseUrl, Config.supabaseKey);
