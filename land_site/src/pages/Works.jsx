import { useState } from 'react';
import useI18n from '../i18n/useI18n';
import HoverPreviewList from '../motion/HoverPreviewList';
import RevealText from '../motion/RevealText';
import projects from './in_Work/projectsData';
import { sortByTier, TIER_ORDER, toPreviewItems } from './in_Work/projectItems';
import './Works.css';

const FILTERS = ['all', ...TIER_ORDER];

/**
 * Works page.
 *
 * Output:
 * - Big heading and lead, tier filters (all / flagship / product / craft) with counts,
 *   and every visible project as a hover-preview row linking to `/works/:id`.
 */
const Works = () => {
  const { t } = useI18n();
  const [tier, setTier] = useState('all');

  const visible = sortByTier(projects.filter((p) => tier === 'all' || p.tier === tier));
  const countFor = (key) => (key === 'all' ? projects.length : projects.filter((p) => p.tier === key).length);

  return (
    <main className="works-route section-paper">
      <div className="page-content">
        <RevealText as="h1" className="display works-title">
          {t('works.title')}
        </RevealText>
        <p className="works-lead">{t('works.body')}</p>
        <div className="works-filters" role="group" aria-label={t('works.filtersAria')}>
          {FILTERS.map((key) => (
            <button
              key={key}
              type="button"
              className="works-filter"
              aria-pressed={tier === key}
              onClick={() => setTier(key)}
            >
              {t(`works.filters.${key}`)} <span className="works-filter-count">{countFor(key)}</span>
            </button>
          ))}
        </div>
        <HoverPreviewList items={toPreviewItems(visible, t)} className="works-list" />
      </div>
    </main>
  );
};

export default Works;
