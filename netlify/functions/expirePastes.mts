import { createClient } from '@supabase/supabase-js';

export default async (req: Request) => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data: expiredPastes, error: selectError } = await supabase
      .from('pastes')
      .select('id, views')
      .lt('expires_at', new Date().toISOString());

    if (selectError) throw selectError;

    const { data, error } = await supabase.from('pastes').delete().lt('expires_at', new Date().toISOString());

    if (error) throw error;

    console.log(`Expired ${expiredPastes?.length || 0} pastes`);
    return new Response(
      JSON.stringify({
        success: true,
        expired: expiredPastes?.length || 0,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in expirePastes function:', error);
    return new Response(JSON.stringify({ error: 'Failed to expire pastes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
