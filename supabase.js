import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://qmyiwmkwszosuviwwmyc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteWl3bWt3c3pvc3V2aXd3bXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTAwNDYsImV4cCI6MjA5NTgyNjA0Nn0.UL3sOSrySwpp5vK0iA2UA6QuftE-733PzakxrrLoRqw'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)