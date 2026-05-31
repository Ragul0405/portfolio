const links = [
  ['About', '#about'],
  ['Experience', '#experience'],
  ['Stack', '#skills'],
  ['Work', '#work'],
  ['Contact', '#contact'],
]

const RESUME = '/Ragul_Resume.pdf'

export default function Nav({ theme, toggle, scrolled }) {
  return (
    <nav
      className={`fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-8 py-[18px] backdrop-blur-md transition-colors duration-500 ${
        scrolled
          ? 'border-b border-line'
          : 'border-b border-transparent'
      }`}
      style={{
        background:
          'color-mix(in srgb, var(--bg) 70%, transparent)',
      }}
    >
      <a
        href="#top"
        className="font-display text-[1.1rem] font-extrabold tracking-tight"
      >
        <span className="text-accent">
          Ragul Sankar
        </span>
      </a>

      <div className="flex items-center gap-7">

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

          {/* Resume Link */}

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

        {/* Theme Toggle */}

        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="relative h-7 w-[52px] flex-none rounded-full border border-line-2 bg-surface transition-colors"
        >
          <span
            className={`absolute top-[3px] left-[3px] h-5 w-5 rounded-full bg-accent transition-transform duration-500 ${
              theme === 'light'
                ? 'translate-x-6'
                : ''
            }`}
            style={{
              transitionTimingFunction:
                'cubic-bezier(.6,.2,.2,1)',
            }}
          />

          <svg
            className="absolute top-[6px] left-[6px] h-[15px] w-[15px] fill-none stroke-muted stroke-2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="4" />

            <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
          </svg>

          <svg
            className="absolute top-[6px] right-[6px] h-[15px] w-[15px] fill-none stroke-muted stroke-2"
            viewBox="0 0 24 24"
          >
            <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
          </svg>
        </button>
      </div>
    </nav>
  )
}