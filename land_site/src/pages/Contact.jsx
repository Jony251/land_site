import { useEffect } from 'react';
import { useI18n } from '../i18n/LanguageProvider';
import ContactSection from '../Components/ContactSection/ContactSection.comp';

const Contact = () => {
  const { t } = useI18n();

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, []);

  return (
    <main className="contact-route">
      <div className="page-content" style={{ textAlign: 'center' }}>
        <h1>{t('contact.title')}</h1>
        <p>{t('contact.body')}</p>
        <ContactSection />
      </div>
    </main>
  );
};

export default Contact;
