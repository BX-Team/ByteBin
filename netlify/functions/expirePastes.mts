import { createClient } from '@supabase/supabase-js';

export default async (req: Request) => {
  const { data: expiredPastes, error: selectError } = await supabase
      .from('pastes')
      .select('id, views')
      .lt('expires_at', new Date().toISOString());
  
    if (selectError) throw selectError;
  
    const { data, error } = await supabase.from('pastes').delete().lt('expires_at', new Date().toISOString());
  
    if (error) throw error;
    console.log(`Expired ${expiredPastes?.length || 0} pastes`);
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_ANON_KEY);
