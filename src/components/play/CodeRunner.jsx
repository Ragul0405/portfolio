import { useEffect, useRef, useState } from 'react'

/* Live runner for Python and JavaScript.

   Both languages execute inside a Web Worker, never on the main thread — user
   code can contain `while True:` and the page has to stay alive and be able to
   kill it. Workers also have no DOM access, so a pasted snippet can't touch the
   rest of the site.

   Python is real CPython via Pyodide (WASM), fetched from a CDN on the first
   run only — it's a few MB, so we never pay for it unless someone opts in. */

const PYODIDE_VERSION = '0.26.4'
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

const TIMEOUT_MS = 10000

const STARTERS = {
  python: `# Real CPython, running in your browser.
from datetime import date

stack = {
    "backend": ["Python", "Django", "DRF"],
    "database": ["PostgreSQL", "MySQL"],
}

for layer, tools in stack.items():
    print(f"{layer:>9}: {', '.join(tools)}")

print()
print("primes under 30:", [n for n in range(2, 30)
      if all(n % d for d in range(2, int(n ** 0.5) + 1))])
print("today:", date.today().isoformat())
`,
  javascript: `// Plain JavaScript, running in a sandboxed worker.
const projects = [
  { name: "Empora", stack: ["Django", "React"] },
  { name: "Neem",   stack: ["Django", "React"] },
];

for (const p of projects) {
  console.log(\`\${p.name.padEnd(8)} -> \${p.stack.join(" + ")}\`);
}

const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));
console.log("fib(1..10):", Array.from({ length: 10 }, (_, i) => fib(i + 1)));
`,
}

/* ---------- worker sources (built as blobs so there's no extra build step) ---------- */

const JS_WORKER = `
const fmt = (v) => {
  if (typeof v === 'string') return v
  if (v instanceof Error) return v.stack || String(v)
  try {
    // keep short structures on one line; only indent when they're big
    const flat = JSON.stringify(v)
    if (flat === undefined) return String(v)
    return flat.length <= 88 ? flat : JSON.stringify(v, null, 2)
  } catch { return String(v) }
}
self.onmessage = (e) => {
  const send = (type, text) => self.postMessage({ type, text })
  const con = {
    log:   (...a) => send('out', a.map(fmt).join(' ')),
    info:  (...a) => send('out', a.map(fmt).join(' ')),
    warn:  (...a) => send('warn', a.map(fmt).join(' ')),
    error: (...a) => send('err', a.map(fmt).join(' ')),
    table: (...a) => send('out', a.map(fmt).join(' ')),
  }
  try {
    const result = new Function('console', '"use strict";' + e.data.code)(con)
    if (result !== undefined) send('val', fmt(result))
  } catch (err) {
    send('err', (err && (err.stack || err.message)) || String(err))
  }
  self.postMessage({ type: 'done' })
}
`

const PY_WORKER = `
importScripts('${PYODIDE_BASE}pyodide.js')
let py = null
self.onmessage = async (e) => {
  const send = (type, text) => self.postMessage({ type, text })
  try {
    if (!py) {
      send('status', 'Downloading the Python runtime (one time)…')
      py = await loadPyodide({ indexURL: '${PYODIDE_BASE}' })
      send('status', 'Python ' + py.version + ' ready.')
    }
    py.setStdout({ batched: (s) => send('out', s) })
    py.setStderr({ batched: (s) => send('err', s) })
    const result = await py.runPythonAsync(e.data.code)
    if (result !== undefined && result !== null) send('val', String(result))
  } catch (err) {
    send('err', (err && err.message) || String(err))
  }
  self.postMessage({ type: 'done' })
}
`

function makeWorker(src) {
  return new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })))
}

