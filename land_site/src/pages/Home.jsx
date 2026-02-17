import { useI18n } from '../i18n/LanguageProvider';

const Home = () => {
  const { t } = useI18n();
  return (
    <div className="page">
      <section className="hero">
        <div className="page-content hero-content">
          <h1>{t('home.title')}</h1>
          <p className="hero-subtitle">{t('home.subtitle')}</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
