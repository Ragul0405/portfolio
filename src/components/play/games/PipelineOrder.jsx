import { useCallback, useEffect, useRef, useState } from 'react'
import { GameShell, Btn } from '../GameShell.jsx'

/* Click the deploy stages in the order they actually run. */

const ORDER = [
  'checkout',
  'pip install -r requirements.txt',
  'pytest',
  'collectstatic',
  'migrate',
  'deploy',
]

export default function PipelineOrder() {
  const [shuffled, setShuffled] = useState([])
  const [next, setNext] = useState(0)
  const [wrong, setWrong] = useState(null)
  const [note, setNote] = useState('')
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const build = useCallback(() => {
    clearTimeout(timer.current)
    const a = [...ORDER]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    setShuffled(a); setNext(0); setWrong(null)
    setNote(`${ORDER.length} stages remaining.`)
  }, [])

  useEffect(() => { build() }, [build])

  const tap = (name) => {
    if (ORDER.indexOf(name) < next) return
    if (name === ORDER[next]) {
      const n = next + 1
      setNext(n)
      setNote(n === ORDER.length
        ? 'Deployed. All six in the right order.'
        : `${ORDER.length - n} stages remaining.`)
    } else {
      setWrong(name)
      setNote('Not yet — something has to run before that.')
      timer.current = setTimeout(() => setWrong(null), 520)
    }
  }

  return (
    <GameShell
      label="Order the Pipeline"
      stats={[{ label: 'stage', value: `${next}/${ORDER.length}` }]}
      action={<Btn tone="ghost" onClick={build}>Shuffle</Btn>}
      note="Click them in the order a real deploy runs."
    >
      <div className="grid gap-[6px]">
        {shuffled.map((name) => {
          const idx = ORDER.indexOf(name)
          const done = idx < next
          return (
            <button
              key={name}
              onClick={() => tap(name)}
              className={`flex items-center justify-between rounded-[9px] border px-[11px] py-[8px] font-mono text-[0.74rem] transition-colors duration-150 ${
                done
                  ? 'border-accent bg-accent/10 text-accent'
                  : wrong === name
                  ? 'border-accent bg-bg-2 text-text'
                  : 'border-line-2 bg-bg-2 text-text hover:border-accent'
              }`}
            >
              <span>{name}</span>
              {done && <span className="text-[0.66rem]">✓ {idx + 1}</span>}
            </button>
          )
        })}
      </div>

      <p className="font-mono text-[0.68rem] text-muted">{note}</p>
    </GameShell>
  )
}
