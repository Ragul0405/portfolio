import { useMemo, useRef, useState } from 'react'
import { GameShell, Btn } from '../GameShell.jsx'

/* Type a real Django snippet. Live WPM and accuracy, per-character feedback. */

const SNIPPETS = [
  'def get_queryset(self): return Project.objects.filter(active=True)',
  'class ProjectSerializer(serializers.ModelSerializer): model = Project',
  '@api_view(["GET"]) def health(request): return Response({"ok": True})',
  'user = models.ForeignKey(User, on_delete=models.CASCADE)',
  'python manage.py makemigrations && python manage.py migrate',
]

export default function TypePython() {
  const [target, setTarget] = useState(() => SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)])
  const [typed, setTyped] = useState('')
  const startedAt = useRef(0)
  const inputRef = useRef(null)

  const correct = useMemo(
    () => [...typed].filter((c, i) => c === target[i]).length,
    [typed, target]
  )

  const done = typed === target
  const mins = startedAt.current ? (performance.now() - startedAt.current) / 60000 : 0
  const wpm = mins > 0 ? Math.round(typed.length / 5 / mins) : 0
  const acc = typed.length ? Math.round((correct / typed.length) * 100) : null

  const load = () => {
    let next = target
    while (next === target && SNIPPETS.length > 1) {
      next = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]
    }
    setTarget(next)
    setTyped('')
    startedAt.current = 0
    inputRef.current?.focus()
  }

  const onChange = (e) => {
    if (!startedAt.current) startedAt.current = performance.now()
    setTyped(e.target.value)
  }

  return (
    <GameShell
      label="Type the Python"
      stats={[
        { label: 'wpm', value: typed.length ? wpm : '—' },
        { label: 'acc', value: acc === null ? '—' : `${acc}%` },
      ]}
      action={<Btn tone="ghost" onClick={load}>New snippet</Btn>}
      note="Timer starts on your first keystroke."
    >
      <div
        data-snippet={target}
        className="break-all rounded-[9px] border border-line bg-bg-2 px-3 py-[10px] font-mono text-[0.76rem] leading-[1.75]"
      >
        {[...target].map((ch, i) => {
          const state =
            i < typed.length
              ? typed[i] === ch ? 'ok' : 'bad'
              : i === typed.length ? 'next' : 'rest'
          return (
            <span
              key={i}
              className={
                state === 'ok' ? 'text-text'
                : state === 'bad' ? 'text-accent underline'
                : state === 'next' ? 'bg-accent/25 text-text'
                : 'text-muted'
              }
            >
              {ch}
            </span>
          )
        })}
        {done && <span className="ml-2 text-accent">✓ done</span>}
      </div>

      <input
        ref={inputRef}
        value={typed}
        onChange={onChange}
        disabled={done}
        spellCheck="false"
        autoComplete="off"
        aria-label="Type the snippet"
        placeholder="start typing…"
        className="w-full rounded-[9px] border border-line-2 bg-surface px-3 py-[9px] font-mono text-[0.76rem] text-text outline-none focus:border-accent"
      />
    </GameShell>
  )
}
