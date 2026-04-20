import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

/**
 * Browser Supabase client using only `NEXT_PUBLIC_*` env (inlined at build time).
 * Admin sign-in at `/admin` uses server-resolved URL/key instead so `SUPABASE_*`
 * works without duplicating as `NEXT_PUBLIC_*`.
 */
export function createClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) {
    throw new Error(
      "Missing Supabase URL or anon key in the browser. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or use a server component that passes URL and anon key into your client (see AdminLoginForm).",
    );
  }
  return createBrowserClient(url, key);
}
