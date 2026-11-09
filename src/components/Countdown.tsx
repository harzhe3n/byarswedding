import { AnimatePresence, m } from 'framer-motion'
import { text } from '../config/text'
import { wedding } from '../config/wedding'
import { useReveal } from '../lib/intro'
import { childFadeUp, ease, fadeUp, stagger } from '../lib/motion'
import { useCountdown } from '../lib/useCountdown'
import { MiniFlourish } from './Ornaments'
import { VisitorCounter } from './VisitorCounter'

function Digit({ value, minLength }: { value: number; minLength: number }) {
  return (
    <span className="countdown__digits">
      <AnimatePresence initial={false}>
        <m.span
          key={value}
          className="countdown__num"
          initial={{ y: '-55%', opacity: 0, filter: 'blur(3px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '55%', opacity: 0, filter: 'blur(3px)' }}
          transition={{ duration: 0.65, ease: ease.out }}
        >
          {String(value).padStart(minLength, '0')}
        </m.span>
      </AnimatePresence>
    </span>
  )
}

export function Countdown({ visitors }: { visitors: number | null }) {
  const c = useCountdown(wedding.startsAt)
  const title = useReveal<HTMLHeadingElement>(0)
  const grid = useReveal<HTMLDivElement>(0.15)

  const units = [
    { value: c.days, label: text.countdown.days, min: 2 },
    { value: c.hours, label: text.countdown.hours, min: 2 },
    { value: c.minutes, label: text.countdown.minutes, min: 2 },
    { value: c.seconds, label: text.countdown.seconds, min: 2 },
  ]

  return (
    <section className="panel countdown" aria-labelledby="countdown-title">
      <MiniFlourish at={0} className="panel__ornament" />
      <m.h2 {...title} variants={fadeUp} id="countdown-title" className="panel__title">
        {c.phase === 'before' ? text.countdown.title : c.phase === 'today' ? text.countdown.today : text.countdown.after}
      </m.h2>

      {c.phase === 'before' && (
        <m.div {...grid} variants={stagger(0.12)} className="countdown__grid" role="timer" dir="ltr">
          {units.map((u) => (
            <m.div key={u.label} variants={childFadeUp} className="countdown__unit">
              <div className="countdown__box">
                <Digit value={u.value} minLength={u.min} />
              </div>
              <span className="countdown__label">{u.label}</span>
            </m.div>
          ))}
        </m.div>
      )}

      <VisitorCounter count={visitors} />
    </section>
  )
}
