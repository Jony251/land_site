import OwnerPhoto from '../Components/OwnerPhoto/OwnerPhoto.comp';
import TechStrip from '../Components/TechStrip/TechStrip.comp';
import { OWNER_NAME } from '../config/owner';
import useI18n from '../i18n/useI18n';
import RevealText from '../motion/RevealText';
import TransitionLink from '../motion/TransitionLink';
import './About.css';

const BIO_KEYS = ['intro', 'skills', 'approach', 'range'];

/**
 * About page.
 *
 * Output:
 * - Owner photo and name, big heading, first-person bio, link to `/contact`, technology strip.
 */
const About = () => {
  const { t, lang } = useI18n();
  const name = OWNER_NAME[lang];

  return (
    <main className="about-route section-paper">
      <div className="page-content about-page">
        <div className="about-head">
          <OwnerPhoto alt={name} className="about-photo" />
          <div>
            <p className="about-name">{name}</p>
            <RevealText as="h1" className="display about-title">
              {t('about.title')}
            </RevealText>
          </div>
        </div>
        <div className="about-bio">
          {BIO_KEYS.map((key) => (
            <p key={key}>{t(`about.${key}`)}</p>
          ))}
        </div>
        <TransitionLink className="btn about-cta" to="/contact" label={t('nav.contact')}>
          {t('about.cta')}
        </TransitionLink>
        <TechStrip />
      </div>
    </main>
  );
};

export default About;