export default function CodeRunner() {
  const [lang, setLang] = useState('python')
  const [code, setCode] = useState(STARTERS.python)
  const [lines, setLines] = useState([])
  const [running, setRunning] = useState(false)
  const [status, setStatus] = useState('')
  const [elapsed, setElapsed] = useState(null)

  const workers = useRef({ python: null, javascript: null })
  const timer = useRef(null)
  const startedAt = useRef(0)
  const outRef = useRef(null)
  const taRef = useRef(null)
  const gutterRef = useRef(null)

  /* keep the worker pair alive across runs so Pyodide is only downloaded once */
  useEffect(() => () => {
    Object.values(workers.current).forEach((w) => w && w.terminate())
    clearTimeout(timer.current)
  }, [])

  useEffect(() => {
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight
  }, [lines, status])

  const push = (type, text) =>
    setLines((prev) => [...prev, { type, text, id: prev.length }])

  const finish = () => {
    clearTimeout(timer.current)
    setRunning(false)
    setElapsed(Math.round(performance.now() - startedAt.current))
  }

  const kill = (why) => {
    const w = workers.current[lang]
    if (w) { w.terminate(); workers.current[lang] = null }
    if (why) push('err', why)
    setStatus('')
    finish()
  }

  const run = () => {
    if (running) return
    setLines([])
    setElapsed(null)
    setStatus('')
    setRunning(true)
    startedAt.current = performance.now()

    let w = workers.current[lang]
    if (!w) {
      try {
        w = makeWorker(lang === 'python' ? PY_WORKER : JS_WORKER)
      } catch (err) {
        push('err', 'Could not start the sandbox: ' + err.message)
        setRunning(false)
        return
      }
      workers.current[lang] = w

      w.onmessage = (e) => {
        const { type, text } = e.data
        if (type === 'status') { setStatus(text); return }
        if (type === 'done') { setStatus(''); finish(); return }
        push(type, text)
      }
      w.onerror = (e) => {
        // a failed CDN fetch for Pyodide lands here
        kill(
          lang === 'python'
            ? 'Could not load the Python runtime. Check your connection and try again.'
            : 'Worker error: ' + (e.message || 'unknown')
        )
      }
    }

    timer.current = setTimeout(
      () => kill(`Stopped after ${TIMEOUT_MS / 1000}s — looks like an infinite loop.`),
      TIMEOUT_MS
    )

    w.postMessage({ code })
  }

  const switchLang = (next) => {
    if (next === lang) return
    setLang(next)
    setCode(STARTERS[next])
    setLines([])
    setStatus('')
    setElapsed(null)
  }

  const onKeyDown = (e) => {
    // Ctrl/Cmd+Enter runs; Tab inserts spaces instead of leaving the editor
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      run()
      return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = e.currentTarget
      const { selectionStart: s, selectionEnd: en } = ta
      const next = code.slice(0, s) + '    ' + code.slice(en)
      setCode(next)
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = s + 4
      })
    }
  }

  const syncScroll = (e) => {
    if (gutterRef.current) gutterRef.current.scrollTop = e.currentTarget.scrollTop
  }

  const lineCount = code.split('\n').length

  return (
    <div className="overflow-hidden rounded-[16px] border border-line bg-surface shadow-[0_24px_60px_-34px_var(--shadow)]">

      {/* toolbar */}

      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
        <div className="flex overflow-hidden rounded-[9px] border border-line-2">
          {['python', 'javascript'].map((l) => (
            <button
              key={l}
              onClick={() => switchLang(l)}
              aria-pressed={lang === l}
              className={`px-[14px] py-[6px] font-mono text-[0.74rem] transition-colors ${
                lang === l
                  ? 'bg-accent text-white'
                  : 'text-muted hover:text-text'
              }`}
            >
              {l === 'python' ? 'Python' : 'JavaScript'}
            </button>
          ))}
        </div>

        <span className="font-mono text-[0.66rem] text-muted">
          {lang === 'python' ? `CPython ${PYODIDE_VERSION} · WASM` : 'ES2023 · worker'}
        </span>

        <div className="ml-auto flex items-center gap-2">
          {elapsed !== null && !running && (
            <span className="font-mono text-[0.66rem] text-muted">
              {elapsed}ms
            </span>
          )}

          <button
            onClick={() => setCode(STARTERS[lang])}
            className="rounded-[8px] border border-line-2 px-[11px] py-[6px] text-[0.74rem] font-semibold text-muted transition-colors hover:border-text hover:text-text"
          >
            Reset
          </button>

          {running ? (
            <button
              onClick={() => kill('Stopped.')}
              className="rounded-[8px] border border-line-2 px-[13px] py-[6px] text-[0.74rem] font-semibold text-text transition-colors hover:border-accent hover:text-accent"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={run}
              className="rounded-[8px] bg-accent px-[15px] py-[6px] text-[0.74rem] font-semibold text-white transition-transform duration-200 hover:-translate-y-[1px]"
            >
              Run ▸
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* editor */}

        <div className="relative flex border-b border-line lg:border-b-0 lg:border-r">
          <div
            ref={gutterRef}
            aria-hidden="true"
            className="select-none overflow-hidden border-r border-line bg-bg-2 px-[10px] py-[14px] text-right font-mono text-[0.72rem] leading-[1.65] text-muted"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          <textarea
            ref={taRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={onKeyDown}
            onScroll={syncScroll}
            spellCheck="false"
            autoComplete="off"
            aria-label={`${lang} source code`}
            className="h-[240px] flex-1 resize-none bg-transparent px-[13px] py-[14px] font-mono text-[0.78rem] leading-[1.65] text-text outline-none sm:h-[330px] 3xl:h-[440px]"
          />
        </div>

        {/* output */}

        <div className="flex flex-col bg-bg-2">
          <div className="flex items-center gap-2 border-b border-line px-4 py-[9px]">
            <span
              className={`h-[7px] w-[7px] flex-none rounded-full ${
                running ? 'bg-accent' : 'bg-line-2'
              }`}
              style={running ? { animation: 'pulse 1.1s infinite' } : undefined}
            />
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.13em] text-muted">
              Output
            </span>

            {lines.length > 0 && (
              <button
                onClick={() => { setLines([]); setElapsed(null) }}
                className="ml-auto font-mono text-[0.66rem] text-muted transition-colors hover:text-accent"
              >
                clear
              </button>
            )}
          </div>

          <div
            ref={outRef}
            className="h-[240px] overflow-auto px-[14px] py-[13px] font-mono text-[0.76rem] leading-[1.7] sm:h-[330px] 3xl:h-[440px]"
          >
            {lines.length === 0 && !status && (
              <span className="text-muted">
                Press Run (or Ctrl/Cmd + Enter) to execute.
              </span>
            )}

            {status && (
              <div className="text-muted">
                {status}
              </div>
            )}

            {lines.map((l) => (
              <div
                key={l.id}
                className={`whitespace-pre-wrap break-words ${
                  l.type === 'err'
                    ? 'text-accent'
                    : l.type === 'warn'
                    ? 'text-amber-500'
                    : l.type === 'val'
                    ? 'text-muted'
                    : 'text-text'
                }`}
              >
                {l.type === 'val' ? `⇒ ${l.text}` : l.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line px-4 py-[10px] font-mono text-[0.64rem] leading-relaxed text-muted">
        Runs entirely in your browser — nothing is uploaded. Sandboxed in a Web
        Worker with a {TIMEOUT_MS / 1000}s limit, so an infinite loop just gets
        stopped.
      </div>
    </div>
  )
}
