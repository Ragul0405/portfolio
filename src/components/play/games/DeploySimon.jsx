import { useEffect, useRef, useState } from 'react'
import { GameShell, Btn } from '../GameShell.jsx'

/* Simon says, as a deploy sequence. Watch the stages light up, then repeat
   them in order. One extra stage per round. */

const NODES = ['build', 'test', 'migrate', 'deploy']

export default function DeploySimon() {
  const [seq, setSeq] = useState([])
  const [lit, setLit] = useState(-1)
  const [phase, setPhase] = useState('idle')  // idle | showing | input | over
  const [round, setRound] = useState(0)
  const [best, setBest] = useState(0)
  const step = useRef(0)
  const timers = useRef([])

  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => () => clearAll(), [])

  const play = (list) => {
    setPhase('showing')
    list.forEach((n, i) => {
      timers.current.push(setTimeout(() => setLit(n), 620 * i + 180))
      timers.current.push(setTimeout(() => setLit(-1), 620 * i + 500))
    })
    timers.current.push(
      setTimeout(() => { step.current = 0; setPhase('input') }, 620 * list.length + 260)
    )
  }

  const next = (from) => {
    const grown = [...from, Math.floor(Math.random() * NODES.length)]
    setSeq(grown)
    setRound(grown.length)
    play(grown)
  }

  const start = () => { clearAll(); setSeq([]); setRound(0); next([]) }

  const press = (i) => {
    if (phase !== 'input') return
    setLit(i)
    timers.current.push(setTimeout(() => setLit(-1), 170))

    if (seq[step.current] !== i) {
      setPhase('over')
      setBest((b) => Math.max(b, seq.length - 1))
      return
    }
    step.current += 1
    if (step.current === seq.length) {
      timers.current.push(setTimeout(() => next(seq), 520))
    }
  }

  const label =
    phase === 'showing' ? 'watch the pipeline…'
    : phase === 'input' ? 'now repeat it'
    : phase === 'over' ? `Failed at stage ${step.current + 1} of ${seq.length}.`
    : 'Press start to see the sequence.'

  return (
    <GameShell
      label="Deploy Sequence"
      stats={[
        { label: 'round', value: round },
        { label: 'best', value: best },
      ]}
      action={<Btn onClick={start}>{phase === 'idle' ? 'Start' : 'Restart'}</Btn>}
      note="Simon says, as a CI pipeline. One extra stage every round."
    >
      <div className="grid grid-cols-2 gap-[9px]">
        {NODES.map((n, i) => (
          <button
            key={n}
            onClick={() => press(i)}
            disabled={phase !== 'input'}
            className={`rounded-[10px] border py-[18px] font-mono text-[0.76rem] transition-all duration-150 ${
              lit === i
                ? 'border-accent bg-accent text-white'
                : 'border-line bg-bg-2 text-text disabled:opacity-60'
            } ${phase === 'input' ? 'hover:border-accent' : ''}`}
          >
            {n}
          </button>
        ))}
      </div>

      <p className="font-mono text-[0.7rem] text-muted">{label}</p>
    </GameShell>
  )
}
