import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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

  const handleNavClick = () => {
    setMobileOpen(false)
  }

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-shell">
        <div className="nav-logo">
          <Link to="/" className="logo-link" aria-label="Blue Cat home" onClick={handleNavClick}>
            <span className="logo-mark" aria-hidden="true">
              <img className="logo-img" src="/logo_NO_font.png" alt="" />
            </span>
            <span className="logo-text">Blue Cat</span>
          </Link>
        </div>

        <div className="nav-spacer" aria-hidden="true" />

        <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          <li>
            <Link className="nav-link" to="/about" onClick={handleNavClick}>
              {t('nav.about')}
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="/works" onClick={handleNavClick}>
              {t('nav.works')}
            </Link>
          </li>

          <li>
            <Link className="nav-link" to="/contact" onClick={handleNavClick}>
              {t('nav.contact')}
            </Link>
          </li>
        </ul>

        <div className="nav-actions">
          <LanguageSwitcher />
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
      </div>
    </header>
  )
}

export default Nav