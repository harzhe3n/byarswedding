import { m, type Variants } from 'framer-motion'
import { wedding } from '../config/wedding'
import { useReveal } from '../lib/intro'
import { ease, stagger } from '../lib/motion'
import { SmallHeart } from './Ornaments'

/** Each name is "written" right-to-left with a soft ink blur, like calligraphy. */
const nameWrite: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(0% 0% 0% 100%)', filter: 'blur(10px)', y: 6 },
  show: {
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    filter: 'blur(0px)',
    y: 0,
    transition: {
      duration: 1.9,
      ease: ease.inOut,
      opacity: { duration: 0.5 },
      filter: { duration: 1.4, ease: ease.out },
    },
  },
}

const ampBloom: Variants = {
  hidden: { opacity: 0, scale: 0.2, rotate: -35 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 120, damping: 11, mass: 0.9 } },
}

export function Names({ at }: { at: number }) {
  const r = useReveal<HTMLHeadingElement>(at)
  return (
    <m.h1 {...r} variants={stagger(0.75)} className="names">
      <m.span variants={nameWrite} className="names__name">
        {wedding.groom}
      </m.span>{' '}
      <m.span variants={ampBloom} className="names__amp">
        &amp;
      </m.span>{' '}
      <m.span variants={nameWrite} className="names__name">
        {wedding.bride}
      </m.span>
      <span className="names__hearts" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <SmallHeart key={i} className={`names__float names__float--${i + 1}`} />
        ))}
      </span>
    </m.h1>
  )
}
