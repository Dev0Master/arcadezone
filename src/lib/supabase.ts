import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file:\n' +
    '- NEXT_PUBLIC_SUPABASE_URL\n' +
    '- NEXT_PUBLIC_SUPABASE_ANON_KEY\n\n' +
    'Get these values from your Supabase project dashboard: https://supabase.com/dashboard'
  );
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create admin client with service role key (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});