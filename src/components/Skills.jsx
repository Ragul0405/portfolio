// import Reveal from './Reveal.jsx'
// import SectionHead from './SectionHead.jsx'

// const cols = [
//   ['Languages', ['JavaScript / TS', 'Python', 'SQL', 'Bash']],
//   ['Backend', ['Node.js / Express', 'FastAPI', 'REST APIs', 'GraphQL (basics)']],
//   ['Data', ['PostgreSQL', 'Redis', 'MongoDB', 'Query tuning']],
//   ['DevOps', ['Docker', 'AWS (EC2/S3)', 'CI/CD', 'Git & GitHub']],
// ]

// export default function Skills() {
//   return (
//     <section id="skills" className="relative z-[2] py-[120px]">
//       <div className="mx-auto max-w-content px-8">
//         <SectionHead num="03" title="Stack" />
//         <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
//           {cols.map(([title, items]) => (
//             <Reveal
//               key={title}
//               className="rounded-[14px] border border-line bg-surface p-6 transition-colors duration-300 hover:border-accent"
//             >
//               <h3 className="mb-[14px] font-mono text-[0.72rem] uppercase tracking-[0.1em] text-accent">{title}</h3>
//               <ul>
//                 {items.map((it, i) => (
//                   <li
//                     key={it}
//                     className={`py-[6px] text-[0.96rem] ${i === items.length - 1 ? '' : 'border-b border-line'}`}
//                   >
//                     {it}
//                   </li>
//                 ))}
//               </ul>
//             </Reveal>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }



import Reveal from './Reveal.jsx'
import SectionHead from './SectionHead.jsx'

import {
  SiPython,
  SiDjango,
  SiPostgresql,
  SiMysql,
  SiGit,
  SiGithub,
  SiPostman,
} from 'react-icons/si'

import { FaServer } from 'react-icons/fa'

const skills = [
  {
    name: 'Python',
    icon: <SiPython size={26} />,
  },

  {
    name: 'Django',
    icon: <SiDjango size={26} />,
  },

  {
    name: 'Django REST Framework',
    icon: <FaServer size={26} />,
  },

  {
    name: 'REST APIs',
    icon: <FaServer size={26} />,
  },

  {
    name: 'PostgreSQL',
    icon: <SiPostgresql size={26} />,
  },

  {
    name: 'MySQL',
    icon: <SiMysql size={26} />,
  },

  {
    name: 'Git & GitHub',
    icon: <SiGithub size={26} />,
  },

  {
    name: 'Postman',
    icon: <SiPostman size={26} />,
  },

  {
    name: 'PyInstaller',
    icon: <SiPython size={26} />,
  },
]

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative z-[2] overflow-hidden py-[120px]"
    >
      <div className="mx-auto max-w-content px-8">
        <SectionHead num="03" title="Stack" />

        <Reveal>
          <div className="relative overflow-hidden rounded-[24px] border border-line bg-surface p-8 shadow-[0_20px_60px_-30px_var(--shadow)]">

            {/* background glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-[240px] w-[240px] rounded-full bg-accent/10 blur-3xl" />

            {/* heading */}
            <div className="mb-10">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-accent">
                Technologies & Tools
              </p>

              <h3 className="mt-3 font-display text-[2rem] font-bold leading-tight">
                Backend stack
                <span className="grad-text"> I work with.</span>
              </h3>
            </div>

            {/* skills */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {skills.map((skill, index) => (
                <div
                  key={skill.name}
                  className="group relative overflow-hidden rounded-[18px] border border-line bg-bg-2 p-5 transition-all duration-300 hover:-translate-y-[4px] hover:border-accent"
                >
                  {/* hover glow */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-accent/5" />
                  </div>

                  {/* icon */}
                  <div className="mb-5 text-accent transition-transform duration-300 group-hover:scale-110">
                    {skill.icon}
                  </div>

                  {/* skill name */}
                  <div className="text-[0.95rem] font-medium leading-[1.5] text-text">
                    {skill.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}