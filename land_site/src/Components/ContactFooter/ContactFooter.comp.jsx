import { Link } from 'react-router-dom';
import { CONTACT_EMAIL, WHATSAPP_URL } from '../../config/contact';
import { MASCOT_IMAGE, OWNER_NAME } from '../../config/owner';
import useI18n from '../../i18n/useI18n';
import Magnetic from '../../motion/Magnetic';
import OwnerPhoto from '../OwnerPhoto/OwnerPhoto.comp';
import './ContactFooter.comp.css';

/**
 * Big contact footer shown at the bottom of every page except `/contact`.
 *
 * Output:
 * - Owner photo, "Let's work together" heading, lead line, magnetic round button to `/contact`,
 *   email and WhatsApp links when configured, copyright line and a waving mascot.
 */
const ContactFooter = () => {
  const { t, lang } = useI18n();
  const name = OWNER_NAME[lang];
  const year = new Date().getFullYear();

  return (
    <footer className="contact-footer section-ink">
      <div className="page-content contact-footer-inner">
        <div className="contact-footer-head">
          <OwnerPhoto alt={name} className="contact-footer-photo" />
          <h2 className="display contact-footer-title">{t('footer.title')}</h2>
        </div>
        <p className="contact-footer-lead">{t('footer.lead')}</p>
        <div className="contact-footer-actions">
          <Magnetic>
            <Link className="btn-round" to="/contact">
              {t('footer.cta')}
            </Link>
          </Magnetic>
          <ul className="contact-footer-links">
            {CONTACT_EMAIL && (
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
            )}
            {WHATSAPP_URL && (
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  {t('footer.whatsapp')}
                </a>
              </li>
            )}
          </ul>
        </div>
        <p className="contact-footer-bottom">
          © {year} Blue Cat · {name}
        </p>
      </div>
      <img className="contact-footer-cat" src={MASCOT_IMAGE} alt="" aria-hidden="true" />
    </footer>
  );
};

export default ContactFooter;
