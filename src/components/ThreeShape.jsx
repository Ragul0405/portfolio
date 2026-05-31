import { useEffect, useState } from 'react'

const logs = [
  'Starting Django server...',
  'Connected to PostgreSQL',
  'REST API running on port 8000',
  'JWT authentication initialized',
  'Monitoring active requests...',
  'Deployment successful',
]

export default function ThreeShape() {
  const [visibleLogs, setVisibleLogs] = useState([])

  useEffect(() => {
    let index = 0

    const interval = setInterval(() => {
      setVisibleLogs((prev) => {
        const next = [...prev, logs[index]]

        if (next.length > 5) {
          next.shift()
        }

        return next
      })

      index = (index + 1) % logs.length
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden lg:block">

      {/* Glow */}

      <div
        className="absolute right-[10%] top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%)',
        }}
      />

      {/* Dashboard */}

      <div className="absolute right-[5%] top-1/2 w-[400px] -translate-y-1/2 space-y-4">

        {/* Status Card */}

        <div className="rounded-[20px] border border-line bg-surface/90 p-5 shadow-[0_20px_60px_-20px_var(--shadow)] backdrop-blur-xl">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent">
                Backend Status
              </p>

              <h3 className="mt-1 text-[1.05rem] font-semibold text-text">
                Production Systems
              </h3>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">

              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

              <span className="font-mono text-[0.68rem] text-emerald-500">
                Online
              </span>
            </div>
          </div>

          {/* Metrics */}

          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-[14px] border border-line bg-bg p-4">
              <p className="font-mono text-[0.68rem] text-muted">
                APIs
              </p>

              <h4 className="mt-2 text-[1.5rem] font-bold text-text">
                24+
              </h4>
            </div>

            <div className="rounded-[14px] border border-line bg-bg p-4">
              <p className="font-mono text-[0.68rem] text-muted">
                Database
              </p>

              <h4 className="mt-2 text-[1.1rem] font-bold text-text">
                PostgreSQL
              </h4>
            </div>
          </div>
        </div>

        {/* Logs */}

        <div className="rounded-[20px] border border-line bg-surface/90 p-5 shadow-[0_20px_60px_-20px_var(--shadow)] backdrop-blur-xl">

          <div className="mb-4 flex items-center gap-2">

            <div className="h-2 w-2 rounded-full bg-accent" />

            <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-muted">
              Live Server Logs
            </span>
          </div>

          <div className="space-y-2 font-mono text-[0.74rem]">

            {visibleLogs.map((log, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-text animate-[fadeIn_0.4s_ease]"
              >
                <span className="text-accent">
                  $
                </span>

                <span>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}