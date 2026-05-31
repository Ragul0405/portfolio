// import Reveal from './Reveal.jsx'
// import SectionHead from './SectionHead.jsx'

// const jobs = [
//   {
//     year: '2025', span: 'Mar 2025 — Present', role: 'Backend Developer', co: 'Company Name · Full-time',
//     points: [
//       'Built and maintained REST APIs serving [X] requests/day with [Y]ms average latency.',
//       'Optimized database queries and added caching, cutting response times by [Z]%.',
//       'Wrote unit and integration tests, raising coverage and reducing production bugs.',
//     ],
//     tags: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'],
//   },
//   {
//     year: '2024', span: 'Jun 2024 — Feb 2025', role: 'Backend Developer Intern', co: 'Company / Startup · Internship',
//     points: [
//       'Implemented new API endpoints from spec through to deployment.',
//       'Helped migrate a service to a containerized setup with Docker.',
//       'Learned code review, CI/CD pipelines, and on-call basics in a real team.',
//     ],
//     tags: ['Python', 'FastAPI', 'Git'],
//   },
//   {
//     year: '2024', span: 'Personal · Ongoing', role: 'Self-Directed & Freelance', co: 'Independent',
//     points: [
//       'Built back-end side projects to learn new tools (see Work below).',
//       'Designed schemas and APIs for small client apps.',
//     ],
//     tags: ['AWS', 'SQL', 'REST'],
//   },
// ]

// export default function Experience() {
//   return (
//     <section id="experience" className="relative z-[2] py-[120px]">
//       <div className="mx-auto max-w-content px-8">
//         <SectionHead num="02" title="Experience" />
//         {jobs.map((j, i) => (
//           <Reveal
//             key={i}
//             className={`group grid grid-cols-1 gap-10 border-t border-line py-[38px] transition-[padding] duration-300 hover:pl-[14px] sm:grid-cols-[150px_1fr] ${
//               i === jobs.length - 1 ? 'border-b' : ''
//             }`}
//           >
//             <div className="flex items-baseline gap-[14px] sm:block">
//               <div className="font-mono text-[1.5rem] font-medium">{j.year}</div>
//               <div className="font-mono text-[0.72rem] text-muted sm:mt-[4px]">{j.span}</div>
//             </div>
//             <div>
//               <div className="font-display text-[1.5rem] font-bold">{j.role}</div>
//               <span className="mb-4 inline-block text-[0.95rem] font-semibold text-accent">{j.co}</span>
//               <ul className="space-y-[9px]">
//                 {j.points.map((p, k) => (
//                   <li key={k} className="relative pl-[22px] text-muted before:absolute before:left-0 before:font-bold before:text-accent before:content-['›']">
//                     {p}
//                   </li>
//                 ))}
//               </ul>
//               <div className="mt-4 flex flex-wrap gap-2">
//                 {j.tags.map((t) => (
//                   <span key={t} className="rounded-full border border-line-2 px-[11px] py-[4px] font-mono text-[0.68rem] text-muted">
//                     {t}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </Reveal>
//         ))}
//       </div>
//     </section>
//   )
// }


import Reveal from './Reveal.jsx'
import SectionHead from './SectionHead.jsx'

const jobs = [
  {
    year: '2025',
    span: 'Mar 2025 — Present',

    role: 'Backend Developer',

    co: 'Emayam Technology · Full-time',

    points: [
      'Developed and maintained REST APIs using Python, Django, and Django REST Framework.',
      'Worked on authentication systems, workflow automation, and backend business logic.',
      'Integrated PostgreSQL/MySQL databases and improved API performance and reliability.',
    ],

    tags: ['Python', 'Django', 'DRF', 'PostgreSQL'],
  },

  {
    year: '2024',
    span: 'Jun 2024 — Jan 2025',

    role: 'Python Full Stack Intern',

    co: 'Besant Technologies · Internship',

    points: [
      'Learned backend development fundamentals using Python and Django.',
      'Worked on REST APIs, database operations, and backend application development.',
      'Built mini projects and improved debugging, Git, and API testing skills.',
    ],

    tags: ['Python', 'Django', 'Git', 'Postman'],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="relative z-[2] py-[120px]">
      <div className="mx-auto max-w-content px-8">
        <SectionHead num="02" title="Experience" />

        {jobs.map((j, i) => (
          <Reveal
            key={i}
            className={`group grid grid-cols-1 gap-10 border-t border-line py-[38px] transition-[padding] duration-300 hover:pl-[14px] sm:grid-cols-[150px_1fr] ${
              i === jobs.length - 1 ? 'border-b' : ''
            }`}
          >
            <div className="flex items-baseline gap-[14px] sm:block">
              <div className="font-mono text-[1.5rem] font-medium">
                {j.year}
              </div>

              <div className="font-mono text-[0.72rem] text-muted sm:mt-[4px]">
                {j.span}
              </div>
            </div>

            <div>
              <div className="font-display text-[1.5rem] font-bold">
                {j.role}
              </div>

              <span className="mb-4 mt-1 inline-block text-[0.95rem] font-semibold text-accent">
                {j.co}
              </span>

              <ul className="space-y-[9px]">
                {j.points.map((p, k) => (
                  <li
                    key={k}
                    className="relative pl-[22px] text-muted before:absolute before:left-0 before:font-bold before:text-accent before:content-['›']"
                  >
                    {p}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                {j.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line-2 px-[11px] py-[4px] font-mono text-[0.68rem] text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}