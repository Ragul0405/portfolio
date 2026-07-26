import { useCallback, useEffect, useRef, useState } from 'react'
import { GameShell, Btn } from '../GameShell.jsx'

/* Bugs surface in a 3x3 of log lines — squash them before they escape.
   Clicking an empty cell is a false positive and costs you. */

const ROUND_MS = 25000
const BUGS = ['🐛', '🪲', '🐞']

export default function WhackABug() {
  const [live, setLive] = useState([])       // {cell, kind, id}
  const [squashed, setSquashed] = useState(0)
  const [escaped, setEscaped] = useState(0)
  const [misfires, setMisfires] = useState(0)
  const [left, setLeft] = useState(ROUND_MS)
  const [running, setRunning] = useState(false)

  const timers = useRef([])
  const nextId = useRef(0)

  const clearAll = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => () => clearAll(), [])

  const spawn = useCallback(() => {
    const cell = Math.floor(Math.random() * 9)
    const id = ++nextId.current
    const kind = BUGS[Math.floor(Math.random() * BUGS.length)]

    setLive((prev) =>
      prev.some((b) => b.cell === cell) ? prev : [...prev, { cell, kind, id }]
    )

    const life = 800 + Math.random() * 700
    timers.current.push(
      setTimeout(() => {
        setLive((prev) => {
          if (!prev.some((b) => b.id === id)) return prev
          setEscaped((e) => e + 1)
          return prev.filter((b) => b.id !== id)
        })
      }, life)
    )
  }, [])

  const start = () => {
    clearAll()
    setLive([]); setSquashed(0); setEscaped(0); setMisfires(0)
    setLeft(ROUND_MS); setRunning(true)

    const t0 = Date.now()
    const tick = setInterval(() => {
      const remain = ROUND_MS - (Date.now() - t0)
      setLeft(Math.max(0, remain))
      if (remain <= 0) {
        clearInterval(tick)
        clearAll()
        setRunning(false)
        setLive([])
      }
    }, 100)
    timers.current.push(tick)

    const spawner = setInterval(spawn, 620)
    timers.current.push(spawner)
    spawn()
  }

  const hit = (cell) => {
    if (!running) return
    const bug = live.find((b) => b.cell === cell)
    if (bug) {
      setSquashed((s) => s + 1)
      setLive((prev) => prev.filter((b) => b.id !== bug.id))
    } else {
      setMisfires((m) => m + 1)
    }
  }

  const score = squashed * 10 - misfires * 3 - escaped * 5

  return (
    <GameShell
      label="Whack-a-Bug"
      stats={[
        { label: 'squashed', value: squashed },
        { label: 'escaped', value: escaped },
        { label: 'score', value: score },
        { label: 'time', value: `${(left / 1000).toFixed(1)}s` },
      ]}
      action={<Btn onClick={start}>{running ? 'Restart' : 'Start'}</Btn>}
      note="+10 squashed · −5 escaped · −3 clicking an empty line"
    >
      <div className="grid grid-cols-3 gap-[7px]">
        {Array.from({ length: 9 }, (_, i) => {
          const bug = live.find((b) => b.cell === i)
          return (
            <button
              key={i}
              onClick={() => hit(i)}
              aria-label={bug ? 'Bug — squash it' : 'Empty log line'}
              className={`flex aspect-[1.7] items-center justify-center rounded-[9px] border font-mono text-[1.15rem] transition-colors duration-100 ${
                bug
                  ? 'border-accent bg-accent/12'
                  : 'border-line bg-bg-2 hover:border-line-2'
              }`}
            >
              {bug ? bug.kind : <span className="text-[0.6rem] text-muted opacity-40">ok</span>}
            </button>
          )
        })}
      </div>

      {!running && left === 0 && (
        <p className="font-mono text-[0.7rem] text-text">
          Final score {score} — {squashed} squashed, {escaped} escaped.
        </p>
      )}
    </GameShell>
  )
}
