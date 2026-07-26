import Reveal from '../Reveal.jsx'
import CodeRunner from './CodeRunner.jsx'
import { SubNav, PageHeader, useScrollTop } from './PageChrome.jsx'

const FACTS = [
  ['Runtime', 'CPython 3.12 compiled to WebAssembly'],
  ['Where it runs', 'Your browser — nothing is uploaded'],
  ['Isolation', 'Web Worker, no DOM access'],
  ['Safety net', '10s limit, so an infinite loop just gets stopped'],
]

export default function CompilerPage({ theme, toggle }) {
  useScrollTop()

  return (
    <>
      <SubNav theme={theme} toggle={toggle} here="#/compiler" />

      <main className="relative z-[2] px-5 pb-[110px] pt-[120px] sm:px-8">
        <div className="mx-auto max-w-content">
          <Reveal>
            <PageHeader
              eyebrow="Online compiler"
              title={<>Run it in the browser.</>}
              blurb={
                <>
                  A live Python and JavaScript runner. The Python side is real
                  CPython compiled to WebAssembly — not a simulator — so imports,
                  f-strings and tracebacks all behave the way they do locally.
                  Want the games instead?{' '}
                  <a href="#/play" className="text-accent underline decoration-accent/40 underline-offset-[3px] hover:decoration-accent">
                    Let&rsquo;s play
                  </a>
                  .
                </>
              }
            />
          </Reveal>

          <Reveal>
            <CodeRunner />
          </Reveal>

          <Reveal>
            <dl className="mt-8 grid grid-cols-1 gap-[1px] overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-2">
              {FACTS.map(([k, v]) => (
                <div key={k} className="bg-surface px-4 py-[14px]">
                  <dt className="font-mono text-[0.64rem] uppercase tracking-[0.13em] text-accent">
                    {k}
                  </dt>

                  <dd className="mt-[5px] text-[0.9rem] leading-[1.5] text-muted">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal>
            <p className="mt-7 font-mono text-[0.7rem] leading-relaxed text-muted">
              The Python runtime is a few megabytes and is fetched the first time
              you press Run — never on page load, so this page stays light if you
              only came to read.
            </p>
          </Reveal>

          <div className="mt-[86px] flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-line pt-[26px] font-mono text-[0.76rem]">
            <a href="#/" className="text-muted transition-colors hover:text-accent">
              ← portfolio
            </a>
            <a href="#/play" className="text-muted transition-colors hover:text-accent">
              let&rsquo;s play →
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
