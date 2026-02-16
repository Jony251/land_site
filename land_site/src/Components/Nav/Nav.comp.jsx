import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Nav.comp.css'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher.comp'
import ThemeToggle from '../ThemeToggle/ThemeToggle.comp'
import { useI18n } from '../../i18n/LanguageProvider'
import { trackCtaClick } from '../../lib/analytics'

const Nav = () => {
  const { t } = useI18n()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleQuoteClick = () => {
    trackCtaClick('nav_get_quote')
  }

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/works', label: t('nav.works') },
    { to: '/contact', label: t('nav.contact') },
  ]

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-shell">
        <div className="nav-logo">
          <Link to="/" className="logo-link" aria-label="Blue Cat home">
            <span className="logo-mark" aria-hidden="true">
              BC
            </span>
            <span className="logo-text">Blue Cat</span>
          </Link>
        </div>

        <button
          type="button"
          className={`menu-toggle ${mobileOpen ? 'active' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <li className="mobile-only">
            <a className="btn ghost small" href="/Blue-Cat-CV.txt" download>
              Download CV
            </a>
          </li>
          <li className="mobile-only">
            <Link className="btn primary small" to="/contact" onClick={handleQuoteClick}>
              Get a Quote
            </Link>
          </li>
        </ul>

        <div className="nav-actions">
          <a className="btn ghost small desktop-only" href="/Blue-Cat-CV.txt" download>
            Download CV
          </a>
          <ThemeToggle />
          <LanguageSwitcher />
          <Link
            className="btn primary small desktop-only"
            to="/contact"
            onClick={handleQuoteClick}
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Nav