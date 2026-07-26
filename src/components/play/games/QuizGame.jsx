import { useEffect, useRef, useState } from 'react'
import { GameShell, Btn, Opt } from '../GameShell.jsx'

/* Drives every pick-the-right-answer game. Rounds are shuffled per playthrough
   so a second run isn't the same order.

   Each round: { prompt, code?, options: [...], answer: index, explain? } */

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function QuizGame({ label, rounds, note, codeTone = 'normal' }) {
  const [order, setOrder] = useState(() => shuffle(rounds))
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(0)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const restart = () => {
    clearTimeout(timer.current)
    setOrder(shuffle(rounds))
    setI(0); setPicked(null); setScore(0); setStreak(0)
  }

  const round = order[i]
  const finished = i >= order.length

  const choose = (idx) => {
    if (picked !== null) return
    setPicked(idx)
    const right = idx === round.answer
    if (right) {
      setScore((s) => s + 1)
      setStreak((s) => {
        const n = s + 1
        setBest((b) => Math.max(b, n))
        return n
      })
    } else {
      setStreak(0)
    }
    timer.current = setTimeout(() => {
      setPicked(null)
      setI((v) => v + 1)
    }, right ? 900 : 2100)
  }

  return (
    <GameShell
      label={label}
      stats={[
        { label: 'score', value: `${score}/${order.length}` },
        { label: 'streak', value: streak },
        { label: 'best', value: best },
      ]}
      action={<Btn onClick={restart} tone="ghost">Restart</Btn>}
      note={note}
    >
      {finished ? (
        <div className="flex flex-1 flex-col items-start justify-center gap-3">
          <p className="font-display text-[1.5rem] font-bold">
            {score} / {order.length}
          </p>
          <p className="font-mono text-[0.72rem] text-muted">
            Best streak {best}.
          </p>
          <Btn onClick={restart}>Play again</Btn>
        </div>
      ) : (
        <>
          {round.code && (
            <pre
              className={`overflow-x-auto whitespace-pre rounded-[9px] border border-line bg-bg-2 px-3 py-[10px] font-mono text-[0.7rem] leading-[1.65] ${
                codeTone === 'error' ? 'text-accent' : 'text-text'
              }`}
            >
              {round.code}
            </pre>
          )}

          <p className="text-[0.86rem] leading-[1.55] text-text">
            {round.prompt}
          </p>

          <div className="grid gap-[7px]">
            {round.options.map((o, idx) => (
              <Opt
                key={idx}
                disabled={picked !== null}
                onClick={() => choose(idx)}
                state={
                  picked === null
                    ? undefined
                    : idx === round.answer
                    ? 'good'
                    : idx === picked
                    ? 'bad'
                    : undefined
                }
              >
                {o}
              </Opt>
            ))}
          </div>

          <p className="min-h-[2.4em] font-mono text-[0.66rem] leading-relaxed text-muted">
            {picked !== null && round.explain ? round.explain : ''}
          </p>
        </>
      )}
    </GameShell>
  )
}
