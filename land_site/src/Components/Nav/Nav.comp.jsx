import './Nav.comp.css'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher.comp'
import { useI18n } from '../../i18n/LanguageProvider'

const Nav = () => {
  const { t } = useI18n();
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <a href="#home" className="logo-link">
          <img 
            src="/logo_NO_font.png" 
            className="logo" 
            alt="Blue Cat" 
          />
          <span>Blue Cat</span>
        </a>
      </div>
      
      <ul className="nav-links">
        <li><a href="#home">{t('nav.home')}</a></li>
        <li><a href="#about">{t('nav.about')}</a></li>
        <li><a href="#works">{t('nav.works')}</a></li>
        <li><a href="#contact">{t('nav.contact')}</a></li>
      </ul>

      <div className="nav-actions">
        <LanguageSwitcher />
      </div>
    </nav>
  )
}

export default Nav