import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/LanguageProvider';
import Info from '../Components/Info/Info.comp';
import TechStrip from '../Components/TechStrip/TechStrip.comp';

const Home = () => {
  const { t } = useI18n();
  return (
    <div className="page">
      <section className="hero">
        <div className="page-content hero-content">
          <h1>{t('home.title')}</h1>
          <p className="hero-subtitle">{t('home.subtitle')}</p>
          <div className="hero-actions">
            <Link className="btn primary" to="/contact">{t('home.ctaContact')}</Link>
            <Link className="btn" to="/works">{t('home.ctaWorks')}</Link>
          </div>
        </div>
      </section>

      <TechStrip />
      <Info />
    </div>
  );
};

export default Home;
