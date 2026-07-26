import { useCallback, useEffect, useRef, useState } from 'react'
import { GameShell, Btn } from '../GameShell.jsx'

/* Snake on a terminal grid. Keyboard is captured only while the board has
   focus, so arrow keys still scroll the page everywhere else. */

const COLS = 24
const ROWS = 16
const CELL = 15
const TICK_START = 130
const TICK_MIN = 66
const BEST_KEY = 'play.snake.best'

const KEYS = {
  ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
  w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
}

export default function SnakeGame() {
  const canvasRef = useRef(null)
  const state = useRef(null)
  const raf = useRef(0)

  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [phase, setPhase] = useState('idle')

  useEffect(() => {
    try {
      const v = Number(localStorage.getItem(BEST_KEY))
      if (Number.isFinite(v) && v > 0) setBest(v)
    } catch {
      /* storage blocked — session-only best */
    }
  }, [])

  const reset = useCallback(() => {
    state.current = {
      body: [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }],
      dir: [1, 0], queued: null,
      food: { x: 16, y: 8 },
      acc: 0, last: 0, tick: TICK_START,
      alive: false, score: 0,
    }
    setScore(0)
    setPhase('idle')
  }, [])

  useEffect(() => { reset() }, [reset])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = COLS * CELL * dpr
    canvas.height = ROWS * CELL * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const placeFood = (s) => {
      let p
      do {
        p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
      } while (s.body.some((b) => b.x === p.x && b.y === p.y))
      s.food = p
    }

    const step = (s) => {
      if (s.queued) { s.dir = s.queued; s.queued = null }
      const head = { x: s.body[0].x + s.dir[0], y: s.body[0].y + s.dir[1] }

      if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS ||
          s.body.some((b) => b.x === head.x && b.y === head.y)) {
        s.alive = false
        setPhase('over')
        setBest((b) => {
          if (s.score <= b) return b
          try { localStorage.setItem(BEST_KEY, String(s.score)) } catch {
            /* storage blocked */
          }
          return s.score
        })
        return
      }

      s.body.unshift(head)
      if (head.x === s.food.x && head.y === s.food.y) {
        s.score += 1
        setScore(s.score)
        s.tick = Math.max(TICK_MIN, s.tick - 3)
        placeFood(s)
      } else {
        s.body.pop()
      }
    }

    const draw = (s) => {
      const cs = getComputedStyle(canvas)
      const accent = cs.getPropertyValue('--accent').trim() || '#d41e3c'
      const text = cs.getPropertyValue('--text').trim() || '#16131a'
      const line = cs.getPropertyValue('--line').trim() || 'rgba(0,0,0,.09)'

      ctx.clearRect(0, 0, COLS * CELL, ROWS * CELL)
      ctx.strokeStyle = line
      ctx.lineWidth = 1
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath(); ctx.moveTo(x * CELL + 0.5, 0)
        ctx.lineTo(x * CELL + 0.5, ROWS * CELL); ctx.stroke()
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath(); ctx.moveTo(0, y * CELL + 0.5)
        ctx.lineTo(COLS * CELL, y * CELL + 0.5); ctx.stroke()
      }

      ctx.fillStyle = accent
      ctx.font = `700 ${CELL - 3}px ui-monospace, Menlo, monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('$', s.food.x * CELL + CELL / 2, s.food.y * CELL + CELL / 2 + 1)

      s.body.forEach((b, i) => {
        ctx.globalAlpha = i === 0 ? 1 : 0.4 + 0.5 * (1 - i / s.body.length)
        ctx.fillStyle = i === 0 ? accent : text
        ctx.fillRect(b.x * CELL + 2, b.y * CELL + 2, CELL - 4, CELL - 4)
      })
      ctx.globalAlpha = 1
    }

    const loop = (ts) => {
      raf.current = requestAnimationFrame(loop)
      const s = state.current
      if (!s) return
      if (!s.last) s.last = ts
      s.acc += ts - s.last
      s.last = ts
      if (s.alive && s.acc >= s.tick) { s.acc = 0; step(s) }
      draw(s)
    }

    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  const turn = (key) => {
    const k = KEYS[key] ?? KEYS[key?.toLowerCase?.()]
    if (!k) return false
    const s = state.current
    if (!s) return false
    if (!s.alive) {
      if (phase === 'over') reset()
      state.current.alive = true
      state.current.last = 0
      setPhase('playing')
    }
    const cur = s.queued || s.dir
    if (k[0] === -cur[0] && k[1] === -cur[1]) return true
    s.queued = k
    return true
  }

  const onKeyDown = (e) => {
    if (turn(e.key)) e.preventDefault()
  }

  const start = () => {
    if (phase === 'over') reset()
    const s = state.current
    if (s) { s.alive = true; s.last = 0 }
    setPhase('playing')
    canvasRef.current?.focus()
  }

  return (
    <GameShell
      label="Snake"
      stats={[{ label: 'score', value: score }, { label: 'best', value: best }]}
      action={
        <Btn onClick={start}>
          {phase === 'playing' ? 'Restart' : phase === 'over' ? 'Again' : 'Start'}
        </Btn>
      }
      note="Click the board, then arrow keys or WASD. Eat the $ tokens."
    >
      <div className="relative mx-auto" style={{ maxWidth: COLS * CELL }}>
        <canvas
          ref={canvasRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onClick={() => canvasRef.current?.focus()}
          aria-label="Snake game board"
          style={{ aspectRatio: `${COLS} / ${ROWS}` }}
          className="w-full rounded-[10px] border border-line bg-bg-2 outline-none focus-visible:border-accent"
        />

        {phase !== 'playing' && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-[10px] bg-bg/80 text-center backdrop-blur-[2px]">
            <span className="font-display text-[1.05rem] font-bold">
              {phase === 'over' ? `Dropped at ${score}` : 'Snake'}
            </span>
            <span className="font-mono text-[0.66rem] text-muted">
              click, then arrows / WASD
            </span>
          </div>
        )}
      </div>

      <div className="mx-auto grid grid-cols-3 gap-2 sm:hidden">
        {[null, 'ArrowUp', null, 'ArrowLeft', 'ArrowDown', 'ArrowRight'].map((k, i) =>
          k ? (
            <button
              key={i}
              onClick={() => turn(k)}
              aria-label={k}
              className="h-10 w-10 rounded-[9px] border border-line-2 font-mono text-[0.85rem] text-text active:border-accent"
            >
              {{ ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→' }[k]}
            </button>
          ) : (
            <span key={i} />
          )
        )}
      </div>
    </GameShell>
  )
}
