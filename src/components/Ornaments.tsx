import { m } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { useReveal } from '../lib/intro'
import { drawPath, popIn, stagger } from '../lib/motion'

/**
 * Gold ornaments redrawn as vectors from the original card, so they stay sharp
 * on every screen and can "draw themselves" in. All use `currentColor` (gold).
 */

/** Heart outline scaled into any box (based on a 24×24 heart). */
export function heartPath(cx: number, top: number, width: number, bottom: number) {
  const sx = width / 20
  const sy = (bottom - top) / 18
  const p = (x: number, y: number) => `${+(cx + (x - 12) * sx).toFixed(2)} ${+(top + (y - 3) * sy).toFixed(2)}`
  return (
    `M${p(12, 21)} C${p(5, 15)} ${p(2, 11.5)} ${p(2, 8)} C${p(2, 5)} ${p(4.5, 3)} ${p(7.2, 3)} ` +
    `C${p(9.2, 3)} ${p(11, 4.2)} ${p(12, 6)} C${p(13, 4.2)} ${p(14.8, 3)} ${p(16.8, 3)} ` +
    `C${p(19.5, 3)} ${p(22, 5)} ${p(22, 8)} C${p(22, 11.5)} ${p(19, 15)} ${p(12, 21)} Z`
  )
}

const HEART_24 = heartPath(12, 3, 20, 21)

/** Renders the children, then again mirrored around the vertical centre line. */
function Mirror({ width, children }: { width: number; children: ReactNode }) {
  return (
    <>
      <g>{children}</g>
      <g transform={`translate(${width} 0) scale(-1 1)`}>{children}</g>
    </>
  )
}

type OrnamentProps = { at: number; className?: string }

/** Small solid heart. */
export function SmallHeart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d={HEART_24} fill="currentColor" />
    </svg>
  )
}

/** Fleur ornament above the Basmala. */
export function TopFleur({ at, className }: OrnamentProps) {
  const r = useReveal<SVGSVGElement>(at)
  return (
    <m.svg {...r} variants={stagger(0.08)} className={className} viewBox="0 0 160 60" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
      <m.path variants={drawPath} d="M80 6 C75.5 15 75 27 80 38 C85 27 84.5 15 80 6 Z" />
      <m.path variants={drawPath} d="M80 15 C78.4 21 78.4 27 80 32 C81.6 27 81.6 21 80 15 Z" strokeWidth="0.9" />
      <Mirror width={160}>
        <m.path variants={drawPath} d="M78 39 C70 35 66 27 68 19 C73 24 77 31 78 39 Z" />
        <m.path variants={drawPath} d="M77 42 C72 49 63 51 57.5 46.5 C52 42 53.5 33.5 60.5 32.5 C66 31.8 68.5 37.5 65 40.5 C62.5 42.5 59.5 40.5 60.5 38" />
        <m.path variants={drawPath} d="M57 47.5 C50 51.5 43.5 52 38 49 C34 46.5 35.5 41.5 39.5 42.5 C42 43.2 41.8 46.3 39.6 46.4" />
        <m.path variants={drawPath} d="M38 49 C31 52.5 23 53 15 50.5" strokeWidth="1" />
      </Mirror>
      <m.circle variants={popIn} cx="80" cy="42.5" r="1.7" fill="currentColor" stroke="none" />
    </m.svg>
  )
}

/** Thin line with an eight-petal medallion, under the Basmala. */
export function DividerMedallion({ at, className }: OrnamentProps) {
  const r = useReveal<SVGSVGElement>(at)
  const petal = 'M170 12.4 C172.9 9.6 173.3 5.6 170 1.8 C166.7 5.6 167.1 9.6 170 12.4 Z'
  return (
    <m.svg {...r} variants={stagger(0.04)} className={className} viewBox="0 0 340 32" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" aria-hidden="true">
      <m.g variants={popIn} style={{ transformOrigin: '170px 16px' }}>
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d={petal} transform={`rotate(${i * 45} 170 16)`} />
        ))}
        <circle cx="170" cy="16" r="3.4" />
        <circle cx="170" cy="16" r="1.3" fill="currentColor" stroke="none" />
      </m.g>
      <Mirror width={340}>
        <m.path variants={drawPath} d="M150 16 H15" />
        <m.path variants={drawPath} d="M8 16 L11 13 L14 16 L11 19 Z" />
      </Mirror>
    </m.svg>
  )
}

