import { useEffect, useState } from 'react'
import TransitionLink from '../../motion/TransitionLink'
import './Nav.comp.css'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher.comp'
import useI18n from '../../i18n/useI18n'

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
          <TransitionLink to="/" className="logo-link" aria-label="Blue Cat home" label="Blue Cat" onClick={handleNavClick}>
            <span className="logo-mark" aria-hidden="true">
              <img className="logo-img" src="/logo_NO_font.png" alt="" />
            </span>
            <span className="logo-text">Blue Cat</span>
          </TransitionLink>
        </div>

        <div className="nav-spacer" aria-hidden="true" />

        <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          <li>
            <TransitionLink className="nav-link" to="/works" label={t('nav.works')} onClick={handleNavClick}>
              {t('nav.works')}
            </TransitionLink>
          </li>

          <li>
            <TransitionLink className="nav-link" to="/services" label={t('nav.services')} onClick={handleNavClick}>
              {t('nav.services')}
            </TransitionLink>
          </li>

          <li>
            <TransitionLink className="nav-link" to="/about" label={t('nav.about')} onClick={handleNavClick}>
              {t('nav.about')}
            </TransitionLink>
          </li>

          <li>
            <TransitionLink className="nav-link" to="/contact" label={t('nav.contact')} onClick={handleNavClick}>
              {t('nav.contact')}
            </TransitionLink>
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