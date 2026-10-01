import { useEffect, useRef, useState } from 'react'
import TransitionLink from '../../motion/TransitionLink'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher.comp'
import useI18n from '../../i18n/useI18n'
import './Nav.comp.css'

const LINKS = [
  { to: '/works', key: 'nav.works' },
  { to: '/services', key: 'nav.services' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
]
const MENU_LINKS = [{ to: '/', key: 'nav.home' }, ...LINKS]
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Site header.
 *
 * Output:
 * - Text wordmark, inline links and the language switcher.
 * - After one viewport of scrolling the header collapses into a round floating menu button
 *   (on small screens the button is always shown). The button opens a full-screen menu that
 *   closes on Escape (focus returns to the button) or when a link is chosen. While the menu is
 *   open, Tab and Shift+Tab are trapped in a cycle of the menu button and the menu contents.
 */
const Nav = () => {
  const { t } = useI18n()
  const [collapsed, setCollapsed] = useState(false)
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const update = () => setCollapsed(window.scrollY > window.innerHeight)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const root = document.documentElement
    root.classList.add('menu-open')
    menuRef.current?.querySelector('a')?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
        return
      }
      if (event.key !== 'Tab') return
      // Rebuilt on every press: the menu's language switcher can re-render its buttons.
      const cycle = [buttonRef.current, ...(menuRef.current?.querySelectorAll(FOCUSABLE) ?? [])].filter(Boolean)
      const first = cycle[0]
      const last = cycle[cycle.length - 1]
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      root.classList.remove('menu-open')
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`navbar ${collapsed ? 'navbar--collapsed' : ''}`.trim()}>
      <div className="nav-shell">
        <TransitionLink to="/" className="nav-wordmark" label="Blue Cat">
          Blue Cat
        </TransitionLink>
        <nav className="nav-inline" aria-label={t('nav.aria')}>
          <ul className="nav-links">
            {LINKS.map(({ to, key }) => (
              <li key={to}>
                <TransitionLink className="nav-link" to={to} label={t(key)}>
                  {t(key)}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-actions">
          <LanguageSwitcher />
        </div>
      </div>

      <button
        ref={buttonRef}
        type="button"
        className={`nav-menu-button ${open ? 'is-open' : ''}`.trim()}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? t('nav.close') : t('nav.menu')}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {open && (
        <div
          id="site-menu"
          ref={menuRef}
          className="site-menu section-ink"
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.menu')}
          data-lenis-prevent
        >
          <nav>
            <ul className="site-menu-links">
              {MENU_LINKS.map(({ to, key }) => (
                <li key={to}>
                  <TransitionLink className="site-menu-link" to={to} label={t(key)} onClick={close}>
                    {t(key)}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
          <LanguageSwitcher />
        </div>
      )}
    </header>
  )
}

export default Nav
