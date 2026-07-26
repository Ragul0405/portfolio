import { useEffect, useState } from 'react'
import { GameShell, Btn } from '../GameShell.jsx'

/* You (200) versus the server (500). The server plays a proper minimax, so it
   cannot be beaten — the joke is that the best you can get is a draw. */

const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
]

const YOU = '200'
const CPU = '500'

function winner(b) {
  for (const [x, y, z] of LINES) {
    if (b[x] && b[x] === b[y] && b[y] === b[z]) return b[x]
  }
  return b.every(Boolean) ? 'draw' : null
}

/* minimax — small board, so full search is instant */
function best(b, me) {
  const w = winner(b)
  if (w === CPU) return { score: 1 }
  if (w === YOU) return { score: -1 }
  if (w === 'draw') return { score: 0 }

  let bestMove = null
  let bestScore = me === CPU ? -2 : 2

  for (let i = 0; i < 9; i++) {
    if (b[i]) continue
    b[i] = me
    const { score } = best(b, me === CPU ? YOU : CPU)
    b[i] = null
    if (me === CPU ? score > bestScore : score < bestScore) {
      bestScore = score
      bestMove = i
    }
  }
  return { score: bestScore, move: bestMove }
}

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [turn, setTurn] = useState(YOU)
  const [tally, setTally] = useState({ w: 0, l: 0, d: 0 })
  const [counted, setCounted] = useState(false)

  const result = winner(board)

  useEffect(() => {
    if (result || turn !== CPU) return
    const t = setTimeout(() => {
      const { move } = best([...board], CPU)
      if (move == null) return
      setBoard((b) => {
        const n = [...b]
        n[move] = CPU
        return n
      })
      setTurn(YOU)
    }, 320)
    return () => clearTimeout(t)
  }, [turn, board, result])

  useEffect(() => {
    if (!result || counted) return
    setCounted(true)
    setTally((t) =>
      result === YOU ? { ...t, w: t.w + 1 }
      : result === CPU ? { ...t, l: t.l + 1 }
      : { ...t, d: t.d + 1 }
    )
  }, [result, counted])

  const tap = (i) => {
    if (board[i] || result || turn !== YOU) return
    const n = [...board]
    n[i] = YOU
    setBoard(n)
    setTurn(CPU)
  }

  const reset = () => {
    setBoard(Array(9).fill(null))
    setTurn(YOU)
    setCounted(false)
  }

  const msg =
    result === YOU ? 'You beat the server. That should be impossible.'
    : result === CPU ? '500 wins. The server always wins.'
    : result === 'draw' ? 'Draw — the best anyone gets.'
    : turn === CPU ? 'server is thinking…'
    : 'your move — you play 200'

  return (
    <GameShell
      label="200 vs 500"
      stats={[
        { label: 'won', value: tally.w },
        { label: 'lost', value: tally.l },
        { label: 'drawn', value: tally.d },
      ]}
      action={<Btn onClick={reset} tone="ghost">New game</Btn>}
      note="The server plays a full minimax. A draw is a win."
    >
      <div className="mx-auto grid w-full max-w-[228px] grid-cols-3 gap-[7px]">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            disabled={!!cell || !!result || turn !== YOU}
            aria-label={cell ? `${cell} at ${i + 1}` : `empty ${i + 1}`}
            className={`flex aspect-square items-center justify-center rounded-[9px] border font-mono text-[0.8rem] font-bold transition-colors duration-150 ${
              cell === YOU
                ? 'border-accent bg-accent/10 text-accent'
                : cell === CPU
                ? 'border-line-2 bg-bg-2 text-muted'
                : 'border-line bg-bg-2 hover:border-line-2'
            }`}
          >
            {cell || ''}
          </button>
        ))}
      </div>

      <p className="font-mono text-[0.7rem] text-muted">{msg}</p>
    </GameShell>
  )
}
