import { useEffect, useRef, useState } from 'react'

/* The About terminal, typed out on scroll. Commands type character by
   character like someone at a keyboard; output lines land whole, the way a
   server actually prints them. Replays whenever the card re-enters view. */

const SCRIPT = [
  { kind: 'cmd', text: 'whoami' },
  { kind: 'out', text: 'backend_developer' },
  { kind: 'cmd', text: 'cat stack.json' },
  { kind: 'out', text: '{' },
  { kind: 'out', text: '  "backend": ["Python", "Django", "DRF"],' },
  { kind: 'out', text: '  "database": ["PostgreSQL", "MySQL"],' },
  { kind: 'out', text: '  "tools": ["Git", "Postman", "PyInstaller"]' },
  { kind: 'out', text: '}' },
  { kind: 'cmd', text: 'status' },
  { kind: 'out', text: 'actively_building_and_learning' },
]

const TYPE_MIN = 34      // ms per character
const TYPE_JITTER = 46   // + up to this, so it doesn't feel mechanical
const AFTER_CMD = 300    // pause between a command and its output
const AFTER_OUT = 120    // pause between consecutive output lines

function Line({ line, text, cursor }) {
  return (
    <div className="whitespace-pre">
      {line.kind === 'cmd' && (
        <>
          <span className="text-accent">$</span>{' '}
          <span className="text-text">{text}</span>
        </>
      )}

      {line.kind === 'out' && <span>{text}</span>}

      {cursor && (
        <span
          className="text-accent"
          style={{ animation: 'pulse 1.1s steps(1, end) infinite' }}
        >
          ▋
        </span>
      )}
    </div>
  )
}

export default function TypingTerminal() {
  const hostRef = useRef(null)
  const cancelRef = useRef(false)

  const [visible, setVisible] = useState(0)
  const [typing, setTyping] = useState(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      // no animation: show the finished terminal
      setVisible(SCRIPT.length)
      setDone(true)
      return
    }

    const sleep = (ms) =>
      new Promise((res) => setTimeout(res, ms))

    const run = async () => {
      setVisible(0)
      setTyping(null)
      setDone(false)
      await sleep(260)

      for (let i = 0; i < SCRIPT.length; i++) {
        if (cancelRef.current) return
        const line = SCRIPT[i]

        if (line.kind === 'cmd') {
          for (let c = 1; c <= line.text.length; c++) {
            if (cancelRef.current) return
            setTyping({ index: i, chars: c })
            await sleep(TYPE_MIN + Math.random() * TYPE_JITTER)
          }
          if (cancelRef.current) return
          setTyping(null)
          setVisible(i + 1)
          await sleep(AFTER_CMD)
        } else {
          setVisible(i + 1)
          await sleep(AFTER_OUT)
        }
      }

      if (!cancelRef.current) setDone(true)
    }

    let running = false

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true
          cancelRef.current = false
          run()
        } else if (!entry.isIntersecting && running) {
          // fully left the viewport — re-arm so it replays on the way back
          running = false
          cancelRef.current = true
        }
      },
      { threshold: 0.25 }
    )

    io.observe(host)

    return () => {
      cancelRef.current = true
      io.disconnect()
    }
  }, [])

  const typedText = (i) => {
    if (i < visible) return SCRIPT[i].text
    if (typing && typing.index === i) return SCRIPT[i].text.slice(0, typing.chars)
    return null
  }

  return (
    <div ref={hostRef}>
      <div className="flex gap-[7px] border-b border-line px-4 py-[13px]">
        <i className="h-[11px] w-[11px] rounded-full bg-accent" />
        <i className="h-[11px] w-[11px] rounded-full bg-line-2" />
        <i className="h-[11px] w-[11px] rounded-full bg-line-2" />
      </div>

      {/* An invisible full copy holds the box at its final height, so nothing
          below it shifts while the terminal types. */}
      <div className="relative px-[18px] pb-[22px] pt-[18px] leading-[2] text-muted">
        <div aria-hidden="true" className="invisible">
          {SCRIPT.map((line, i) => (
            <Line key={i} line={line} text={line.text} cursor={false} />
          ))}
        </div>

        <div className="absolute inset-0 px-[18px] pb-[22px] pt-[18px]">
          {SCRIPT.map((line, i) => {
            const text = typedText(i)
            if (text === null) return null

            const isCursorLine =
              (typing && typing.index === i) ||
              (!typing && !done && i === visible - 1) ||
              (done && i === SCRIPT.length - 1)

            return (
              <Line
                key={i}
                line={line}
                text={text}
                cursor={isCursorLine}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
