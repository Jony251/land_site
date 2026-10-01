import { MASCOT_IMAGE } from '../config/owner';
import useI18n from '../i18n/useI18n';
import TransitionLink from '../motion/TransitionLink';
import './NotFound.css';

/**
 * 404 page.
 *
 * Output:
 * - Mascot, "This page wandered off" heading, short explanation and a link home.
 */
const NotFound = () => {
  const { t } = useI18n();

  return (
    <main className="notfound-route section-paper">
      <div className="page-content notfound">
        <img className="notfound-cat" src={MASCOT_IMAGE} alt="" />
        <h1 className="display notfound-title">{t('notFound.title')}</h1>
        <p className="notfound-body">{t('notFound.body')}</p>
        <TransitionLink className="btn" to="/" label={t('nav.home')}>
          {t('notFound.cta')}
        </TransitionLink>
      </div>
    </main>
  );
};

export default NotFound;
