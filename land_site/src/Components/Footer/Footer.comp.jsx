import './Footer.comp.css';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/LanguageProvider';
import { useSiteCopy } from '../../i18n/siteCopy';

const Footer = () => {
  const year = new Date().getFullYear();
  const { t } = useI18n();
  const sc = useSiteCopy();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-branding">
          <strong>Blue Cat</strong>
          <p>{sc('footer.tagline')}</p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/about">{t('nav.about')}</Link>
          <Link to="/works">{sc('footer.portfolio')}</Link>
          <Link to="/contact">{t('nav.contact')}</Link>
        </nav>

        <div className="footer-meta">
          <a href="https://github.com/Jony251" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/evgeny-nemchenko/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="/Blue-Cat-CV.txt" download>
            {sc('nav.downloadCv')}
          </a>
        </div>

        <p className="footer-copyright">
          © {year} Blue Cat. {sc('footer.copyright')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
