import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../Components/SEO/SEO.comp';
import SectionReveal from '../Components/SectionReveal/SectionReveal.comp';
import {
  getLocalizedProjectCategories,
  getLocalizedProjects,
} from '../data/projects';
import { useI18n } from '../i18n/LanguageProvider';
import { useSiteCopy } from '../i18n/siteCopy';
import './Works.css';

const Works = () => {
  const { lang } = useI18n();
  const sc = useSiteCopy();
  const projects = useMemo(() => getLocalizedProjects(lang), [lang]);
  const categories = useMemo(() => getLocalizedProjectCategories(lang), [lang]);
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? 'All');
  const [query, setQuery] = useState('');

  const allLabel = categories[0] ?? 'All';

  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [activeCategory, categories]);

  const filteredProjects = useMemo(() => {
    const term = query.trim().toLowerCase();

    return projects.filter((project) => {
      const categoryPass = activeCategory === allLabel || project.category === activeCategory;
      const queryPass =
        !term ||
        project.title.toLowerCase().includes(term) ||
        project.summary.toLowerCase().includes(term) ||
        project.tags.join(' ').toLowerCase().includes(term);

      return categoryPass && queryPass;
    });
  }, [activeCategory, allLabel, projects, query]);

  return (
    <div className="page works-page">
      <SEO
        title={sc('seo.worksTitle')}
        description={sc('seo.worksDescription')}
      />

      <section className="page-content">
        <header className="page-header">
          <p className="eyebrow">{sc('works.eyebrow')}</p>
          <h1 className="page-title">{sc('works.title')}</h1>
          <p className="page-intro">{sc('works.intro')}</p>
        </header>

        <div className="portfolio-toolbar surface-panel">
          <div className="portfolio-filters" role="tablist" aria-label="Project categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`filter-chip ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <label className="search-field" htmlFor="portfolio-search">
            <span className="sr-only">{sc('works.searchAria')}</span>
            <input
              id="portfolio-search"
              type="search"
              placeholder={sc('works.searchPlaceholder')}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>

        <p className="portfolio-meta">
          {sc('works.showing')} <strong>{filteredProjects.length}</strong> {sc('works.of')}{' '}
          <strong>{projects.length}</strong> {sc('works.projects')}
        </p>
      </section>

      <SectionReveal as="section" className="page-content">
        <div className="works-grid">
          {filteredProjects.map((project) => (
            <article key={project.id} className="project-card surface-panel">
              <div className="project-card-preview" style={{ background: project.screens[0].gradient }}>
                <span>{project.category}</span>
                <strong>{project.year}</strong>
              </div>

              <div className="project-card-content">
                <h2>{project.title}</h2>
                <p>{project.summary}</p>

                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <div className="project-metrics">
                  {project.metrics.slice(0, 2).map((metric) => (
                    <div key={metric.label}>
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </div>
                  ))}
                </div>

                <div className="project-actions">
                  <Link className="btn primary small" to={`/works/${project.id}`}>
                    {sc('works.readCaseStudy')}
                  </Link>
                  <Link className="btn secondary small" to="/contact">
                    {sc('works.discussBuild')}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionReveal>
    </div>
  );
};

export default Works;
