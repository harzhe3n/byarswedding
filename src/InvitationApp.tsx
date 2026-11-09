import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion'
import { useEffect, useState } from 'react'
import { GoldParticles } from './components/GoldParticles'
import { Invitation } from './components/Invitation'
import { LoadingScreen } from './components/LoadingScreen'
import { PetalField, SharedSvgDefs } from './components/PetalField'
import { registerVisitAndCount } from './lib/analytics'
import { IntroProvider } from './lib/intro'
import { usePreload } from './lib/usePreload'

const IMAGES = ['/images/flowers-tl.webp', '/images/flowers-br.webp', '/images/basmala.webp']
const FONTS: Array<[string, string]> = [
  ['400 1em Vazirmatn', 'ئێمە'],
  ['600 1em Vazirmatn', '2026'],
  ['400 1em Amiri', 'بیار لەنیا'],
  ['500 1em "Cormorant Garamond"', '&'],
]

type Stage = 'loading' | 'opening' | 'open'

export default function InvitationApp() {
  const { progress, done } = usePreload({ images: IMAGES, fonts: FONTS, minDuration: 3400, maxDuration: 9000 })
  const [stage, setStage] = useState<Stage>('loading')
  const [play, setPlay] = useState(false)
  const [visitors, setVisitors] = useState<number | null>(null)

  useEffect(() => {
    registerVisitAndCount().then(setVisitors)
  }, [])

  // The page stays still behind the welcome screen.
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', stage !== 'open')
  }, [stage])

  const enter = () => {
    if (stage !== 'loading') return
    window.scrollTo(0, 0)
    setStage('opening')
    // Start the invitation's entrance as the doors begin to part.
    window.setTimeout(() => setPlay(true), 600)
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <SharedSvgDefs />
        <IntroProvider play={play}>
          <Invitation visitors={visitors} />
          <PetalField active={play} />
        </IntroProvider>
        <GoldParticles intensity={stage === 'loading' ? 1 : 0.5} />
        {stage !== 'open' && (
          <LoadingScreen
            progress={progress}
            ready={done}
            opening={stage === 'opening'}
            onEnter={enter}
            onOpened={() => setStage('open')}
          />
        )}
      </MotionConfig>
    </LazyMotion>
  )
}
