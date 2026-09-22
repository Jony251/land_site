import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useI18n from '../i18n/useI18n';
import projects from './in_Work/projectsData';
import './Works.css';

const TIER_ORDER = ['flagship', 'product', 'craft'];

/**
 * Works page.
 *
 * Output:
 * - Renders projects grouped by portfolio tier (flagship / product / craft),
 *   filtered by the selected tier. Flagship (system-level) projects get a
 *   visually larger card to signal they're the strongest proof of range
 *   (see docs/portfolio-strategy.md).
 * - Navigates to `/works/:id` on click or Enter key.
 */
const Works = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState('all');

  const visibleProjects = projects
    .filter((p) => selectedTier === 'all' || p.tier === selectedTier)
    .sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));

  return (
    <main className="works-route">
      <div className="works-filterbar">
        <div className="page-content">
          <div className="works-head">
            <h1>{t('works.title')}</h1>
            <p>{t('works.body')}</p>
          </div>
          <nav className="works-categories" aria-label="Works categories">
            {['all', ...TIER_ORDER].map((tierKey) => {
              const count = tierKey === 'all'
                ? projects.length
                : projects.filter((p) => p.tier === tierKey).length;
              return (
                <button
                  key={tierKey}
                  type="button"
                  className={`works-category ${selectedTier === tierKey ? 'active' : ''}`}
                  onClick={() => setSelectedTier(tierKey)}
                >
                  {t(`works.filters.${tierKey}`)} <span className="works-category-count">({count})</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="page-content">
        <div className="works-grid">
          {visibleProjects.map((project) => (
            <div
              key={project.id}
              className={`project-card tier-${project.tier}`}
              onClick={() => navigate(`/works/${project.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/works/${project.id}`)}
            >
              <img
                src={project.thumbnail}
                alt={t(project.titleKey)}
                className="project-card-image"
              />
              <div className="project-card-content">
                <span className={`project-card-badge tier-${project.tier}`}>
                  {t(`works.tier.${project.tier}`)}
                </span>
                <h3>{t(project.titleKey)}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
};

export default Works;
