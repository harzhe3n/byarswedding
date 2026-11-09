import { AnimatePresence, m, type Variants } from 'framer-motion'
import { text } from '../config/text'
import { wedding } from '../config/wedding'
import { IntroProvider } from '../lib/intro'
import { toKurdishDigits } from '../lib/kurdish'
import { childFadeUp, ease, stagger } from '../lib/motion'
import { heartPath, TopFleur } from './Ornaments'

type Props = {
  progress: number
  ready: boolean
  opening: boolean
  onEnter: () => void
  onOpened: () => void
}

const DOORS = { duration: 1.7, ease: [0.76, 0, 0.2, 1] as const, delay: 0.45 }

const ring: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (d: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { delay: d, duration: 2.2, ease: ease.inOut, opacity: { delay: d, duration: 0.3 } },
  }),
}

function Monogram() {
  return (
    <div className="monogram">
      <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" aria-hidden="true">
        <m.circle cx="100" cy="100" r="92" strokeWidth="1.3" variants={ring} initial="hidden" animate="show" custom={0.2} transform="rotate(-90 100 100)" />
        <m.circle cx="100" cy="100" r="86" strokeWidth="0.7" variants={ring} initial="hidden" animate="show" custom={0.5} transform="rotate(90 100 100)" />
        <m.path
          d={heartPath(100, 1.5, 11, 12)}
          fill="currentColor"
          stroke="none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.1, type: 'spring', stiffness: 220, damping: 12 }}
          style={{ transformOrigin: '100px 7px' }}
        />
        {[
          [8, 100],
          [192, 100],
          [100, 192],
        ].map(([x, y], i) => (
          <m.path
            key={i}
            d={`M${x} ${y - 3.2} L${x + 3.2} ${y} L${x} ${y + 3.2} L${x - 3.2} ${y} Z`}
            fill="currentColor"
            stroke="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3 + i * 0.1, duration: 0.6 }}
          />
        ))}
      </svg>
      <m.p
        className="monogram__names"
        initial={{ opacity: 0, clipPath: 'inset(0% 0% 0% 100%)', filter: 'blur(8px)' }}
        animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', filter: 'blur(0px)' }}
        transition={{ delay: 1.1, duration: 2, ease: ease.inOut }}
      >
        {wedding.groom} <span className="monogram__amp">&amp;</span> {wedding.bride}
      </m.p>
    </div>
  )
}

function WelcomeWords() {
  const words = text.loader.welcome.split(' ')
  return (
    <m.p className="loader__welcome" variants={stagger(0.09)} initial="hidden" animate="show" custom={2.2}>
      {words.map((w, i) => (
        <span key={i}>
          <m.span variants={childFadeUp} className="word">
            {w}
          </m.span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </m.p>
  )
}

export function LoadingScreen({ progress, ready, opening, onEnter, onOpened }: Props) {
  return (
    <div className="loader" aria-busy={!ready}>
      <m.div className="loader__door loader__door--left" animate={{ x: opening ? '-100%' : '0%' }} transition={DOORS} />
      <m.div
        className="loader__door loader__door--right"
        animate={{ x: opening ? '100%' : '0%' }}
        transition={DOORS}
        onAnimationComplete={() => {
          if (opening) onOpened()
        }}
      />
      <m.div
        className="loader__seam"
        initial={{ opacity: 0 }}
        animate={opening ? { opacity: [0, 1, 0], scaleY: [0.4, 1, 1] } : { opacity: 0 }}
        transition={{ duration: 1.3, times: [0, 0.35, 1], delay: 0.2 }}
      />

      {/* The bouquets bloom in, then leave with their door. */}
      <m.div className="loader__flowers loader__flowers--tl" animate={{ x: opening ? '-60vw' : '0vw' }} transition={DOORS}>
        <div className="loader__bloom loader__bloom--tl">
          <img src="/images/flowers-tl.webp" alt="" draggable={false} />
        </div>
      </m.div>
      <m.div className="loader__flowers loader__flowers--br" animate={{ x: opening ? '60vw' : '0vw' }} transition={DOORS}>
        <div className="loader__bloom loader__bloom--br">
          <img src="/images/flowers-br.webp" alt="" draggable={false} />
        </div>
      </m.div>

      <m.div
        className="loader__content"
        animate={opening ? { opacity: 0, y: -18, filter: 'blur(6px)' } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: ease.soft }}
      >
        <IntroProvider play>
          <TopFleur at={0.1} className="loader__fleur" />
          <Monogram />
          <m.p
            className="loader__eyebrow"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 1, ease: ease.out }}
          >
            {text.loader.eyebrow}
          </m.p>
          <WelcomeWords />

          <div className="loader__action">
            <AnimatePresence mode="wait" initial={false}>
              {!ready ? (
                <m.div
                  key="progress"
                  className="loader__progress"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.6 } }}
                  exit={{ opacity: 0, y: -6, transition: { duration: 0.35 } }}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress * 100)}
                  aria-label={text.loader.preparing}
                >
                  <div className="progress">
                    <m.div
                      className="progress__fill"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: Math.max(0.04, progress) }}
                      transition={{ duration: 0.8, ease: ease.out }}
                    />
                  </div>
                  <span className="progress__text">
                    {text.loader.preparing}
                    <span className="progress__dots" aria-hidden="true" />
                    <span className="progress__pct">{toKurdishDigits(Math.round(progress * 100))}٪</span>
                  </span>
                </m.div>
              ) : (
                <m.button
                  key="enter"
                  type="button"
                  className="btn-gold btn-gold--enter btn-gold--pulse"
                  onClick={onEnter}
                  disabled={opening}
                  initial={{ opacity: 0, y: 10, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, ease: ease.out }}
                >
                  <span className="btn-gold__shine" aria-hidden="true" />
                  {text.loader.enter}
                </m.button>
              )}
            </AnimatePresence>
          </div>
        </IntroProvider>
      </m.div>
    </div>
  )
}
