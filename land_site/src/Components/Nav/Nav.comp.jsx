import { Link } from 'react-router-dom'
import './Nav.comp.css'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher.comp'
import { useI18n } from '../../i18n/LanguageProvider'

const Nav = () => {
  const { t } = useI18n();
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/" className="logo-link">
          <img 
            src="/logo_NO_font.png" 
            className="logo" 
            alt="Blue Cat" 
          />
          <span>Blue Cat</span>
        </Link>
      </div>
      
      <ul className="nav-links">
        <li><Link to="/">{t('nav.home')}</Link></li>
        <li><Link to="/about">{t('nav.about')}</Link></li>
        <li><Link to="/works">{t('nav.works')}</Link></li>
        <li><Link to="/contact">{t('nav.contact')}</Link></li>
      </ul>

      <div className="nav-actions">
        <LanguageSwitcher />
      </div>
    </nav>
  )
}

export default Nav