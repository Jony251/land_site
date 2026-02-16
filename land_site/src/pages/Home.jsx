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
            <a className="btn primary" href="#contact">{t('home.ctaContact')}</a>
            <a className="btn" href="#works">{t('home.ctaWorks')}</a>
          </div>
        </div>
      </section>

      <TechStrip />
      <Info />
    </div>
  );
};

export default Home;
