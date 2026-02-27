import { Link } from 'react-router-dom';
import useI18n from '../i18n/useI18n';
import './About.css';
import TechStrip from '../Components/TechStrip/TechStrip.comp';

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
          <Link className="about-cta" to="/contact">{t('about.cta')}</Link>
        </div>

        <TechStrip />
      </div>
    </main>
  );
};

export default About;
