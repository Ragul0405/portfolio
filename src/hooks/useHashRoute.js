import { useEffect, useState } from 'react'

/* Hash routing on purpose: the site is served from a GitHub Pages subpath
   (/portfolio/), where a real path like /play would 404 on refresh because
   there's no server to rewrite it. '#/play' survives reloads and direct links
   with no config and no router dependency.

   Section anchors (#about, #work) are NOT routes — anything that doesn't start
   with '#/' leaves us on the portfolio so the existing nav keeps working. */

export default function useHashRoute() {
  const read = () => {
    const h = window.location.hash
    return h.startsWith('#/') ? h.slice(1) : '/'
  }

  const [route, setRoute] = useState(read)

  useEffect(() => {
    const onChange = () => setRoute(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}
