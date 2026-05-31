import { useState, useEffect, useCallback } from 'react'

function apply(t) {
  document.documentElement.classList.toggle('dark', t === 'dark')
}

export default function useTheme() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    let t = 'dark'
    try {
      t = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    } catch (e) {}
    apply(t)
    setTheme(t)
  }, [])

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      apply(next)
      try { localStorage.setItem('theme', next) } catch (e) {}
      return next
    })
  }, [])

  return [theme, toggle]
}
