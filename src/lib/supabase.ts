import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://dwgjqjvsvastinsaqdpg.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Z2pxanZzdmFzdGluc2FxZHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMjU2NDUsImV4cCI6MjEwNDkwMTY0NX0.FldG9JP2fxajmYVe8xjc6ow8LF8lgeJCSzHFn4Uezrs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
