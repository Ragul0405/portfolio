import { useEffect } from 'react'

/* Shared top bar + header for the two sub-pages. They don't use the portfolio
   Nav because its section anchors (#about, #work) point at sections that don't
   exist on these routes. */

export function SubNav({ theme, toggle, here }) {
  /* `short` keeps the pills on one line at 320px */
  const link = (href, label, short) => {
    const active = here === href
    return (
      <a
        key={href}
        href={href}
        aria-current={active ? 'page' : undefined}
        className={`flex-none whitespace-nowrap rounded-full px-[11px] py-[5px] text-[0.76rem] font-semibold transition-colors duration-300 xs:px-[13px] xs:text-[0.78rem] ${
          active
            ? 'bg-accent text-white'
            : 'border border-line-2 text-muted hover:border-accent hover:text-accent'
        }`}
      >
        <span className="hidden xs:inline">{label}</span>
        <span className="xs:hidden">{short}</span>
      </a>
    )
  }

  return (
    <nav
      className="fixed inset-x-0 top-0 z-[60] border-b border-line px-5 py-[14px] backdrop-blur-md sm:px-8"
      style={{ background: 'color-mix(in srgb, var(--bg) 72%, transparent)' }}
    >
      <div className="mx-auto flex w-full max-w-content items-center gap-2 sm:gap-3">
      <a
        href="#/"
        className="group mr-auto flex flex-none items-center gap-[7px] text-[0.82rem] font-medium"
      >
        <span className="transition-transform duration-300 group-hover:-translate-x-[3px]">
          ←
        </span>
        <span className="hidden sm:inline">Back to portfolio</span>
        <span className="sm:hidden">Back</span>
      </a>

      {link('#/play', "Let's Play", 'Play')}
      {link('#/compiler', 'Compiler', 'Code')}

      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="relative h-7 w-[52px] flex-none rounded-full border border-line-2 bg-surface transition-colors duration-500"
      >
        <span
          className={`absolute top-[3px] left-[3px] flex h-5 w-5 items-center justify-center rounded-full bg-accent shadow-md transition-transform duration-500 ${
            theme === 'dark' ? 'translate-x-6' : ''
          }`}
        >
          <svg
            className="h-[11px] w-[11px] stroke-white stroke-2"
            viewBox="0 0 24 24"
            fill="none"
          >
            {theme === 'light' ? (
              <>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
              </>
            ) : (
              <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
            )}
          </svg>
        </span>
      </button>
      </div>
    </nav>
  )
}

export function PageHeader({ eyebrow, title, blurb }) {
  return (
    <>
      <div className="mb-[14px] inline-flex items-center gap-[10px] font-mono text-[0.74rem] uppercase tracking-[0.14em] text-accent">
        <span className="dot-pulse h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
        {eyebrow}
      </div>

      <h1 className="mb-[18px] font-display text-[clamp(2.3rem,6.2vw,4.2rem)] font-extrabold leading-[0.98] tracking-[-0.03em]">
        {title}
      </h1>

      <p className="mb-[62px] max-w-[62ch] text-[1.08rem] leading-[1.8] text-muted">
        {blurb}
      </p>
    </>
  )
}

export function useScrollTop() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
}
