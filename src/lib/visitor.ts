/**
 * Anonymous, per-browser visitor id.
 * A random UUID kept in localStorage — no names, IPs or fingerprints — so a guest
 * who opens the link many times is still counted as one visitor.
 */
const VISITOR_KEY = 'byar-lanya:visitor'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

let memoryId: string | null = null

function randomUuid(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const b = crypto.getRandomValues(new Uint8Array(16))
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

export function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id || !UUID_RE.test(id)) {
      id = randomUuid()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    // Private mode / storage blocked: one id for this page load.
    memoryId ??= randomUuid()
    return memoryId
  }
}
