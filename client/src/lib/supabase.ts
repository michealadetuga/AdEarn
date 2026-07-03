import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
      'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  )
}

/**
 * Client-side Supabase instance using the anon/public key.
 * Row Level Security (RLS) applies to all queries made by this client.
 * This is the ONLY Supabase client instance in the entire frontend application.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
