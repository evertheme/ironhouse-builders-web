/**
 * Resolve Supabase URL and anon key.
 * Prefer `NEXT_PUBLIC_*` so values are available in the browser bundle.
 * On the server (and during SSR), fall back to `SUPABASE_URL` / `SUPABASE_ANON_KEY`
 * if you only set those in `.env.local`.
 */
export function getSupabaseUrl(): string | undefined {
  const pub = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (pub) return pub;
  if (typeof window === "undefined") {
    return process.env.SUPABASE_URL?.trim();
  }
  return undefined;
}

export function getSupabaseAnonKey(): string | undefined {
  const pub = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (pub) return pub;
  if (typeof window === "undefined") {
    return process.env.SUPABASE_ANON_KEY?.trim();
  }
  return undefined;
}
