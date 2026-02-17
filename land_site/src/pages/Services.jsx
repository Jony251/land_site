import { useI18n } from '../i18n/LanguageProvider';
import Info from '../Components/Info/Info.comp';

const Services = () => {
  const { t } = useI18n();

  return (
    <main className="services-route">
      <div className="page-content" style={{ textAlign: 'center' }}>
        <h1>{t('services.title')}</h1>
      </div>
      <Info />
    </main>
  );
};

export default Services;
