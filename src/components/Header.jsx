import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import { navLinks } from '../data/nav.js'

export default function Header() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [heroNameHidden, setHeroNameHidden] = useState(false)

  useEffect(() => {
    if (!isHome) return

    const heroName = document.querySelector('.brand-name')
    if (!heroName) return

    const observer = new IntersectionObserver(([entry]) => setHeroNameHidden(!entry.isIntersecting))
    observer.observe(heroName)

    return () => observer.disconnect()
  }, [isHome])

  const showName = isHome ? heroNameHidden : true

  return (
    <header className={`top-bar${isHome ? ' top-bar-home' : ''}`}>
      <div className="name-block">
        {showName ? (
          <Link to="/" className="brand-link">
            <p className="brand">Aruneem Bhowmick</p>
          </Link>
        ) : null}
      </div>
      <nav className="nav-links">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  )
}
