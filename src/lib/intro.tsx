import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useInView } from 'framer-motion'

/**
 * The invitation plays one choreographed entrance after the guest taps "بەخێربێیت".
 * Each element asks to appear at a time `at` (seconds after that tap). Elements that are
 * below the fold wait until they are scrolled into view, then appear right away
 * instead of making the guest wait for their slot.
 */
type IntroState = { play: boolean; startedAt: number }

const IntroContext = createContext<IntroState>({ play: false, startedAt: 0 })

export function IntroProvider({ play, children }: { play: boolean; children: ReactNode }) {
  const [startedAt, setStartedAt] = useState(0)
  useEffect(() => {
    if (play) setStartedAt(performance.now())
  }, [play])
  return <IntroContext.Provider value={{ play: play && startedAt > 0, startedAt }}>{children}</IntroContext.Provider>
}

export function useIntro() {
  return useContext(IntroContext)
}

/**
 * Spread the result onto any `m.*` element that has `hidden` / `show` variants.
 * The resolved delay is passed as `custom`, so variants can be functions of it.
 */
export function useReveal<T extends Element = HTMLDivElement>(at: number, amount = 0.2) {
  const ref = useRef<T>(null)
  const inView = useInView(ref, { once: true, amount })
  const { play, startedAt } = useIntro()
  const [delay, setDelay] = useState<number | null>(null)

  useEffect(() => {
    if (!play || !inView || delay !== null) return
    const elapsed = (performance.now() - startedAt) / 1000
    setDelay(Math.max(0.08, at - elapsed))
  }, [play, inView, delay, at, startedAt])

  return {
    ref,
    initial: 'hidden' as const,
    animate: delay === null ? ('hidden' as const) : ('show' as const),
    custom: delay ?? 0,
  }
}
