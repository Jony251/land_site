import { CONTACT_EMAIL, WHATSAPP_URL } from '../../config/contact'
import { useI18n } from '../../i18n/LanguageProvider'
import ContactForm from '../ContactForm/ContactForm.comp'
import './ContactSection.comp.css'

const ContactSection = () => {
  const { t } = useI18n()
  const whatsappEnabled = Boolean(WHATSAPP_URL)
  const emailEnabled = Boolean(CONTACT_EMAIL)

  return (
    <section className="contact-section" aria-label={t('finalCta.aria')}>
      <div className="contact-section-inner">
        <div className="contact-section-left">
          <h2 className="contact-section-title">{t('finalCta.title')}</h2>
          <p className="contact-section-subtitle">{t('finalCta.subtitle')}</p>
          <p className="contact-section-lead">{t('finalCta.lead')}</p>

          <div className="contact-section-actions">
            {whatsappEnabled ? (
              <a className="contact-section-btn whatsapp" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <span className="icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill="#25D366"
                      d="M16.02 3C9.38 3 4 8.38 4 15.02c0 2.34.67 4.61 1.94 6.57L4.6 29l7.6-1.99a12.0 12.0 0 0 0 3.82.61c6.64 0 12.02-5.38 12.02-12.02C28.04 8.38 22.66 3 16.02 3Zm0 21.86c-1.29 0-2.55-.25-3.73-.73l-.27-.11-4.51 1.18 1.2-4.4-.18-.28a9.78 9.78 0 0 1-1.5-5.2c0-5.4 4.4-9.8 9.79-9.8 5.4 0 9.8 4.4 9.8 9.8 0 5.39-4.4 9.79-9.8 9.79Z"
                    />
                    <path
                      fill="#25D366"
                      d="M21.84 18.7c-.32-.16-1.87-.92-2.16-1.03-.29-.1-.5-.16-.71.16-.21.31-.82 1.03-1 1.24-.18.2-.37.23-.69.08-.32-.16-1.36-.5-2.58-1.6-.96-.86-1.61-1.93-1.8-2.25-.18-.32-.02-.5.14-.66.14-.14.32-.37.48-.55.16-.18.2-.32.31-.53.1-.21.05-.4-.02-.55-.08-.16-.71-1.7-.97-2.33-.26-.63-.52-.54-.71-.55l-.6-.01c-.2 0-.53.08-.8.4-.27.31-1.06 1.03-1.06 2.5 0 1.48 1.08 2.91 1.23 3.11.16.21 2.12 3.24 5.13 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.87-.76 2.13-1.49.26-.73.26-1.35.18-1.49-.08-.13-.29-.21-.61-.37Z"
                    />
                  </svg>
                </span>
                <span>{t('finalCta.whatsapp')}</span>
              </a>
            ) : (
              <button className="contact-section-btn whatsapp disabled" type="button" disabled>
                <span className="icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill="#25D366"
                      d="M16.02 3C9.38 3 4 8.38 4 15.02c0 2.34.67 4.61 1.94 6.57L4.6 29l7.6-1.99a12.0 12.0 0 0 0 3.82.61c6.64 0 12.02-5.38 12.02-12.02C28.04 8.38 22.66 3 16.02 3Zm0 21.86c-1.29 0-2.55-.25-3.73-.73l-.27-.11-4.51 1.18 1.2-4.4-.18-.28a9.78 9.78 0 0 1-1.5-5.2c0-5.4 4.4-9.8 9.79-9.8 5.4 0 9.8 4.4 9.8 9.8 0 5.39-4.4 9.79-9.8 9.79Z"
                    />
                    <path
                      fill="#25D366"
                      d="M21.84 18.7c-.32-.16-1.87-.92-2.16-1.03-.29-.1-.5-.16-.71.16-.21.31-.82 1.03-1 1.24-.18.2-.37.23-.69.08-.32-.16-1.36-.5-2.58-1.6-.96-.86-1.61-1.93-1.8-2.25-.18-.32-.02-.5.14-.66.14-.14.32-.37.48-.55.16-.18.2-.32.31-.53.1-.21.05-.4-.02-.55-.08-.16-.71-1.7-.97-2.33-.26-.63-.52-.54-.71-.55l-.6-.01c-.2 0-.53.08-.8.4-.27.31-1.06 1.03-1.06 2.5 0 1.48 1.08 2.91 1.23 3.11.16.21 2.12 3.24 5.13 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.87-.76 2.13-1.49.26-.73.26-1.35.18-1.49-.08-.13-.29-.21-.61-.37Z"
                    />
                  </svg>
                </span>
                <span>{t('finalCta.whatsapp')}</span>
              </button>
            )}

            {emailEnabled ? (
              <a className="contact-section-btn" href={`mailto:${CONTACT_EMAIL}`}>
                {t('finalCta.email')}
              </a>
            ) : (
              <button className="contact-section-btn disabled" type="button" disabled>
                {t('finalCta.email')}
              </button>
            )}
          </div>
        </div>

        <div className="contact-section-right">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}

export default ContactSection
