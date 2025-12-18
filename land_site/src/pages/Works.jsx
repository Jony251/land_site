import { useI18n } from '../i18n/LanguageProvider';

const Works = () => {
  const { t } = useI18n();
  return (
    <div className="page">
      <div className="page-content">
        <h1>{t('works.title')}</h1>
        <p>{t('works.body')}</p>

        <div className="card-grid">
          <div className="card">
            <h3>{t('works.p1')}</h3>
            <p>{t('works.pdesc')}</p>
          </div>
          <div className="card">
            <h3>{t('works.p2')}</h3>
            <p>{t('works.pdesc')}</p>
          </div>
          <div className="card">
            <h3>{t('works.p3')}</h3>
            <p>{t('works.pdesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Works;
