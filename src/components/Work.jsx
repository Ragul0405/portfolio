// import Reveal from './Reveal.jsx'
// import SectionHead from './SectionHead.jsx'

// const projects = [
//   {
//     num: 'API/01', title: 'REST API Service',
//     desc: 'A short description: what the service does, the scale it handles, and the result you achieved.',
//     tags: ['Node.js', 'PostgreSQL', 'Docker'],
//   },
//   {
//     num: 'API/02', title: 'Data Pipeline',
//     desc: 'A short description: what data it processes, the problem it solved, and the impact.',
//     tags: ['Python', 'Redis', 'AWS'],
//   },
// ]

// function TiltCard({ p }) {
//   const onMove = (e) => {
//     const el = e.currentTarget
//     const r = el.getBoundingClientRect()
//     const px = (e.clientX - r.left) / r.width - 0.5
//     const py = (e.clientY - r.top) / r.height - 0.5
//     el.style.transform = `rotateY(${px * 9}deg) rotateX(${-py * 9}deg) translateY(-4px)`
//   }
//   const reset = (e) => { e.currentTarget.style.transform = '' }

//   return (
//     <div
//       onMouseMove={onMove}
//       onMouseLeave={reset}
//       className="group rounded-[16px] border border-line bg-surface p-8 transition-[box-shadow,border-color] duration-300 [transform-style:preserve-3d] hover:border-line-2 hover:shadow-[0_30px_60px_-30px_var(--shadow)]"
//     >
//       <span className="font-mono text-[0.72rem] text-accent">{p.num}</span>
//       <h3 className="my-[10px] mt-3 font-display text-[1.5rem] font-bold [transform:translateZ(30px)]">{p.title}</h3>
//       <p className="mb-[18px] text-[0.98rem] text-muted [transform:translateZ(18px)]">{p.desc}</p>
//       <div className="mb-[18px] flex flex-wrap gap-2 font-mono text-[0.66rem] text-muted">
//         {p.tags.map((t, i) => (
//           <span key={t}>{t}{i < p.tags.length - 1 ? ' ·' : ''}</span>
//         ))}
//       </div>
//       <a href="#" className="text-[0.9rem] font-semibold text-accent">
//         View on GitHub <span className="inline-block transition-all group-hover:ml-[5px]">→</span>
//       </a>
//     </div>
//   )
// }

// export default function Work() {
//   return (
//     <section id="work" className="relative z-[2] py-[120px]">
//       <div className="mx-auto max-w-content px-8">
//         <SectionHead num="04" title="Selected work" />
//         <div className="grid grid-cols-1 gap-6 [perspective:1200px] md:grid-cols-2">
//           {projects.map((p) => (
//             <Reveal key={p.num}>
//               <TiltCard p={p} />
//             </Reveal>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }




import Reveal from './Reveal.jsx'
import SectionHead from './SectionHead.jsx'

const projects = [
  {
    num: 'PROJECT/01',

    title: 'Empora — Employee Monitoring',

    desc:
      'Full stack employee monitoring platform with activity tracking, authentication, report generation, and a packaged desktop monitoring agent. Built the REST APIs with Django REST Framework, the dashboard in React, and shipped the desktop client via PyInstaller.',

    tags: ['Python', 'Django', 'REST APIs', 'React JS', 'PyInstaller'],

    link: 'https://empora-app.vkfotos.site/',
  },

  {
    num: 'PROJECT/02',

    title: 'Neem — Dress Shop E-Commerce',

    desc:
      'Full stack e-commerce store for a dress shop, delivered for a client. Built the product catalog, cart and checkout flow, order management, and role-based authentication as Django REST APIs, with a React storefront and an admin dashboard for inventory and orders.',

    tags: ['Python', 'Django', 'REST APIs', 'React JS'],

    link: 'https://vkfotos.site/',
  },
]

function TiltCard({ p }) {
  const onMove = (e) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()

    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5

    el.style.transform = `
      rotateY(${px * 9}deg)
      rotateX(${-py * 9}deg)
      translateY(-4px)
    `
  }

  const reset = (e) => {
    e.currentTarget.style.transform = ''
  }

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="group rounded-[16px] border border-line bg-surface p-8 transition-[box-shadow,border-color] duration-300 [transform-style:preserve-3d] hover:border-line-2 hover:shadow-[0_30px_60px_-30px_var(--shadow)]"
    >
      <span className="font-mono text-[0.72rem] text-accent">
        {p.num}
      </span>

      <h3 className="my-[10px] mt-3 font-display text-[1.5rem] font-bold leading-[1.3] [transform:translateZ(30px)]">
        {p.title}
      </h3>

      <p className="mb-[18px] text-[0.98rem] leading-[1.8] text-muted [transform:translateZ(18px)]">
        {p.desc}
      </p>

      <div className="mb-[18px] flex flex-wrap gap-2 font-mono text-[0.66rem] text-muted">
        {p.tags.map((t, i) => (
          <span key={t}>
            {t}
            {i < p.tags.length - 1 ? ' ·' : ''}
          </span>
        ))}
      </div>

      <a
        href={p.link}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center text-[0.9rem] font-semibold text-accent"
      >
        Visit Project

        <span className="ml-1 inline-block transition-all group-hover:ml-[6px]">
          →
        </span>
      </a>
    </div>
  )
}

export default function Work() {
  return (
    <section id="work" className="relative z-[2] py-[120px]">
      <div className="mx-auto max-w-content px-8">
        <SectionHead num="04" title="Selected work" />

        <div className="grid grid-cols-1 gap-6 [perspective:1200px] md:grid-cols-2">
          {projects.map((p) => (
            <Reveal key={p.num}>
              <TiltCard p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}