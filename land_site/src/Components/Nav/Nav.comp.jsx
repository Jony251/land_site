import { useEffect, useState } from 'react'
import './Nav.comp.css'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher.comp'
import { useI18n } from '../../i18n/LanguageProvider'

const Nav = () => {
  const { t } = useI18n()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { href: '#home', label: t('nav.home') },
    { href: '#about', label: t('nav.about') },
    { href: '#works', label: t('nav.works') },
    { href: '#contact', label: t('nav.contact') },
  ]

  const handleNavClick = () => {
    setMobileOpen(false)
  }

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-shell">
        <div className="nav-logo">
          <a href="#home" className="logo-link" aria-label="Blue Cat home" onClick={handleNavClick}>
            <span className="logo-mark" aria-hidden="true">
              <img className="logo-img" src="/logo_NO_font.png" alt="" />
            </span>
            <span className="logo-text">Blue Cat</span>
          </a>
        </div>

        <button
          type="button"
          className={`menu-toggle ${mobileOpen ? 'active' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.href}>
              <a className="nav-link" href={item.href} onClick={handleNavClick}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}

export default Nav