import './Info.comp.css';
import { useI18n } from '../../i18n/LanguageProvider';
import { useSiteCopy } from '../../i18n/siteCopy';
import { Link } from 'react-router-dom';
import { trackCtaClick } from '../../lib/analytics';

const Info = () => {
  const { t, dir } = useI18n();
  const sc = useSiteCopy();

  const services = [
    { icon: '🎯', title: t('services.s1.title'), description: t('services.s1.desc') },
    { icon: '🛠️', title: t('services.s2.title'), description: t('services.s2.desc') },
    { icon: '🚀', title: t('services.s3.title'), description: t('services.s3.desc') },
    { icon: '🔌', title: t('services.s4.title'), description: t('services.s4.desc') },
  ];

  return (
    <section className={`info-section ${dir === 'rtl' ? 'rtl' : ''}`} dir={dir} id="services">
      <div className="page-content">
        <div className="section-head">
          <p className="eyebrow">{t('services.title')}</p>
          <h2 className="section-title">{t('services.title')}</h2>
          <p className="section-description">{sc('services.description')}</p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article key={service.title} className="service-card surface-panel">
              <span className="service-icon" aria-hidden="true">
                {service.icon}
              </span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>

        <div className="services-cta surface-panel">
          <div>
            <h3>{sc('services.ctaTitle')}</h3>
            <p>{sc('services.ctaBody')}</p>
          </div>
          <Link className="btn primary" to="/contact" onClick={() => trackCtaClick('services_get_quote')}>
            {sc('services.ctaButton')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Info;