import TransitionLink from '../../motion/TransitionLink';
import useI18n from '../../i18n/useI18n';
import './ServiceRows.comp.css';

// eslint-disable-next-line react-refresh/only-export-components -- shared key list; edits here need a full reload anyway
export const SERVICE_KEYS = ['s1', 's2', 's3', 's4', 's5'];

/**
 * The five service levels as big numbered rows.
 *
 * Input:
 * - `withLinks` (boolean, optional): each row links to `/services`. Default `false`.
 *
 * Output:
 * - Ordered list of rows: two-digit number, title, description.
 */
const ServiceRows = ({ withLinks = false }) => {
  const { t } = useI18n();

  return (
    <ol className="service-rows">
      {SERVICE_KEYS.map((key, index) => {
        const body = (
          <>
            <span className="service-rows-num" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="service-rows-text">
              <span className="service-rows-title">{t(`services.${key}.title`)}</span>{' '}
              <span className="service-rows-desc">{t(`services.${key}.desc`)}</span>
            </span>
          </>
        );
        return (
          <li key={key} className="service-rows-item">
            {withLinks ? (
              <TransitionLink className="service-rows-row" to="/services" label={t('nav.services')}>
                {body}
              </TransitionLink>
            ) : (
              <div className="service-rows-row">{body}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default ServiceRows;
