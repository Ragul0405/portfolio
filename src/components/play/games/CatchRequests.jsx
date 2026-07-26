import { useEffect, useRef, useState } from 'react'
import { GameShell, Btn } from '../GameShell.jsx'

/* Requests fall from the top; slide your server along the bottom to catch them.
   Drop three and you're a 503. Mouse, touch, or arrow keys. */

const W = 320
const H = 220
const PAD_W = 62
const PAD_H = 9
const VERBS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

export default function CatchRequests() {
  const canvasRef = useRef(null)
  const sim = useRef(null)
  const raf = useRef(0)

  const [score, setScore] = useState(0)
  const [dropped, setDropped] = useState(0)
  const [phase, setPhase] = useState('idle')

  const reset = () => {
    sim.current = {
      padX: W / 2 - PAD_W / 2,
      reqs: [],
      spawnAt: 0,
      speed: 0.7,
      last: 0,
      running: false,
      score: 0,
      dropped: 0,
    }
    setScore(0); setDropped(0); setPhase('idle')
  }

  useEffect(() => { reset() }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const tk = () => {
      const cs = getComputedStyle(canvas)
      return {
        accent: cs.getPropertyValue('--accent').trim() || '#d41e3c',
        text: cs.getPropertyValue('--text').trim() || '#16131a',
        muted: cs.getPropertyValue('--muted').trim() || '#6b6770',
        line: cs.getPropertyValue('--line').trim() || 'rgba(0,0,0,.09)',
      }
    }

    const loop = (ts) => {
      raf.current = requestAnimationFrame(loop)
      const s = sim.current
      if (!s) return
      if (!s.last) s.last = ts
      const dt = Math.min(48, ts - s.last)
      s.last = ts

      if (s.running) {
        s.spawnAt -= dt
        if (s.spawnAt <= 0) {
          s.spawnAt = 620 + Math.random() * 480
          s.reqs.push({
            x: 18 + Math.random() * (W - 60),
            y: -12,
            verb: VERBS[Math.floor(Math.random() * VERBS.length)],
          })
        }
        s.speed = 0.7 + s.score * 0.022

        for (let i = s.reqs.length - 1; i >= 0; i--) {
          const r = s.reqs[i]
          r.y += s.speed * (dt / 16)
          const atPad = r.y + 8 >= H - PAD_H - 6 && r.y <= H - 4
          if (atPad && r.x + 26 > s.padX && r.x < s.padX + PAD_W) {
            s.reqs.splice(i, 1)
            s.score++
            setScore(s.score)
          } else if (r.y > H) {
            s.reqs.splice(i, 1)
            s.dropped++
            setDropped(s.dropped)
            if (s.dropped >= 3) { s.running = false; setPhase('over') }
          }
        }
      }

      const { accent, text, muted, line } = tk()
      ctx.clearRect(0, 0, W, H)

      ctx.strokeStyle = line
      ctx.lineWidth = 1
      for (let y = 0; y < H; y += 22) {
        ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke()
      }

      ctx.font = '600 10px ui-monospace, Menlo, monospace'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      s.reqs.forEach((r) => {
        ctx.fillStyle = accent
        ctx.globalAlpha = 0.16
        ctx.fillRect(r.x - 3, r.y - 2, 32, 14)
        ctx.globalAlpha = 1
        ctx.fillStyle = accent
        ctx.fillText(r.verb, r.x, r.y)
      })

      ctx.fillStyle = text
      ctx.fillRect(s.padX, H - PAD_H - 4, PAD_W, PAD_H)
      ctx.fillStyle = muted
      ctx.font = '600 8px ui-monospace, Menlo, monospace'
      ctx.textAlign = 'center'
      ctx.fillText('server', s.padX + PAD_W / 2, H - PAD_H - 15)

      return undefined
    }

    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  const movePad = (clientX) => {
    const canvas = canvasRef.current
    const s = sim.current
    if (!canvas || !s) return
    const r = canvas.getBoundingClientRect()
    const rel = ((clientX - r.left) / r.width) * W
    s.padX = Math.max(0, Math.min(W - PAD_W, rel - PAD_W / 2))
  }

  const start = () => {
    reset()
    const s = sim.current
    s.running = true
    s.last = 0
    setPhase('playing')
    canvasRef.current?.focus()
  }

  const onKeyDown = (e) => {
    const s = sim.current
    if (!s) return
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    s.padX = Math.max(0, Math.min(W - PAD_W, s.padX + (e.key === 'ArrowLeft' ? -26 : 26)))
  }

  return (
    <GameShell
      label="Catch the Requests"
      stats={[
        { label: 'served', value: score },
        { label: 'dropped', value: `${dropped}/3` },
      ]}
      action={<Btn onClick={start}>{phase === 'playing' ? 'Restart' : phase === 'over' ? 'Again' : 'Start'}</Btn>}
      note="Move with the mouse, drag on touch, or arrow keys. Three drops and you're a 503."
    >
      <div className="relative mx-auto w-full" style={{ maxWidth: W }}>
        <canvas
          ref={canvasRef}
          tabIndex={0}
          onMouseMove={(e) => movePad(e.clientX)}
          onTouchMove={(e) => movePad(e.touches[0].clientX)}
          onKeyDown={onKeyDown}
          onClick={() => canvasRef.current?.focus()}
          aria-label="Catch the requests game"
          style={{ aspectRatio: `${W} / ${H}` }}
          className="w-full touch-none rounded-[10px] border border-line bg-bg-2 outline-none focus-visible:border-accent"
        />

        {phase !== 'playing' && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-[10px] bg-bg/80 text-center backdrop-blur-[2px]">
            <span className="font-display text-[1.05rem] font-bold">
              {phase === 'over' ? `503 — served ${score}` : 'Keep the service up'}
            </span>
            <span className="font-mono text-[0.66rem] text-muted">
              {phase === 'over' ? 'Three requests dropped.' : 'Catch every request.'}
            </span>
          </div>
        )}
      </div>
    </GameShell>
  )
}
