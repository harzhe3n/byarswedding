import type { SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

let clientPromise: Promise<SupabaseClient | null> | null = null

/**
 * Returns the shared Supabase client, or null when the env variables are missing.
 * The library is loaded on demand so it never delays the first paint of the invitation.
 */
export function getSupabase(): Promise<SupabaseClient | null> {
  if (!clientPromise) {
    if (!url || !key) {
      console.warn('[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set — the visitor counter is hidden.')
      clientPromise = Promise.resolve(null)
    } else {
      clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
        createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        }),
      )
    }
  }
  return clientPromise
}
