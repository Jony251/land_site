import { useI18n } from '../i18n/LanguageProvider';
import Info from '../Components/Info/Info.comp';

const Services = () => {
  const { t } = useI18n();

  return (
    <main className="services-route">
      <Info />
    </main>
  );
};

export default Services;
