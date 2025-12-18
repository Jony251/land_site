import './Info.comp.css';
import { useI18n } from '../../i18n/LanguageProvider';

const Info = () => {
  const { t, dir } = useI18n();

  const services = [
    { title: t('services.s1.title'), description: t('services.s1.desc') },
    { title: t('services.s2.title'), description: t('services.s2.desc') },
    { title: t('services.s3.title'), description: t('services.s3.desc') },
    { title: t('services.s4.title'), description: t('services.s4.desc') },
  ];

  return (
    <section className={`info-section ${dir === 'rtl' ? 'rtl' : ''}`} dir={dir}>
      <div className="container">
        <h2>{t('services.title')}</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Info;