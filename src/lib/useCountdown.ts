import { useEffect, useState } from 'react'

export type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
  /** 'before' the start time, 'today' on the wedding day after it starts, 'after' from the next day. */
  phase: 'before' | 'today' | 'after'
}

function compute(target: number): Countdown {
  const now = Date.now()
  const diff = target - now
  if (diff <= 0) {
    const sameDay = now - target < 12 * 60 * 60 * 1000
    return { days: 0, hours: 0, minutes: 0, seconds: 0, phase: sameDay ? 'today' : 'after' }
  }
  const s = Math.floor(diff / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    phase: 'before',
  }
}

/** Ticks once per second, aligned to the start of each second. */
export function useCountdown(isoDate: string): Countdown {
  const target = new Date(isoDate).getTime()
  const [value, setValue] = useState(() => compute(target))

  useEffect(() => {
    let timer: number
    const tick = () => {
      setValue(compute(target))
      timer = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 5)
    }
    tick()
    return () => window.clearTimeout(timer)
  }, [target])

  return value
}
