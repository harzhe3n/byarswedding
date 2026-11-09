import { useEffect, useState } from 'react'

type Options = {
  images: string[]
  /** [CSS font shorthand, sample text] — the sample picks the right unicode-range file. */
  fonts: Array<[font: string, sample: string]>
  /** Keep the loading screen visible at least this long so its blooming animation can play. */
  minDuration: number
  /** Never block the guest longer than this, even on a very slow connection. */
  maxDuration: number
}

/** Loads the images and fonts the invitation needs, reporting progress from 0 to 1. */
export function usePreload({ images, fonts, minDuration, maxDuration }: Options) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    const total = images.length + fonts.length
    let loaded = 0
    const step = () => {
      loaded += 1
      if (!cancelled) setProgress(loaded / total)
    }

    const imageTasks = images.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.decoding = 'async'
          img.src = src
          img
            .decode()
            .catch(() => undefined)
            .finally(() => {
              step()
              resolve()
            })
        }),
    )
    const fontTasks = fonts.map(([font, sample]) =>
      (document.fonts?.load(font, sample) ?? Promise.resolve())
        .catch(() => undefined)
        .finally(step),
    )

    const minWait = new Promise((r) => setTimeout(r, minDuration))
    const all = Promise.all([...imageTasks, ...fontTasks])
    const cap = new Promise((r) => setTimeout(r, maxDuration))

    Promise.all([minWait, Promise.race([all, cap])]).then(() => {
      if (!cancelled) {
        setProgress(1)
        setDone(true)
      }
    })
    return () => {
      cancelled = true
    }
    // The asset lists are static.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { progress, done }
}
