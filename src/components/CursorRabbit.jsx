import { useEffect, useRef, useState } from 'react'

const requests = [
  'GET /api/users',
  'POST /auth/login',
  '200 OK · 18ms',
  'JWT verified',
  'Redis connected',
]

export default function DevCursor() {
  const cursorRef = useRef(null)

  const mouse = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  })

  const pos = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  })

  const [trails, setTrails] = useState([])

  useEffect(() => {
    const move = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

      if (Math.random() > 0.82) {
        const id = Date.now()

        const label =
          requests[
            Math.floor(Math.random() * requests.length)
          ]

        const trail = {
          id,
          x: e.clientX,
          y: e.clientY,
          label,
        }

        setTrails((prev) => [...prev.slice(-6), trail])

        setTimeout(() => {
          setTrails((prev) =>
            prev.filter((t) => t.id !== id)
          )
        }, 1200)
      }
    }

    window.addEventListener('mousemove', move)

    return () =>
      window.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    let frame

    const animate = () => {
      pos.current.x +=
        (mouse.current.x - pos.current.x) * 0.42

      pos.current.y +=
        (mouse.current.y - pos.current.y) * 0.42

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${pos.current.x}px, ${pos.current.y}px)`
      }

      frame = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <>
      {/* Smooth Cursor */}

      <div ref={cursorRef} className="dev-cursor" />

      {/* Trails */}

      {trails.map((trail) => (
        <div
          key={trail.id}
          className="trail-container"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`,
          }}
        >
          <div className="trail-dot" />

          <div className="trail-label">
            {trail.label}
          </div>
        </div>
      ))}
    </>
  )
}