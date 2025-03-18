import { SUPA_BASE_ANON_KEY, SUPA_BASE_URL } from '@/constants/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = SUPA_BASE_URL;

export const supabase = createClient(supabaseUrl, SUPA_BASE_ANON_KEY, {
  auth: {
    // storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
