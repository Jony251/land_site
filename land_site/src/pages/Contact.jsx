import { useI18n } from '../i18n/LanguageProvider';
import ContactSection from '../Components/ContactSection/ContactSection.comp';

const Contact = () => {
  const { t } = useI18n();
  return (
    <div className="page">
      <div className="page-content" style={{ textAlign: 'center' }}>
        <h1>{t('contact.title')}</h1>
        <p>{t('contact.body')}</p>
        <ContactSection />
      </div>
    </div>
  );
};

export default Contact;
