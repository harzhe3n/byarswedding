import { useMemo, type CSSProperties } from 'react'

/**
 * Rose petals drifting down the screen. Pure CSS transforms (GPU friendly);
 * three nested layers give the fall, the side-to-side sway and the flutter.
 */
const PETAL_PATHS = [
  'M12 1 C19 6 21 15 12 23 C3 15 5 6 12 1 Z',
  'M10 1 C19 4 22 15 11 23 C3 17 2 6 10 1 Z',
]

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function PetalField({ active }: { active: boolean }) {
  const petals = useMemo(() => {
    const rand = seeded(20261120)
    const count = typeof window !== 'undefined' && window.innerWidth < 640 ? 9 : 15
    return Array.from({ length: count }, (_, i) => ({
      left: (i / count) * 100 + rand() * (100 / count),
      size: 11 + rand() * 10,
      fall: 15 + rand() * 11,
      delay: -rand() * 26,
      sway: 3.5 + rand() * 3,
      drift: 25 + rand() * 45,
      spin: 4 + rand() * 5,
      shape: i % 2,
      blush: rand() > 0.42,
      opacity: 0.55 + rand() * 0.4,
    }))
  }, [])

  return (
    <div className={`petals ${active ? 'is-active' : ''}`} aria-hidden="true">
      {petals.map((p, i) => (
        <div
          key={i}
          className="petal"
          style={
            {
              left: `${p.left}%`,
              '--fall': `${p.fall}s`,
              '--delay': `${p.delay}s`,
              '--sway': `${p.sway}s`,
              '--drift': `${p.drift}px`,
              '--spin': `${p.spin}s`,
              opacity: p.opacity,
            } as CSSProperties
          }
        >
          <div className="petal__sway">
            <svg className="petal__spin" viewBox="0 0 24 24" width={p.size} height={p.size}>
              <path d={PETAL_PATHS[p.shape]} fill={p.blush ? 'url(#petal-blush)' : 'url(#petal-cream)'} />
            </svg>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Gradients shared by every petal. Rendered once (0×0, not display:none, so Safari keeps them). */
export function SharedSvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="petal-blush" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dcdc" />
          <stop offset="0.55" stopColor="#d9aeb5" />
          <stop offset="1" stopColor="#b98592" />
        </linearGradient>
        <linearGradient id="petal-cream" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffaf2" />
          <stop offset="0.6" stopColor="#f1e1c8" />
          <stop offset="1" stopColor="#dcc39c" />
        </linearGradient>
      </defs>
    </svg>
  )
}
