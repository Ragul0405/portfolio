import { useEffect, useRef, useState } from 'react'
import { GameShell, Btn } from '../GameShell.jsx'

/* Click the instant the response lands. Clicking before it arrives is a
   dropped packet and doesn't score. */

export default function LatencyReflex() {
  const [state, setState] = useState('idle')  // idle | waiting | armed | early
  const [tries, setTries] = useState([])
  const [note, setNote] = useState('')
  const sentAt = useRef(0)
  const to = useRef(null)

  useEffect(() => () => clearTimeout(to.current), [])

  const fmt = (v) => (v == null ? '—' : `${Math.round(v)}ms`)

  const tap = () => {
    if (state === 'armed') {
      const ms = performance.now() - sentAt.current
      setTries((t) => [...t, ms])
      setState('idle')
      setNote(ms < 200 ? 'Sharp.' : ms < 320 ? 'Solid.' : 'Room to improve.')
      return
    }
    if (state === 'waiting') {
      clearTimeout(to.current)
      setState('early')
      setNote('You clicked before the response arrived.')
      return
    }
    setState('waiting')
    setNote('')
    to.current = setTimeout(() => {
      sentAt.current = performance.now()
      setState('armed')
    }, 700 + Math.random() * 2200)
  }

  const label =
    state === 'waiting' ? 'waiting for response…'
    : state === 'armed' ? '200 OK — click!'
    : state === 'early' ? 'packet sent early — press to retry'
    : tries.length ? 'press to send another' : 'press to send a request'

  return (
    <GameShell
      label="Latency Reflex"
      stats={[
        { label: 'last', value: fmt(tries[tries.length - 1]) },
        { label: 'best', value: tries.length ? fmt(Math.min(...tries)) : '—' },
        { label: 'avg', value: tries.length ? fmt(tries.reduce((a, b) => a + b, 0) / tries.length) : '—' },
      ]}
      action={<Btn tone="ghost" onClick={() => { setTries([]); setNote('') }}>Clear</Btn>}
      note="Measures your reaction time, not your connection."
    >
      <button
        onClick={tap}
        className={`flex min-h-[132px] flex-1 items-center justify-center rounded-[10px] border text-center font-mono text-[0.82rem] transition-colors duration-150 ${
          state === 'armed'
            ? 'border-accent bg-accent text-white'
            : state === 'early'
            ? 'border-accent/60 bg-accent/10 text-accent'
            : 'border-line bg-bg-2 text-text hover:border-line-2'
        }`}
      >
        {label}
      </button>

      <p className="min-h-[1.4em] font-mono text-[0.68rem] text-muted">{note}</p>
    </GameShell>
  )
}
