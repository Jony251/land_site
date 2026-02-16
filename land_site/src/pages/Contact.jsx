import ContactForm from '../Components/ContactForm/ContactForm.comp';
import { useI18n } from '../i18n/LanguageProvider';
import SEO from '../Components/SEO/SEO.comp';
import SectionReveal from '../Components/SectionReveal/SectionReveal.comp';
import './Contact.css';

const Contact = () => {
  const { t } = useI18n();
  return (
    <div className="page contact-page">
      <SEO
        title="Blue Cat | Contact & Project Quotes"
        description="Send project details, budget range, and timeline to receive a practical quote and implementation plan."
      />

      <section className="page-content">
        <header className="page-header">
          <p className="eyebrow">Contact</p>
          <h1 className="page-title">{t('contact.title')}</h1>
          <p className="page-intro">
            {t('contact.body')} Share your goals, timeline, and scope to get a clear next-step recommendation.
          </p>
        </header>
      </section>

      <SectionReveal as="section" className="page-content contact-layout">
        <ContactForm />
        <aside className="surface-panel contact-side-panel">
          <h2>Project inquiry checklist</h2>
          <ul>
            <li>Business objective and target users</li>
            <li>Current website or product links</li>
            <li>Desired launch window</li>
            <li>Preferred budget range</li>
          </ul>

          <div className="contact-side-block">
            <span>Average reply time</span>
            <strong>Within 24 hours</strong>
          </div>

          <div className="contact-side-block">
            <span>Email</span>
            <a href="mailto:bluecat.webdev@gmail.com">bluecat.webdev@gmail.com</a>
          </div>
        </aside>
      </SectionReveal>
    </div>
  );
};

export default Contact;
