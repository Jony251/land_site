import ServiceRows from '../Components/ServiceRows/ServiceRows.comp';
import useI18n from '../i18n/useI18n';
import Magnetic from '../motion/Magnetic';
import RevealText from '../motion/RevealText';
import TransitionLink from '../motion/TransitionLink';
import './Services.css';

/**
 * Services page.
 *
 * Output:
 * - Big heading and lead, the five service levels as numbered rows and a magnetic
 *   "Start a project" button to `/contact`.
 */
const Services = () => {
  const { t } = useI18n();

  return (
    <main className="services-route section-paper">
      <div className="page-content services-page">
        <RevealText as="h1" className="display services-title">
          {t('services.title')}
        </RevealText>
        <p className="services-lead">{t('services.lead')}</p>
        <ServiceRows />
        <div className="services-cta">
          <Magnetic>
            <TransitionLink className="btn-round" to="/contact" label={t('nav.contact')}>
              {t('home.ctaContact')}
            </TransitionLink>
          </Magnetic>
        </div>
      </div>
    </main>
  );
};

export default Services;