/** Scrolling vines with an open heart, under the names. */
export function NamesFlourish({ at, className }: OrnamentProps) {
  const r = useReveal<SVGSVGElement>(at)
  return (
    <m.svg {...r} variants={stagger(0.1)} className={className} viewBox="0 0 300 56" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" aria-hidden="true">
      <m.path variants={drawPath} d={heartPath(150, 8, 34, 44)} strokeWidth="1.5" />
      <Mirror width={300}>
        <m.path variants={drawPath} d="M146 40.5 C131 47 114 46 100 39.5 C86 33 68 26.5 50 27.5 C33 28.5 22 35 22.5 41.5 C23 46.5 30 47.5 32.5 43.5 C34.5 40.2 31 37.5 28.5 39.5" />
        <m.path variants={drawPath} d="M118 44.5 C110.5 41.5 107.5 34 111.5 29.5 C115 25.8 121 28 120 32.5 C119.3 35.3 115.8 35.5 115 33.3" />
        <m.path variants={drawPath} d="M80 30 C74 26 72.5 18.5 77.5 15.5 C82 13 86.5 17.5 84 21 C82.5 23 79.5 22 80 20" />
        <m.path variants={drawPath} d="M60 27 C63.5 22.5 68.5 21.5 72 23" strokeWidth="1" />
        <m.path variants={drawPath} d="M100 39.5 C97 35 93 34 89.5 35.5" strokeWidth="1" />
      </Mirror>
    </m.svg>
  )
}

/** Two linked hearts with scrolls — the closing ornament of the card. */
export function DoubleHearts({ at, className }: OrnamentProps) {
  const r = useReveal<SVGSVGElement>(at)
  return (
    <m.svg {...r} variants={stagger(0.1)} className={className} viewBox="0 0 260 64" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" aria-hidden="true">
      <m.path variants={drawPath} d={heartPath(118.5, 9, 44, 57)} strokeWidth="1.6" />
      <m.path variants={drawPath} d={heartPath(141.5, 9, 44, 57)} strokeWidth="1.6" />
      <Mirror width={260}>
        <m.path variants={drawPath} d="M97 50.5 C85 54.5 72 53 61 47 C52 42 40 40 33 44 C27 47.5 29 55 35 53.5 C39 52.5 38.5 47.5 35 48" />
        <m.path variants={drawPath} d="M80 51.5 C73 48 71.5 40.5 76 37 C80 34 85.5 37.5 83.5 41.5 C82.3 43.8 79 43.5 79 41.5" />
        <m.path variants={drawPath} d="M33 44 C26 39.5 18 39.5 12 43" strokeWidth="1" />
        <m.path variants={drawPath} d="M18 40.5 C14 35 17 30 21.5 31 C25 31.8 25 36 22 36.5" strokeWidth="1.1" />
      </Mirror>
    </m.svg>
  )
}

/** Four-point twinkle. */
export function Sparkle({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 0 C12.8 7.2 16.8 11.2 24 12 C16.8 12.8 12.8 16.8 12 24 C11.2 16.8 7.2 12.8 0 12 C7.2 11.2 11.2 7.2 12 0 Z"
      />
    </svg>
  )
}

/** A small ornament used as a section heading accent outside the card. */
export function MiniFlourish({ at, className }: OrnamentProps) {
  const r = useReveal<SVGSVGElement>(at)
  return (
    <m.svg {...r} variants={stagger(0.08)} className={className} viewBox="0 0 200 30" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
      <m.path variants={popIn} d={heartPath(100, 7, 16, 23)} fill="currentColor" stroke="none" style={{ transformOrigin: '100px 15px' }} />
      <Mirror width={200}>
        <m.path variants={drawPath} d="M88 16 C76 20 64 19 54 14 C46 10 36 9.5 30 13 C25 16 27 22 32 21 C35.5 20.3 35 16.5 32 17" />
        <m.path variants={drawPath} d="M30 13 C22 9.5 13 10 6 14" strokeWidth="0.9" />
      </Mirror>
    </m.svg>
  )
}
