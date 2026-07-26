import Reveal from '../Reveal.jsx'
import { SubNav, PageHeader, useScrollTop } from './PageChrome.jsx'

import SnakeGame from './games/SnakeGame.jsx'
import WhackABug from './games/WhackABug.jsx'
import CatchRequests from './games/CatchRequests.jsx'
import CacheGame from './games/CacheGame.jsx'
import DeploySimon from './games/DeploySimon.jsx'
import TicTacToe from './games/TicTacToe.jsx'
import RateLimiter from './games/RateLimiter.jsx'
import LatencyReflex from './games/LatencyReflex.jsx'
import TypePython from './games/TypePython.jsx'
import PipelineOrder from './games/PipelineOrder.jsx'
import QuizGame from './games/QuizGame.jsx'
import { STATUS_ROUNDS, TRACEBACK_ROUNDS, OUTPUT_ROUNDS } from './games/quizData.js'

/* Grouped so the page reads as a arcade / quiz split rather than 13 cards in a
   row with no organising idea. */

const GROUPS = [
  {
    num: '01',
    title: 'Arcade',
    blurb: 'Reflexes and nonsense.',
    games: [
      <SnakeGame key="snake" />,
      <WhackABug key="bug" />,
      <CatchRequests key="catch" />,
      <LatencyReflex key="latency" />,
    ],
  },
  {
    num: '02',
    title: 'Memory & logic',
    blurb: 'Slower, but harder to put down.',
    games: [
      <CacheGame key="cache" />,
      <DeploySimon key="simon" />,
      <TicTacToe key="ttt" />,
      <PipelineOrder key="pipe" />,
    ],
  },
  {
    num: '03',
    title: 'Know your backend',
    blurb: 'Quizzes for people who write APIs.',
    games: [
      <QuizGame
        key="status"
        label="Guess the Status Code"
        rounds={STATUS_ROUNDS}
        note="Eight scenarios, shuffled every run."
      />,
      <QuizGame
        key="trace"
        label="Debug the Traceback"
        rounds={TRACEBACK_ROUNDS}
        codeTone="error"
        note="Real Django tracebacks. Pick the actual fix."
      />,
      <QuizGame
        key="output"
        label="Guess the Output"
        rounds={OUTPUT_ROUNDS}
        note="What does this Python print?"
      />,
      <RateLimiter key="rate" />,
      <TypePython key="type" />,
    ],
  },
]

export default function PlayPage({ theme, toggle }) {
  useScrollTop()

  const total = GROUPS.reduce((n, g) => n + g.games.length, 0)

  return (
    <>
      <SubNav theme={theme} toggle={toggle} here="#/play" />

      <main className="relative z-[2] px-5 pb-[110px] pt-[120px] sm:px-8">
        <div className="mx-auto max-w-content">
          <Reveal>
            <PageHeader
              eyebrow={`Arcade · ${total} games`}
              title={<>Let&rsquo;s play.</>}
              blurb={
                <>
                  {total} small games, most of them about the things I actually
                  work on — status codes, rate limits, deploy pipelines and
                  tracebacks. No accounts, no scores uploaded anywhere. Looking
                  for the Python runner instead? It moved to its own page:{' '}
                  <a href="#/compiler" className="text-accent underline decoration-accent/40 underline-offset-[3px] hover:decoration-accent">
                    the online compiler
                  </a>
                  .
                </>
              }
            />
          </Reveal>

          {GROUPS.map((g) => (
            <section key={g.num} className="mb-[86px] last:mb-0">
              <div className="mb-[6px] flex items-baseline gap-[14px]">
                <span className="font-mono text-[0.72rem] text-accent">{g.num}</span>

                <h2 className="font-display text-[1.8rem] font-bold tracking-[-0.02em]">
                  {g.title}
                </h2>
              </div>

              <p className="mb-[22px] pl-[34px] font-mono text-[0.72rem] text-muted">
                {g.blurb}
              </p>

              <div className="grid grid-cols-1 items-stretch gap-5 sm:gap-6 lg:grid-cols-2 3xl:grid-cols-3">
                {g.games.map((game, i) => (
                  <Reveal key={i} delay={i * 60} className="h-full">
                    {game}
                  </Reveal>
                ))}
              </div>
            </section>
          ))}

          <div className="mt-[86px] flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-line pt-[26px] font-mono text-[0.76rem]">
            <a href="#/" className="text-muted transition-colors hover:text-accent">
              ← portfolio
            </a>
            <a href="#/compiler" className="text-muted transition-colors hover:text-accent">
              online compiler →
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
