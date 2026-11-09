import { m, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { text } from '../config/text'
import { wedding } from '../config/wedding'
import { useReveal } from '../lib/intro'
import { childFadeUp, ease, popIn, stagger, wipeRtl } from '../lib/motion'
import { FrameBorder } from './FrameBorder'
import { CalendarDayIcon, CalendarHeartIcon, ClockIcon, PinIcon } from './Icons'
import { Names } from './Names'
import { DividerMedallion, DoubleHearts, NamesFlourish, SmallHeart, Sparkle, TopFleur } from './Ornaments'

/**
 * Timeline (seconds after the guest taps "بەخێربێیت").
 * Everything below the fold waits until it is scrolled into view.
 */
const T = {
  flowersTop: 0.25,
  fleur: 0.8,
  basmala: 1.1,
  divider: 1.7,
  intro: 2.0,
  heart: 2.6,
  names: 2.8,
  flourish: 4.4,
  details: 4.7,
  bottomHeart: 5.5,
  doubleHearts: 5.6,
  flowersBottom: 0.9,
}

/** Corner bouquets: bloom open, then sway gently for as long as the page is open. */
const bloom = (corner: 'tl' | 'br'): Variants => ({
  hidden: { opacity: 0, scale: 0.72, rotate: corner === 'tl' ? -7 : 7 },
  show: (d: number = 0) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { delay: d, duration: 2.6, ease: ease.out, opacity: { delay: d, duration: 1.4 } },
  }),
})

function FlowerCorner({ corner, at }: { corner: 'tl' | 'br'; at: number }) {
  const r = useReveal<HTMLDivElement>(at, 0.05)
  return (
    <m.div
      {...r}
      variants={bloom(corner)}
      className={`flowers flowers--${corner}`}
      style={corner === 'tl' ? { originX: 0, originY: 0 } : { originX: 1, originY: 1 }}
      aria-hidden="true"
    >
      <div className="flowers__sway">
        <img src={`/images/flowers-${corner}.webp`} alt="" draggable={false} decoding="async" />
      </div>
    </m.div>
  )
}

/** Splits a sentence into words so it can appear word by word (safe for Arabic script joining). */
function Words({ children }: { children: string }) {
  const words = children.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          <m.span variants={childFadeUp} className="word">
            {word}
          </m.span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </>
  )
}

function RevealText({ at, className, children }: { at: number; className: string; children: string }) {
  const r = useReveal<HTMLParagraphElement>(at)
  return (
    <m.p {...r} variants={stagger(0.07)} className={className}>
      <Words>{children}</Words>
    </m.p>
  )
}

function Heart({ at, className }: { at: number; className: string }) {
  const r = useReveal<HTMLDivElement>(at)
  return (
    <m.div {...r} variants={stagger()} className={className} aria-hidden="true">
      <m.div variants={popIn}>
        <SmallHeart className="float-heart" />
      </m.div>
    </m.div>
  )
}

function Basmala({ at }: { at: number }) {
  // Observe the wrapper: an element hidden by its own clip-path never counts as "in view".
  const { ref, ...anim } = useReveal<HTMLDivElement>(at)
  return (
    <div ref={ref} className="basmala-wrap">
      <m.div {...anim} variants={wipeRtl} className="basmala" role="img" aria-label={text.card.basmala} />
    </div>
  )
}

const rowIn: Variants = {
  hidden: { opacity: 0, x: 26 },
  show: { opacity: 1, x: 0, transition: { duration: 1, ease: ease.out } },
}
const iconIn: Variants = {
  hidden: { opacity: 0, scale: 0.4, rotate: -12 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 13 } },
}

type Row = { icon: ReactNode; label: string; value: string; ltr?: boolean }

function Details({ at }: { at: number }) {
  const r = useReveal<HTMLUListElement>(at, 0.15)
  const rows: Row[] = [
    { icon: <CalendarHeartIcon />, label: text.card.labels.day, value: wedding.dayName },
    { icon: <CalendarDayIcon day={wedding.dateDay} />, label: text.card.labels.date, value: wedding.dateText, ltr: true },
    { icon: <ClockIcon />, label: text.card.labels.time, value: wedding.timeText },
    { icon: <PinIcon />, label: text.card.labels.place, value: wedding.venue.name },
  ]
  return (
    <m.ul {...r} variants={stagger(0.22)} className="details">
      {rows.map((row, i) => (
        <m.li key={row.label} variants={rowIn} className="details__row">
          <span className="details__dot" aria-hidden="true">
            <SmallHeart />
          </span>
          <m.span variants={iconIn} className="details__icon" aria-hidden="true">
            {row.icon}
          </m.span>
          <span className="details__label">{row.label}</span>
          <span className="details__value">
            <span dir={row.ltr ? 'ltr' : undefined}>{row.value}</span>
          </span>
          {i < rows.length - 1 && (
            <span className="details__sep" aria-hidden="true">
              <SmallHeart />
            </span>
          )}
        </m.li>
      ))}
    </m.ul>
  )
}

/** A few twinkles scattered over the card (purely decorative). */
const SPARKLES = [
  { top: '7%', left: '39%', size: 9, delay: 1.2 },
  { top: '12.5%', left: '71%', size: 12, delay: 2.4 },
  { top: '21%', left: '22%', size: 8, delay: 3.6 },
  { top: '33%', left: '80%', size: 10, delay: 0.6 },
  { top: '38%', left: '18%', size: 13, delay: 4.4 },
  { top: '56%', left: '84%', size: 8, delay: 2.9 },
  { top: '74%', left: '13%', size: 10, delay: 1.8 },
  { top: '91%', left: '36%', size: 9, delay: 3.2 },
]

export function InvitationCard() {
  return (
    <section className="card" aria-label={text.loader.eyebrow}>
      <div className="card__frame-box">
        <FrameBorder />
      </div>
      <FlowerCorner corner="tl" at={T.flowersTop} />
      <FlowerCorner corner="br" at={T.flowersBottom} />

      <div className="card__content">
        <TopFleur at={T.fleur} className="card__fleur" />
        <Basmala at={T.basmala} />
        <DividerMedallion at={T.divider} className="card__divider" />
        <RevealText at={T.intro} className="card__intro">
          {text.card.intro}
        </RevealText>
        <Heart at={T.heart} className="card__heart" />
        <Names at={T.names} />
        <NamesFlourish at={T.flourish} className="card__flourish" />
        <Details at={T.details} />
        <Heart at={T.bottomHeart} className="card__heart card__heart--bottom" />
        <DoubleHearts at={T.doubleHearts} className="card__double" />
      </div>

      <div className="sparkles" aria-hidden="true">
        {SPARKLES.map((s, i) => (
          <Sparkle
            key={i}
            className="sparkle"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: `${s.delay + 3}s` }}
          />
        ))}
      </div>
    </section>
  )
}
