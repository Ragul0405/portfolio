import { useCallback, useEffect, useRef, useState } from 'react'
import { GameShell, Btn } from '../GameShell.jsx'

/* Memory pairs, skinned as cache lookups over real API vocabulary:
   verbs, status codes and payload types. Match = HIT, mismatch = MISS. */

const KEYS = [
  'GET', 'POST', 'PUT', 'PATCH',
  'DELETE', 'JSON', '200 OK', '404',
]

const FLIP_BACK_MS = 640

function shuffled() {
  const deck = KEYS.concat(KEYS).map((k, i) => ({ k, id: i }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export default function CacheGame() {
  const [deck, setDeck] = useState(shuffled)
  const [open, setOpen] = useState([])
  const [done, setDone] = useState([])
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const lock = useRef(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const reset = useCallback(() => {
    clearTimeout(timer.current)
    lock.current = false
    setDeck(shuffled()); setOpen([]); setDone([]); setHits(0); setMisses(0)
  }, [])

  const flip = (idx) => {
    if (lock.current || done.includes(idx) || open.includes(idx)) return
    const next = [...open, idx]
    setOpen(next)
    if (next.length < 2) return

    const [a, b] = next
    if (deck[a].k === deck[b].k) {
      setHits((v) => v + 1)
      setDone((d) => [...d, a, b])
      setOpen([])
    } else {
      setMisses((v) => v + 1)
      lock.current = true
      timer.current = setTimeout(() => { setOpen([]); lock.current = false }, FLIP_BACK_MS)
    }
  }

  const lookups = hits + misses
  const rate = lookups ? Math.round((hits / lookups) * 100) : null
  const cleared = done.length === deck.length

  return (
    <GameShell
      label="Cache Hit or Miss"
      stats={[
        { label: 'hit', value: hits },
        { label: 'miss', value: misses },
        { label: 'rate', value: rate === null ? '—' : `${rate}%` },
      ]}
      action={<Btn onClick={reset} tone="ghost">Flush</Btn>}
      note={cleared
        ? `Cache warm — 8 pairs in ${lookups} lookups, ${rate}% hit rate.`
        : 'Match the API keys. A mismatch counts as a cache miss.'}
    >
      <div className="grid grid-cols-4 gap-[9px]">
        {deck.map((card, idx) => {
          const isUp = open.includes(idx) || done.includes(idx)
          const isDone = done.includes(idx)
          return (
            <button
              key={card.id}
              onClick={() => flip(idx)}
              aria-label={isUp ? card.k : 'Hidden cache key'}
              className={`flex aspect-[1.35] items-center justify-center overflow-hidden rounded-[9px] border px-1 text-center font-mono text-[0.62rem] font-semibold leading-tight transition-colors duration-200 ${
                isDone
                  ? 'border-accent bg-accent/10 text-accent'
                  : isUp
                  ? 'border-line-2 bg-bg text-text'
                  : 'border-line bg-bg-2 text-muted hover:border-line-2'
              }`}
            >
              {isUp ? card.k : <span className="opacity-30">•••</span>}
            </button>
          )
        })}
      </div>
    </GameShell>
  )
}
