import { animate, m } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { text } from '../config/text'
import { useReveal } from '../lib/intro'
import { toKurdishDigits } from '../lib/kurdish'
import { fadeUp } from '../lib/motion'

/** Public "N people have seen this invitation" badge with a count-up animation. */
export function VisitorCounter({ count }: { count: number | null }) {
  const r = useReveal<HTMLDivElement>(0.2)
  const [shown, setShown] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (count === null || r.animate !== 'show' || started.current) return
    started.current = true
    const controls = animate(0, count, {
      duration: Math.min(2.4, 0.8 + count / 150),
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    })
    return () => controls.stop()
  }, [count, r.animate])

  // Live updates after the first count-up (e.g. the number arrives late).
  useEffect(() => {
    if (started.current && count !== null) setShown(count)
  }, [count])

  if (count === null) return null

  return (
    <m.div {...r} variants={fadeUp} className="visitors" role="status">
      <svg className="visitors__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 12 C4.8 7.2 8.2 5 12 5 C15.8 5 19.2 7.2 22 12 C19.2 16.8 15.8 19 12 19 C8.2 19 4.8 16.8 2 12 Z" />
        <circle cx="12" cy="12" r="3.4" />
      </svg>
      <span className="visitors__num">{toKurdishDigits(shown)}</span>
      <span className="visitors__label">{text.visitors.label}</span>
    </m.div>
  )
}
