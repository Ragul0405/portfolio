// import ThreeShape from './ThreeShape.jsx'

// export default function Hero({ theme }) {
//   return (
//     <header id="top" className="relative flex min-h-screen items-center overflow-hidden">
//       <ThreeShape theme={theme} />

//       {/* glow */}
//       <div
//         className="pointer-events-none absolute top-1/2 right-[-4%] z-[1] h-[55vw] max-h-[680px] w-[55vw] max-w-[680px] -translate-y-1/2 blur-[24px]"
//         style={{
//           background:
//             'radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent), transparent 60%)',
//         }}
//       />

//       <div className="relative z-10 mx-auto w-full max-w-content px-8">
//         <div className="hero-rise mb-[26px] inline-flex items-center gap-[10px] font-mono text-[0.74rem] uppercase tracking-[0.14em] text-accent" style={{ animationDelay: '.1s' }}>
//           <span className="dot-pulse h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
//           Backend Developer · Open to work
//         </div>

//         <h1 className="mb-[26px] font-display text-[clamp(2.8rem,8.5vw,6.6rem)] font-extrabold leading-[0.96] tracking-[-0.03em]">
//           <span className="hero-rise block" style={{ animationDelay: '.2s' }}>Reliable systems,</span>
//           <span className="hero-rise grad-text block" style={{ animationDelay: '.35s' }}>built to scale.</span>
//         </h1>

//         <p className="hero-rise mb-[38px] max-w-[540px] text-[1.18rem] text-muted" style={{ animationDelay: '.5s' }}>
//           I design and build the APIs, services, and data layers that keep products running. One year
//           in — already shipping production back-ends that stay up.
//         </p>

//         <div className="hero-rise flex flex-wrap gap-4" style={{ animationDelay: '.65s' }}>
//           <a href="#experience" className="inline-flex items-center gap-2 rounded-[10px] bg-accent px-[26px] py-[14px] text-[0.92rem] font-semibold text-white transition-transform duration-300 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_-10px_var(--accent)]">
//             View experience
//           </a>
//           <a href="#contact" className="inline-flex items-center gap-2 rounded-[10px] border border-line-2 px-[26px] py-[14px] text-[0.92rem] font-semibold transition-all duration-300 hover:-translate-y-[3px] hover:border-accent hover:text-accent">
//             Get in touch
//           </a>
//         </div>
//       </div>
//     </header>
//   )
// }



import ThreeShape from './ThreeShape.jsx'

export default function Hero({ theme }) {
  return (
    <header id="top" className="relative flex min-h-screen items-center overflow-hidden">
      <ThreeShape theme={theme} />

      {/* glow */}
      <div
        className="pointer-events-none absolute top-1/2 right-[-4%] z-[1] h-[55vw] max-h-[680px] w-[55vw] max-w-[680px] -translate-y-1/2 blur-[24px]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent), transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-content px-8">
        <div
          className="hero-rise mb-[26px] inline-flex items-center gap-[10px] font-mono text-[0.74rem] uppercase tracking-[0.14em] text-accent"
          style={{ animationDelay: '.1s' }}
        >
          <span className="dot-pulse h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
          Backend Developer · Open to Work
        </div>

        <h1 className="mb-[26px] font-display text-[clamp(2.8rem,8.5vw,6.6rem)] font-extrabold leading-[0.96] tracking-[-0.03em]">
          <span
            className="hero-rise block"
            style={{ animationDelay: '.2s' }}
          >
          Reliable backend
          </span>

          <span
            className="hero-rise grad-text block"
            style={{ animationDelay: '.35s' }}
          >
          systems.
          </span>
        </h1>

        <p
          className="hero-rise mb-[38px] max-w-[620px] text-[1.18rem] leading-[1.8] text-muted"
          style={{ animationDelay: '.5s' }}
        >
          Backend Developer with 1.3 years of experience building REST APIs,
          authentication systems, workflow automation, and scalable backend
          services using Python, Django, DRF, PostgreSQL, and MySQL.
          Currently developing production-ready backend systems focused on
          reliability, performance, and clean architecture.
        </p>

        <div
          className="hero-rise flex flex-wrap gap-4"
          style={{ animationDelay: '.65s' }}
        >
          <a
            href="#experience"
            className="inline-flex items-center gap-2 rounded-[10px] bg-accent px-[26px] py-[14px] text-[0.92rem] font-semibold text-white transition-transform duration-300 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_-10px_var(--accent)]"
          >
            View Experience
          </a>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-[10px] border border-line-2 px-[26px] py-[14px] text-[0.92rem] font-semibold transition-all duration-300 hover:-translate-y-[3px] hover:border-accent hover:text-accent"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </header>
  )
}