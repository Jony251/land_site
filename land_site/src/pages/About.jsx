import { useI18n } from '../i18n/LanguageProvider';
import './About.css';

const About = () => {
  const { t } = useI18n();
  return (
    <div className="page">
      <div className="page-content about-page">
        <h1>{t('about.title')}</h1>
        
        <div className="about-bio">
          <p>{t('about.intro')}</p>
          <p>{t('about.skills')}</p>
          <p>{t('about.approach')}</p>
          <p className="about-cta">{t('about.cta')}</p>
        </div>

        <div className="card-grid">
          <a className="card-link" href="https://github.com/Jony251" target="_blank" rel="noreferrer">
            <h3>{t('about.githubTitle')}</h3>
            <p>{t('about.githubText')}</p>
          </a>
          <a className="card-link" href="https://www.linkedin.com/in/evgeny-nemchenko/" target="_blank" rel="noreferrer">
            <h3>{t('about.linkedinTitle')}</h3>
            <p>{t('about.linkedinText')}</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
