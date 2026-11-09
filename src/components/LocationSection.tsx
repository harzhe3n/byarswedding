import { m } from 'framer-motion'
import { text } from '../config/text'
import { mapsDirectionsUrl, mapsEmbedUrl, wedding } from '../config/wedding'
import { useIntro, useReveal } from '../lib/intro'
import { childFadeUp, fadeUp, stagger } from '../lib/motion'
import { MiniFlourish } from './Ornaments'
import { PinIcon } from './Icons'

/** Gold map pin that drops in, then gently bobs above a pulsing ripple. */
function AnimatedPin() {
  return (
    <div className="pin" aria-hidden="true">
      <span className="pin__ripple" />
      <span className="pin__ripple pin__ripple--late" />
      <svg className="pin__shape" viewBox="0 0 48 64">
        <defs>
          <linearGradient id="pin-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e9cf93" />
            <stop offset="0.5" stopColor="#b8893f" />
            <stop offset="1" stopColor="#8f6220" />
          </linearGradient>
        </defs>
        <path
          fill="url(#pin-gold)"
          d="M24 62 C24 62 45 40.5 45 23.5 C45 11.6 35.6 2 24 2 C12.4 2 3 11.6 3 23.5 C3 40.5 24 62 24 62 Z"
        />
        <circle cx="24" cy="23.5" r="9.5" fill="#f7efe4" />
        <path fill="#b8893f" d="M24 30.5 C19.6 27 17.3 24.8 17.3 22.2 C17.3 20.3 18.8 18.8 20.6 18.8 C21.9 18.8 23.2 19.6 24 20.8 C24.8 19.6 26.1 18.8 27.4 18.8 C29.2 18.8 30.7 20.3 30.7 22.2 C30.7 24.8 28.4 27 24 30.5 Z" />
      </svg>
    </div>
  )
}

export function LocationSection() {
  const title = useReveal<HTMLHeadingElement>(0)
  const body = useReveal<HTMLDivElement>(0.1)
  // Start loading the map as soon as the invitation opens (not while the welcome screen loads).
  const { play } = useIntro()

  return (
    <section className="panel location" aria-labelledby="location-title">
      <MiniFlourish at={0} className="panel__ornament" />
      <m.h2 {...title} variants={fadeUp} id="location-title" className="panel__title">
        {text.location.title}
      </m.h2>

      <m.div {...body} variants={stagger(0.14)} className="location__body">
        <m.div variants={childFadeUp}>
          <AnimatedPin />
        </m.div>
        <m.p variants={childFadeUp} className="location__venue">
          {wedding.venue.name}
        </m.p>
        {wedding.venue.address && (
          <m.p variants={childFadeUp} className="location__address">
            {wedding.venue.address}
          </m.p>
        )}
        <m.p variants={childFadeUp} className="location__when">
          {wedding.dayName} · <span dir="ltr">{wedding.dateText}</span> · {wedding.timeText}
        </m.p>

        {/* Not animated and loaded in advance, so the map is already there when guests scroll to it. */}
        <div className="location__map">
          {play && (
            <iframe
              src={mapsEmbedUrl}
              title={text.location.mapTitle}
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          )}
        </div>

        <m.div variants={childFadeUp}>
          <a
            className="btn-gold"
            href={mapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="btn-gold__shine" aria-hidden="true" />
            <PinIcon className="btn-gold__icon" />
            {text.location.button}
          </a>
        </m.div>
      </m.div>
    </section>
  )
}
