import { useEffect, useRef } from 'react'

type Particle = { x: number; y: number; r: number; vx: number; vy: number; phase: number; twinkle: number }

/** A soft glowing gold dot, drawn once and reused for every particle. */
function makeSprite() {
  const size = 32
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255, 244, 214, 1)')
  grad.addColorStop(0.25, 'rgba(232, 197, 122, 0.9)')
  grad.addColorStop(0.6, 'rgba(201, 152, 72, 0.25)')
  grad.addColorStop(1, 'rgba(201, 152, 72, 0)')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return c
}

/**
 * Gold dust slowly rising and twinkling over the page.
 * Runs at ~30 fps, pauses in background tabs and is off for reduced-motion users.
 */
export function GoldParticles({ intensity }: { intensity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const intensityRef = useRef(intensity)
  intensityRef.current = intensity

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const sprite = makeSprite()
    let w = 0
    let h = 0
    let particles: Particle[] = []
    let raf = 0
    let last = 0
    let level = intensityRef.current

    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const spawn = (anywhere: boolean): Particle => ({
      x: rand(0, w),
      y: anywhere ? rand(0, h) : h + rand(4, 40),
      r: rand(0.7, 2.3),
      vx: rand(-0.12, 0.12),
      vy: -rand(0.12, 0.45),
      phase: rand(0, Math.PI * 2),
      twinkle: rand(0.6, 1.8),
    })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const widthChanged = Math.abs(window.innerWidth - w) > 1
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Mobile browsers resize the height while scrolling (address bar) — keep the dust as is then.
      if (widthChanged || !particles.length) {
        const target = Math.round(Math.min(64, Math.max(22, (w * h) / 15000)))
        particles = Array.from({ length: target }, () => spawn(true))
      }
    }

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame)
      if (t - last < 32) return // ~30 fps is plenty for slow dust
      const dt = Math.min(3, (t - last) / 16.7)
      last = t
      level += (intensityRef.current - level) * 0.04

      ctx.clearRect(0, 0, w, h)
      const visible = Math.round(particles.length * level)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += (p.vx + Math.sin(t * 0.0004 + p.phase) * 0.12) * dt
        p.y += p.vy * dt
        if (p.y < -12 || p.x < -12 || p.x > w + 12) particles[i] = spawn(false)
        if (i >= visible) continue
        const glow = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.0012 * p.twinkle + p.phase))
        const size = p.r * 7
        ctx.globalAlpha = glow * 0.85
        ctx.drawImage(sprite, p.x - size / 2, p.y - size / 2, size, size)
      }
      ctx.globalAlpha = 1
    }

    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(frame)
    }

    resize()
    raf = requestAnimationFrame(frame)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className="particles" aria-hidden="true" />
}
