import Reveal from './Reveal.jsx'
import SectionHead from './SectionHead.jsx'

export default function About() {
  return (
    <section id="about" className="relative z-[2] py-[120px]">
      <div className="mx-auto max-w-content px-8">
        <SectionHead num="01" title="About" />

        <div className="grid grid-cols-1 items-start gap-[60px] md:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div className="mb-7 flex items-center gap-[22px]">
              <div className="avatar">
                <div className="ring" />

                <div className="inner">
                  {/* Replace src with your photo */}
                  <img
                    src="/ragul.png"
                    alt="Ragul Sankar"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling.style.display = 'block'
                    }}
                  />

                  <svg
                    className="h-[54px] w-[54px] text-muted"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ display: 'none' }}
                  >
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z" />
                  </svg>
                </div>
              </div>

              <div>
                <div className="font-display text-[1.55rem] font-bold leading-[1.1]">
                  Ragul Sankar
                </div>

                <div className="mt-[6px] font-mono text-[0.74rem] uppercase tracking-[0.14em] text-accent">
                  Backend Developer
                </div>
              </div>
            </div>

            <p className="mb-[18px] text-[1.16rem] leading-[1.9] text-muted">
              I'm a backend developer focused on building reliable APIs,
              authentication systems, and business workflows using
              <strong className="font-semibold text-text">
                {' '}Python, Django, and DRF
              </strong>.
            </p>

            <p className="mb-[18px] text-[1.16rem] leading-[1.9] text-muted">
              Over the past year, I've worked on REST APIs, database management,
              workflow automation, payment integrations, and desktop executable
              applications using PyInstaller in real-world production projects.
            </p>

            <p className="text-[1.16rem] leading-[1.9] text-muted">
              Continuously improving my backend engineering skills through
              hands-on production development.
            </p>
          </Reveal>

          <Reveal className="overflow-hidden rounded-[14px] border border-line bg-bg-2 font-mono text-[0.84rem] shadow-[0_20px_50px_-28px_var(--shadow)]">
            <div className="flex gap-[7px] border-b border-line px-4 py-[13px]">
              <i className="h-[11px] w-[11px] rounded-full bg-accent" />
              <i className="h-[11px] w-[11px] rounded-full bg-line-2" />
              <i className="h-[11px] w-[11px] rounded-full bg-line-2" />
            </div>

            <div className="px-[18px] pb-[22px] pt-[18px] leading-[2] text-muted">
              <div>
                <span className="text-accent">$</span>{' '}
                <span className="text-text">whoami</span>
              </div>

              <div>backend_developer</div>

              <div>
                <span className="text-accent">$</span>{' '}
                <span className="text-text">cat stack.json</span>
              </div>

              <div>{'{'}</div>

              <div>
                &nbsp;&nbsp;"backend": ["Python", "Django", "DRF"],
              </div>

              <div>
                &nbsp;&nbsp;"database": ["PostgreSQL", "MySQL"],
              </div>

              <div>
                &nbsp;&nbsp;"tools": ["Git", "Postman", "PyInstaller"]
              </div>

              <div>{'}'}</div>

              <div>
                <span className="text-accent">$</span>{' '}
                <span className="text-text">status</span>
              </div>

              <div>
                actively_building_and_learning
                <span className="text-accent">▋</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}