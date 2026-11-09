import { m } from 'framer-motion'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useIntro } from '../lib/intro'
import { ease } from '../lib/motion'

/**
 * The scalloped gold double frame of the card.
 *
 * Proportions were measured from the original design (relative to half the
 * frame width): a wide central arch, then two small scallops at each corner,
 * mirrored at the bottom. The top and bottom caps keep their exact shape at any
 * size; only the straight sides stretch to fit the content.
 */
const K = {
  c1x: 0.65, c1y: 0.315, // first cusp
  c2x: 0.86, c2y: 0.555, // second cusp
  sideY: 0.745, // where the straight side starts
  r1: 0.828, r2: 0.32, r3: 0.2, // arc radii
}

function outline(w: number, h: number, inset: number) {
  const x0 = inset
  const y0 = inset
  const W = w - inset * 2
  const H = h - inset * 2
  const hw = W / 2
  const cx = x0 + hw
  const f = (n: number) => +n.toFixed(2)
  const X = (side: 1 | -1, nx: number) => f(cx + side * nx * hw)
  const top = (ny: number) => f(y0 + ny * hw)
  const bot = (ny: number) => f(y0 + H - ny * hw)
  const [R1, R2, R3] = [K.r1 * hw, K.r2 * hw, K.r3 * hw].map(f)

  /** One half, from the top centre down to the bottom centre. */
  const half = (side: 1 | -1) => {
    const s = side === 1 ? 1 : 0
    return [
      `M${f(cx)} ${f(y0)}`,
      `A${R1} ${R1} 0 0 ${s} ${X(side, K.c1x)} ${top(K.c1y)}`,
      `A${R2} ${R2} 0 0 ${s} ${X(side, K.c2x)} ${top(K.c2y)}`,
      `A${R3} ${R3} 0 0 ${s} ${X(side, 1)} ${top(K.sideY)}`,
      `L${X(side, 1)} ${bot(K.sideY)}`,
      `A${R3} ${R3} 0 0 ${s} ${X(side, K.c2x)} ${bot(K.c2y)}`,
      `A${R2} ${R2} 0 0 ${s} ${X(side, K.c1x)} ${bot(K.c1y)}`,
      `A${R1} ${R1} 0 0 ${s} ${f(cx)} ${f(y0 + H)}`,
    ].join(' ')
  }

  /** Closed shape, clockwise, used for the lighter inner panel. */
  const closed = [
    half(1),
    `A${R1} ${R1} 0 0 1 ${X(-1, K.c1x)} ${bot(K.c1y)}`,
    `A${R2} ${R2} 0 0 1 ${X(-1, K.c2x)} ${bot(K.c2y)}`,
    `A${R3} ${R3} 0 0 1 ${X(-1, 1)} ${bot(K.sideY)}`,
    `L${X(-1, 1)} ${top(K.sideY)}`,
    `A${R3} ${R3} 0 0 1 ${X(-1, K.c2x)} ${top(K.c2y)}`,
    `A${R2} ${R2} 0 0 1 ${X(-1, K.c1x)} ${top(K.c1y)}`,
    `A${R1} ${R1} 0 0 1 ${f(cx)} ${f(y0)} Z`,
  ].join(' ')

  return { right: half(1), left: half(-1), closed }
}

let uid = 0

export function FrameBorder() {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  const { play } = useIntro()
  const [gradientId] = useState(() => `frame-gold-${++uid}`)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      setSize((prev) =>
        prev && Math.abs(prev.w - width) < 0.5 && Math.abs(prev.h - height) < 0.5 ? prev : { w: width, h: height },
      )
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const shapes = useMemo(() => {
    if (!size || size.w < 40 || size.h < 40) return null
    const outer = Math.min(2.6, Math.max(1.5, size.w * 0.0042))
    const inner = outer * 0.6
    const gap = Math.max(5, size.w * 0.017)
    return {
      outerWidth: outer,
      innerWidth: inner,
      outer: outline(size.w, size.h, outer / 2),
      inner: outline(size.w, size.h, outer / 2 + gap),
    }
  }, [size])

  const draw = (delay: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: play ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
    transition: {
      pathLength: { delay, duration: 2.8, ease: ease.inOut },
      opacity: { delay, duration: 0.4 },
    },
  })

  return (
    <div ref={ref} className="frame" aria-hidden="true">
      {size && shapes && (
        <svg width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} fill="none">
          <defs>
            <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={size.w} y2={size.h}>
              <stop offset="0" stopColor="#9a6820" />
              <stop offset="0.22" stopColor="#d9b56d" />
              <stop offset="0.45" stopColor="#a87a33" />
              <stop offset="0.7" stopColor="#e4c88a" />
              <stop offset="1" stopColor="#9a6820" />
            </linearGradient>
          </defs>
          <m.path
            d={shapes.outer.closed}
            className="frame__panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: play ? 1 : 0 }}
            transition={{ duration: 2.2, ease: ease.soft }}
          />
          {[shapes.outer.right, shapes.outer.left].map((d, i) => (
            <m.path key={`o${i}`} d={d} stroke={`url(#${gradientId})`} strokeWidth={shapes.outerWidth} {...draw(0.1)} />
          ))}
          {[shapes.inner.right, shapes.inner.left].map((d, i) => (
            <m.path key={`i${i}`} d={d} stroke={`url(#${gradientId})`} strokeWidth={shapes.innerWidth} {...draw(0.45)} />
          ))}
        </svg>
      )}
    </div>
  )
}
