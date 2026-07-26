import { useEffect, useRef, useState } from 'react'
import { GameShell, Btn } from '../GameShell.jsx'

/* Send as many requests as you can in 15s, but the limiter allows 8 per 3s
   sliding window. Trip it and you eat a real 429 with a retry-after. */

const LIMIT = 8
const WINDOW = 3000
const DURATION = 15000

export default function RateLimiter() {
  const [log, setLog] = useState([])
  const [ok, setOk] = useState(0)
  const [blocked, setBlocked] = useState(0)
  const [left, setLeft] = useState(DURATION)
  const [running, setRunning] = useState(false)
  const [fill, setFill] = useState(0)

  const hits = useRef([])
  const tick = useRef(null)
  const t0 = useRef(0)
  const logRef = useRef(null)

  useEffect(() => () => clearInterval(tick.current), [])
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [log])

  const prune = (now) => {
    hits.current = hits.current.filter((t) => now - t < WINDOW)
  }

  const reset = () => {
    clearInterval(tick.current)
    hits.current = []
    setLog([]); setOk(0); setBlocked(0); setLeft(DURATION)
    setRunning(false); setFill(0)
  }

  const send = () => {
    const now = Date.now()

    if (!running && left === DURATION) {
      t0.current = now
      setRunning(true)
      tick.current = setInterval(() => {
        const remain = DURATION - (Date.now() - t0.current)
        setLeft(Math.max(0, remain))
        prune(Date.now())
        setFill(Math.min(100, (hits.current.length / LIMIT) * 100))
        if (remain <= 0) {
          clearInterval(tick.current)
          setRunning(false)
        }
      }, 100)
    } else if (!running) {
      return
    }

    prune(now)
    if (hits.current.length >= LIMIT) {
      const retry = ((WINDOW - (now - hits.current[0])) / 1000).toFixed(1)
      setBlocked((v) => v + 1)
      setLog((l) => [...l.slice(-40), { t: 'bad', s: '429', m: `Too Many Requests · retry-after ${retry}s` }])
    } else {
      hits.current.push(now)
      setOk((v) => v + 1)
      setLog((l) => [...l.slice(-40), { t: 'ok', s: '200', m: `OK · ${hits.current.length}/${LIMIT} in window` }])
    }
    prune(now)
    setFill(Math.min(100, (hits.current.length / LIMIT) * 100))
  }

  const over = !running && left === 0

  return (
    <GameShell
      label="Beat the Rate Limiter"
      stats={[
        { label: '200', value: ok },
        { label: '429', value: blocked },
        { label: 'time', value: `${(left / 1000).toFixed(1)}s` },
      ]}
      action={<Btn onClick={reset} tone="ghost">Reset</Btn>}
      note="8 requests per 3s sliding window. Maximise 200s without tripping a 429."
    >
      <div className="h-[7px] overflow-hidden rounded-full border border-line bg-bg-2">
        <span
          className="block h-full bg-accent transition-[width] duration-150"
          style={{ width: `${fill}%` }}
        />
      </div>

      <div
        ref={logRef}
        className="h-[124px] overflow-y-auto rounded-[9px] border border-line bg-bg-2 px-3 py-2 font-mono text-[0.7rem] leading-[1.7]"
      >
        {log.length === 0 && (
          <span className="text-muted">Press Send to start the 15s run.</span>
        )}
        {log.map((l, i) => (
          <div key={i}>
            <span className={l.t === 'ok' ? 'text-text' : 'text-accent'}>{l.s}</span>{' '}
            <span className="text-muted">{l.m}</span>
          </div>
        ))}
        {over && (
          <div className="text-muted">— run over — {ok} served, {blocked} throttled</div>
        )}
      </div>

      <Btn onClick={send} disabled={over} className="w-full py-[9px]">
        Send request
      </Btn>
    </GameShell>
  )
}
