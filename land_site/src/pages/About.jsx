import { useI18n } from '../i18n/LanguageProvider';
import './About.css';

const About = () => {
  const { t } = useI18n();
  return (
    <main className="about-route">
      <div className="page-content about-page">
        <h1>{t('about.title')}</h1>
        
        <div className="about-bio">
          <p>{t('about.intro')}</p>
          <p>{t('about.skills')}</p>
          <p>{t('about.approach')}</p>
          <p className="about-cta">{t('about.cta')}</p>
        </div>
      </div>
    </main>
  );
};

export default About;
