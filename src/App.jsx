import { useState, useEffect } from 'react'
import useTheme from './hooks/useTheme.js'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Experience from './components/Experience.jsx'
import Skills from './components/Skills.jsx'
import Work from './components/Work.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import CursorRabbit from './components/CursorRabbit'


export default function App() {
  const [theme, toggle] = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <CursorRabbit />
      <Nav theme={theme} toggle={toggle} scrolled={scrolled} />
      <Hero theme={theme} />
      <About />
      <Experience />
      <Skills />
      <Work />
      <Contact />
      <Footer />
    </>
  )
}
