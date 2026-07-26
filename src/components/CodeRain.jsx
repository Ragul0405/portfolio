import { useEffect, useRef } from 'react'

/* Site-wide falling Python / Django tokens. Fixed to the viewport and pinned
   behind every section, so it keeps raining as you scroll. Reads --accent and
   --text from the live theme, so it recolours with the light/dark toggle
   instead of hard-coding either palette. */

const TOKENS = [
  // python keywords
  'def', 'self', 'class', 'import', 'from', 'return', 'async', 'await',
  'None', 'True', 'False', 'try', 'except', 'yield', 'lambda', 'with',
  'raise', 'pass', 'super()', '__init__',
  // django / drf
  'models', 'views', 'urls', 'serializers', 'QuerySet', 'objects',
  '.filter()', '.get()', '.all()', '.save()', 'migrate', 'ForeignKey',
  'CharField', 'APIView', 'ViewSet', 'ModelSerializer', '@api_view',
  'IsAuthenticated', 'settings', 'admin', 'signals', 'middleware',
  // api / infra
  'GET', 'POST', 'PATCH', 'DELETE', '200 OK', '201', '204', '400', '401',
  '404', 'JWT', 'token', 'postgres', 'psycopg2', 'redis', 'celery',
  'venv', 'pytest', 'gunicorn', 'requirements',
]

const COL_W = 104     // px between columns — wide enough for the longest token
const ROW_H = 19      // px between tokens in a column
const TRAIL = 8       // tokens drawn above the head
const MAX_DPR = 2
const CENTRE_DAMP = 0.3   // strength of the rain in the middle reading column

export default function CodeRain({ theme }) {
  const canvasRef = useRef(null)
  const colsRef = useRef([])
  const colorRef = useRef({ accent: '#ff3a5e', text: '#ece9f0', alpha: 0.28 })
  const drawRef = useRef(null)

  /* Re-read theme colours whenever the palette flips, then repaint — the rAF
     loop would pick it up on its own, but not when motion is reduced. */
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return

    const cs = getComputedStyle(el)
    const dark = document.documentElement.classList.contains('dark')

    colorRef.current = {
      accent: cs.getPropertyValue('--accent').trim() || '#ff3a5e',
      text: cs.getPropertyValue('--text').trim() || '#ece9f0',
      // kept low: this now sits behind every section, not just the hero
      alpha: dark ? 0.26 : 0.15,
    }

    if (drawRef.current) drawRef.current()
  }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    let raf = 0

    const rand = (n) => Math.floor(Math.random() * n)
    const token = () => TOKENS[rand(TOKENS.length)]

    const seed = () => {
      const count = Math.ceil(w / COL_W) + 1
      colsRef.current = Array.from({ length: count }, () => ({
        // spread heads across the visible height so the effect is fully
        // formed on first paint rather than raining in from above
        y: rand(h + TRAIL * ROW_H) - TRAIL * ROW_H,
        speed: 0.3 + Math.random() * 0.7,
        words: Array.from({ length: TRAIL + 1 }, token),
        swap: 0,
      }))
    }

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      if (!r.width || !r.height) return
      w = r.width
      h = r.height
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
      draw()
    }

    const draw = () => {
      if (!w || !h) return
      const { accent, text, alpha } = colorRef.current
      ctx.clearRect(0, 0, w, h)
      ctx.font = '500 12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
      ctx.textBaseline = 'top'

      const cols = colsRef.current
      const mid = w / 2

      for (let i = 0; i < cols.length; i++) {
        const c = cols[i]
        const x = i * COL_W + 6

        /* Damp the centre columns: every section's reading column lives there,
           and tokens were colliding with body copy and bleeding through the
           transparent skill pills. Edges stay at full strength. */
        const bias = CENTRE_DAMP +
          (1 - CENTRE_DAMP) * Math.min(1, Math.abs(x - mid) / (w * 0.42))

        for (let t = 0; t <= TRAIL; t++) {
          const y = c.y - t * ROW_H
          if (y < -ROW_H || y > h) continue

          // head is brightest and accent-coloured; tail fades to text colour
          const fade = 1 - t / (TRAIL + 1)
          const isHead = t === 0
          ctx.fillStyle = isHead ? accent : text
          ctx.globalAlpha = alpha * fade * bias * (isHead ? 1.6 : 1)
          ctx.fillText(c.words[t], x, y)
        }
      }
      ctx.globalAlpha = 1
    }

    const step = () => {
      const cols = colsRef.current
      for (let i = 0; i < cols.length; i++) {
        const c = cols[i]
        c.y += c.speed
        // recycle once the whole trail has cleared the bottom, re-entering
        // just above the top edge so nothing pops in mid-screen
        if (c.y - TRAIL * ROW_H > h) {
          c.y = -TRAIL * ROW_H - rand(h * 0.5)
          c.speed = 0.3 + Math.random() * 0.7
        }
        // occasionally swap a token so the columns feel alive
        if (++c.swap > 26) {
          c.swap = 0
          c.words[rand(c.words.length)] = token()
        }
      }
      draw()
    }

    const loop = () => {
      if (!document.hidden) step()
      raf = requestAnimationFrame(loop)
    }

    drawRef.current = draw
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    if (reduce) {
      draw()            // one static frame, no animation
    } else {
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      drawRef.current = null
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)',
      }}
    />
  )
}
