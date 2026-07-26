import { useEffect, useState } from 'react'

const links = [
  ['About', '#about'],
  ['Experience', '#experience'],
  ['Stack', '#skills'],
  ['Work', '#work'],
  ['Contact', '#contact'],
]

const RESUME = `${import.meta.env.BASE_URL}Ragul_Resume.pdf`

export default function Nav({ theme, toggle, scrolled }) {
  const [open, setOpen] = useState(false)

  /* close on Escape, and never leave the menu open once the desktop
     layout takes over */
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const mq = window.matchMedia('(min-width: 768px)')
    const onWide = () => mq.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onWide)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onWide)
    }
  }, [open])

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-[60] px-5 py-[14px] backdrop-blur-md transition-colors duration-500 sm:px-8 sm:py-[18px] ${
        scrolled || open
          ? 'border-b border-line'
          : 'border-b border-transparent'
      }`}
      style={{
        background:
          'color-mix(in srgb, var(--bg) 70%, transparent)',
      }}
    >
      {/* Constrained to the content column so the logo and links don't end up
          at opposite edges of a television */}

      <div className="mx-auto flex w-full max-w-content items-center justify-between gap-3">

      {/* Logo */}

      <a
        href="#top"
        className="flex-none font-display text-[1rem] font-extrabold tracking-tight sm:text-[1.1rem]"
      >
        <span className="text-accent">
          Ragul Sankar
        </span>
      </a>

      <div className="flex items-center gap-3 sm:gap-5 md:gap-7">

        {/* Navigation Links */}

        <ul className="hidden gap-[26px] md:flex">

          {links.map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                className="group relative text-[0.84rem] font-medium"
              >
                {label}

                <span className="absolute -bottom-[5px] left-0 h-[1.5px] w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}

          {/* Resume */}

          <li>
            <a
              href={RESUME}
              target="_blank"
              rel="noreferrer"
              className="group relative text-[0.84rem] font-medium"
            >
              Resume

              <span className="absolute -bottom-[5px] left-0 h-[1.5px] w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          </li>
        </ul>

        {/* Sub-pages — deliberately outside the md-only list so they stay
            reachable on mobile, where the section links are hidden */}

        <div className="flex flex-none items-center gap-2">
          <a
            href="#/play"
            className="group flex items-center gap-[6px] rounded-full border border-accent/40 px-[12px] py-[5px] text-[0.76rem] font-semibold text-accent transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-white"
          >
            <span className="h-[6px] w-[6px] rounded-full bg-accent transition-colors group-hover:bg-white" />
            Play
          </a>

          <a
            href="#/compiler"
            className="hidden rounded-full border border-line-2 px-[12px] py-[5px] text-[0.76rem] font-semibold text-muted transition-colors duration-300 hover:border-accent hover:text-accent sm:block"
          >
            Compiler
          </a>
        </div>

        {/* Theme Toggle */}

        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="relative h-7 w-[52px] flex-none rounded-full border border-line-2 bg-surface transition-colors duration-500"
        >

          {/* Toggle Circle */}

          <span
            className={`absolute top-[3px] left-[3px] z-10 flex h-5 w-5 items-center justify-center rounded-full bg-accent shadow-md transition-transform duration-500 ${
              theme === 'dark'
                ? 'translate-x-6'
                : ''
            }`}
            style={{
              transitionTimingFunction:
                'cubic-bezier(.6,.2,.2,1)',
            }}
          >
            {theme === 'light' ? (

              /* Sun Icon Inside Knob */

              <svg
                className="h-[11px] w-[11px] stroke-white stroke-2"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle cx="12" cy="12" r="4" />

                <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
              </svg>

            ) : (

              /* Moon Icon Inside Knob */

              <svg
                className="h-[11px] w-[11px] stroke-white stroke-2"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
              </svg>

            )}
          </span>

          {/* Background Sun */}

          <svg
            className="absolute top-[6px] left-[7px] h-[14px] w-[14px] fill-none stroke-muted stroke-2 opacity-50"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="4" />

            <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
          </svg>

          {/* Background Moon */}

          <svg
            className="absolute top-[6px] right-[7px] h-[14px] w-[14px] fill-none stroke-muted stroke-2 opacity-50"
            viewBox="0 0 24 24"
          >
            <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
          </svg>
        </button>

        {/* Menu button — only below md, where the section links are hidden */}

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] border border-line-2 md:hidden"
        >
          <span className="relative block h-[12px] w-[18px]">
            <span
              className={`absolute left-0 block h-[1.8px] w-full bg-text transition-all duration-300 ${
                open ? 'top-[5px] rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-[5px] block h-[1.8px] w-full bg-text transition-opacity duration-200 ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-[1.8px] w-full bg-text transition-all duration-300 ${
                open ? 'top-[5px] -rotate-45' : 'top-[10px]'
              }`}
            />
          </span>
        </button>
      </div>
      </div>

      {/* Mobile menu panel */}

      <div
        id="mobile-menu"
        className={`absolute inset-x-0 top-full origin-top border-b border-line shadow-[0_18px_40px_-24px_var(--shadow)] transition-all duration-300 md:hidden ${
          open
            ? 'pointer-events-auto visible translate-y-0 opacity-100'
            : 'pointer-events-none invisible -translate-y-2 opacity-0'
        }`}
        /* fully opaque: the hero headline showed straight through a
           translucent panel and made the links hard to read */
        style={{ background: 'var(--bg)' }}
      >
        <ul className="flex flex-col px-5 py-2">
          {links.map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="block border-b border-line py-[13px] text-[0.95rem] font-medium"
              >
                {label}
              </a>
            </li>
          ))}

          <li>
            <a
              href="#/compiler"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="block border-b border-line py-[13px] text-[0.95rem] font-medium"
            >
              Online compiler
            </a>
          </li>

          <li>
            <a
              href={RESUME}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="block py-[13px] text-[0.95rem] font-semibold text-accent"
            >
              Resume ↗
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}