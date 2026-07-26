/* Shared chrome for every game card, so 13 games don't each re-implement a
   header, a stat row and a button. */

export function GameShell({ label, stats = [], action, children, note }) {
  return (
    <div
      data-game={label}
      className="flex h-full flex-col overflow-hidden rounded-[16px] border border-line bg-surface shadow-[0_24px_60px_-34px_var(--shadow)]"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line px-4 py-3">
        <span className="font-mono text-[0.66rem] uppercase tracking-[0.13em] text-accent">
          {label}
        </span>

        {stats.map((s) => (
          <span key={s.label} className="font-mono text-[0.7rem] text-muted">
            {s.label} <b className="text-text">{s.value}</b>
          </span>
        ))}

        {action && <div className="ml-auto flex-none">{action}</div>}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">{children}</div>

      {note && (
        <div className="border-t border-line px-4 py-[9px] font-mono text-[0.64rem] leading-relaxed text-muted">
          {note}
        </div>
      )}
    </div>
  )
}

export function Btn({ children, onClick, tone = 'solid', className = '', ...rest }) {
  const base =
    'rounded-[8px] px-[13px] py-[5px] text-[0.72rem] font-semibold transition-colors duration-200 disabled:opacity-40'
  const tones = {
    solid: 'bg-accent text-white hover:brightness-110',
    ghost:
      'border border-line-2 text-muted hover:border-text hover:text-text',
  }
  return (
    <button onClick={onClick} className={`${base} ${tones[tone]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

/* An answer button with correct / incorrect states. */
export function Opt({ children, state, ...rest }) {
  const look =
    state === 'good'
      ? 'border-accent bg-accent/10 text-accent'
      : state === 'bad'
      ? 'border-line-2 bg-bg-2 text-muted line-through'
      : 'border-line-2 hover:border-accent'
  return (
    <button
      className={`rounded-[9px] border px-[11px] py-[9px] text-left font-mono text-[0.76rem] leading-snug text-text transition-colors duration-200 disabled:cursor-default ${look}`}
      {...rest}
    >
      {children}
    </button>
  )
}
