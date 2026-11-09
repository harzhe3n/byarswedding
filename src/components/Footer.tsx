import { m } from 'framer-motion'
import { text } from '../config/text'
import { wedding } from '../config/wedding'
import { useReveal } from '../lib/intro'
import { fadeUp } from '../lib/motion'
import { DoubleHearts } from './Ornaments'

export function Footer() {
  const r = useReveal<HTMLDivElement>(0.2)
  return (
    <footer className="footer">
      <DoubleHearts at={0} className="footer__ornament" />
      <m.div {...r} variants={fadeUp}>
        <p className="footer__love">{text.footer.withLove}</p>
        <p className="footer__names">
          {wedding.groom} <span className="footer__amp">&amp;</span> {wedding.bride}
        </p>
      </m.div>
    </footer>
  )
}
