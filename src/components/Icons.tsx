import { heartPath } from './Ornaments'

/** Line icons matching the card (gold, thin strokes). Decorative only. */

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.35,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

function CalendarFrame() {
  return (
    <>
      <rect x="3.3" y="5" width="17.4" height="15.6" rx="2.3" />
      <path d="M3.3 9.6 H20.7" />
      <path d="M8 3 V7" />
      <path d="M16 3 V7" />
    </>
  )
}

export function CalendarHeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...base}>
      <CalendarFrame />
      <path d={heartPath(12, 11.6, 7.4, 18.4)} fill="currentColor" stroke="none" />
    </svg>
  )
}

export function CalendarDayIcon({ day, className }: { day: string; className?: string }) {
  return (
    <svg className={className} {...base}>
      <CalendarFrame />
      <text
        x="12"
        y="17.7"
        textAnchor="middle"
        fontSize="6.8"
        fontWeight="600"
        fill="currentColor"
        stroke="none"
        style={{ fontFamily: 'Vazirmatn, sans-serif', direction: 'ltr' }}
      >
        {day}
      </text>
    </svg>
  )
}

export function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 3.9 V5.1 M20.1 12 H18.9 M12 20.1 V18.9 M3.9 12 H5.1" strokeWidth="1" />
      {/* hands at three o'clock — "٣ عەسر" */}
      <path className="icon-hand icon-hand--minute" d="M12 12 V6.6" />
      <path className="icon-hand icon-hand--hour" d="M12 12 H15.6" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...base}>
      <path d="M12 19.6 C12 19.6 18.2 13.9 18.2 9.3 C18.2 5.9 15.4 3.2 12 3.2 C8.6 3.2 5.8 5.9 5.8 9.3 C5.8 13.9 12 19.6 12 19.6 Z" />
      <circle cx="12" cy="9.3" r="2.5" />
      <path d="M8.2 18.1 C5.6 18.5 4 19.3 4 20.2 C4 21.6 7.6 22.6 12 22.6 C16.4 22.6 20 21.6 20 20.2 C20 19.3 18.4 18.5 15.8 18.1" />
    </svg>
  )
}
