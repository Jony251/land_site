import { useParams } from 'react-router-dom';
import useI18n from '../../i18n/useI18n';
import RevealText from '../../motion/RevealText';
import TransitionLink from '../../motion/TransitionLink';
import NotFound from '../NotFound';
import projects from './projectsData';
import './InWork.css';

const CASE_PARTS = ['problem', 'solution', 'stack', 'result'];

/**
 * Case study page for `/works/:id`.
 *
 * Input:
 * - Route param `id` (string).
 *
 * Output:
 * - Full-bleed hero image, title, lead, the problem/solution/stack/result narrative (when the
 *   project has `caseKeys`), technologies, work types, external links, gallery and a link to the
 *   next project (the last project wraps to the first). Unknown `id` → 404 page.
 */
const InWork = () => {
  const { id } = useParams();
  const { t } = useI18n();

  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return <NotFound />;

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const title = t(project.titleKey);

  return (
    <main className="case-route section-paper">
      <div className="case-hero">
        <img className="case-hero-image" src={project.images[0]} alt={title} />
      </div>

      <div className="page-content case-content">
        <TransitionLink className="case-back" to="/works" label={t('nav.works')}>
          {t('works.case.back')}
        </TransitionLink>
        <span className={`project-card-badge tier-${project.tier}`}>{t(`works.tier.${project.tier}`)}</span>
        <RevealText as="h1" className="display case-title">
          {title}
        </RevealText>
        <p className="case-lead">{t(project.descKey)}</p>

        {project.caseKeys && (
          <section className="case-story" aria-label={title}>
            {CASE_PARTS.map((part) => (
              <div key={part} className="case-story-item">
                <h2 className="case-label">{t(`works.case.${part}`)}</h2>
                <p className="case-big">{t(project.caseKeys[part])}</p>
              </div>
            ))}
          </section>
        )}

        <dl className="case-meta">
          {project.technologies?.length > 0 && (
            <div className="case-meta-row">
              <dt>{t('works.case.technologies')}</dt>
              <dd>
                <ul className="case-tags">
                  {project.technologies.map((item) => (
                    <li key={item.name}>
                      {item.icon && <img src={item.icon} alt="" width="20" height="20" />}
                      {item.name}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
          {project.workTypes?.length > 0 && (
            <div className="case-meta-row">
              <dt>{t('works.case.workTypes')}</dt>
              <dd>{project.workTypes.map((key) => t(`works.types.${key}`)).join(', ')}</dd>
            </div>
          )}
          {(project.siteUrl || project.github) && (
            <div className="case-meta-row">
              <dt>{t('works.case.links')}</dt>
              <dd className="case-links">
                {project.siteUrl && (
                  <a href={project.siteUrl} target="_blank" rel="noopener noreferrer">
                    {t('works.case.live')} <span aria-hidden="true">↗</span>
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    {t('works.case.github')} <span aria-hidden="true">↗</span>
                  </a>
                )}
              </dd>
            </div>
          )}
        </dl>

        {project.images.length > 1 && (
          <section className="case-gallery" aria-label={t('works.case.gallery')}>
            {project.images.slice(1).map((src, i) => (
              <img key={`${i}-${src}`} src={src} alt={`${title} — ${i + 2}`} loading="lazy" />
            ))}
          </section>
        )}
      </div>

      <TransitionLink className="case-next" to={`/works/${next.id}`} label={t(next.titleKey)}>
        <span className="case-next-label">{t('works.case.next')}</span>
        <span className="display case-next-title">{t(next.titleKey)}</span>
      </TransitionLink>
    </main>
  );
};

export default InWork;
