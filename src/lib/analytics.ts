import { getSupabase } from './supabase'
import { getVisitorId } from './visitor'

const VISIT_SESSION_KEY = 'byar-lanya:visited'

/**
 * Registers this browser as a visitor (once per session) and returns the number
 * of unique visitors so far. Each browser has one anonymous random id, so
 * opening the link again never counts the same person twice.
 * Returns null when Supabase is not configured or unreachable.
 */
export async function registerVisitAndCount(): Promise<number | null> {
  try {
    const sb = await getSupabase()
    if (!sb) return null

    let alreadyCounted = false
    try {
      alreadyCounted = sessionStorage.getItem(VISIT_SESSION_KEY) === '1'
    } catch {
      /* storage unavailable */
    }

    const isBot = typeof navigator !== 'undefined' && navigator.webdriver
    const { data, error } =
      alreadyCounted || isBot
        ? await sb.rpc('visitor_count')
        : await sb.rpc('track_visit', { p_visitor: getVisitorId() })

    if (error) {
      console.warn('[visitors] request failed:', error.message)
      return null
    }
    if (!alreadyCounted && !isBot) {
      try {
        sessionStorage.setItem(VISIT_SESSION_KEY, '1')
      } catch {
        /* storage unavailable */
      }
    }
    return typeof data === 'number' ? data : Number(data)
  } catch (err) {
    console.warn('[visitors] request failed:', err)
    return null
  }
}
