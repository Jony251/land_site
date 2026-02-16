import ContactForm from '../Components/ContactForm/ContactForm.comp';
import { useI18n } from '../i18n/LanguageProvider';
import { useSiteCopy } from '../i18n/siteCopy';
import SEO from '../Components/SEO/SEO.comp';
import SectionReveal from '../Components/SectionReveal/SectionReveal.comp';
import './Contact.css';

const Contact = () => {
  const { t } = useI18n();
  const sc = useSiteCopy();
  return (
    <div className="page contact-page">
      <SEO
        title={sc('seo.contactTitle')}
        description={sc('seo.contactDescription')}
      />

      <section className="page-content">
        <header className="page-header">
          <p className="eyebrow">{t('contact.title')}</p>
          <h1 className="page-title">{t('contact.title')}</h1>
          <p className="page-intro">
            {t('contact.body')} {sc('contactPage.introSuffix')}
          </p>
        </header>
      </section>

      <SectionReveal as="section" className="page-content contact-layout">
        <ContactForm />
        <aside className="surface-panel contact-side-panel">
          <h2>{sc('contactPage.checklistTitle')}</h2>
          <ul>
            <li>{sc('contactPage.checklist1')}</li>
            <li>{sc('contactPage.checklist2')}</li>
            <li>{sc('contactPage.checklist3')}</li>
            <li>{sc('contactPage.checklist4')}</li>
          </ul>

          <div className="contact-side-block">
            <span>{sc('contactPage.avgReply')}</span>
            <strong>{sc('contactPage.avgReplyValue')}</strong>
          </div>

          <div className="contact-side-block">
            <span>{sc('contactPage.email')}</span>
            <a href="mailto:bluecat.webdev@gmail.com">bluecat.webdev@gmail.com</a>
          </div>
        </aside>
      </SectionReveal>
    </div>
  );
};

export default Contact;
