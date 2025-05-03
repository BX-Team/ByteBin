import { createClient } from '@supabase/supabase-js';
import { Config } from '@netlify/functions';

// Handler function for the Netlify Function
export default async (req: Request) => {
  // Get environment variables
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_ANON_KEY;
  
  // Validate environment variables exist
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Create Supabase client inside the function
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Get expired pastes
    const { data: expiredPastes, error: selectError } = await supabase
      .from('pastes')
      .select('id, views')
      .lt('expires_at', new Date().toISOString());
    
    if (selectError) throw selectError;
    
    // Delete expired pastes
    const { data, error } = await supabase
      .from('pastes')
      .delete()
      .lt('expires_at', new Date().toISOString());
    
    if (error) throw error;
    
    console.log(`Expired ${expiredPastes?.length || 0} pastes`);
    return new Response(JSON.stringify({ 
      success: true, 
      expired: expiredPastes?.length || 0 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in expirePastes function:', error);
    return new Response(JSON.stringify({ error: 'Failed to expire pastes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Optional: Configure function to run on a schedule using Netlify's config
export const config: Config = {
  schedule: '@daily' // Run once per day
};
