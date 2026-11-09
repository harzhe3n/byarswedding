import type { Variants } from 'framer-motion'

/** Shared easing curves — slow, soft and "expensive" feeling. */
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  soft: [0.4, 0, 0.2, 1] as const,
}

/** Fade up into place. `custom` = delay in seconds. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (d: number = 0) => ({ opacity: 1, y: 0, transition: { delay: d, duration: 1.1, ease: ease.out } }),
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: (d: number = 0) => ({ opacity: 1, transition: { delay: d, duration: 1.2, ease: ease.soft } }),
}

/** Parent that only orchestrates its children (stagger after the resolved delay). */
export const stagger = (gap = 0.12): Variants => ({
  hidden: {},
  show: (d: number = 0) => ({ transition: { delayChildren: d, staggerChildren: gap } }),
})

/** Child of `stagger`: fades up. */
export const childFadeUp: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: ease.out } },
}

/** Child of `stagger` inside an <svg>: draws a stroke. */
export const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.6, ease: ease.inOut }, opacity: { duration: 0.3 } },
  },
}

/** Child of `stagger` inside an <svg>: a filled shape that blooms open. */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 14 } },
}

/** Reveals right-to-left, the direction Kurdish is written. */
export const wipeRtl: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(0% 0% 0% 100%)' },
  show: (d: number = 0) => ({
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { delay: d, duration: 1.8, ease: ease.inOut, opacity: { delay: d, duration: 0.4 } },
  }),
}
