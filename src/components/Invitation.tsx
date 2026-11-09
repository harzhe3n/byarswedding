import { useIntro } from '../lib/intro'
import { Countdown } from './Countdown'
import { Footer } from './Footer'
import { InvitationCard } from './InvitationCard'
import { LocationSection } from './LocationSection'

/** The full invitation page: the card, then countdown and location. */
export function Invitation({ visitors }: { visitors: number | null }) {
  const { play } = useIntro()
  return (
    <main className={`page ${play ? 'is-playing' : ''}`}>
      <div className="sheet">
        <InvitationCard />
        <Countdown visitors={visitors} />
        <LocationSection />
        <Footer />
      </div>
    </main>
  )
}
