import ContactSection from '../Components/ContactSection/ContactSection.comp';
import useI18n from '../i18n/useI18n';
import RevealText from '../motion/RevealText';
import './Contact.css';

/**
 * Contact page.
 *
 * Output:
 * - Big heading and lead, then the contact section (form, email, WhatsApp).
 */
const Contact = () => {
  const { t } = useI18n();

  return (
    <main className="contact-route section-paper">
      <div className="page-content contact-page">
        <RevealText as="h1" className="display contact-title">
          {t('contact.title')}
        </RevealText>
        <p className="contact-lead">{t('contact.body')}</p>
        <ContactSection />
      </div>
    </main>
  );
};

export default Contact;
