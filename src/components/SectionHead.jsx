import Reveal from './Reveal.jsx'

export default function SectionHead({ num, title }) {
  return (
    <Reveal className="mb-[58px] flex items-baseline gap-[18px]">
      <span className="font-mono text-[0.8rem] text-accent">{num}</span>
      <h2 className="font-display text-[clamp(1.9rem,4vw,2.8rem)] font-bold tracking-[-0.02em]">{title}</h2>
    </Reveal>
  )
}
