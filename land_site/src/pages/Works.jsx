import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../Components/SEO/SEO.comp';
import SectionReveal from '../Components/SectionReveal/SectionReveal.comp';
import { projectCategories, projects } from '../data/projects';
import './Works.css';

const Works = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');

  const filteredProjects = useMemo(() => {
    const term = query.trim().toLowerCase();

    return projects.filter((project) => {
      const categoryPass = activeCategory === 'All' || project.category === activeCategory;
      const queryPass =
        !term ||
        project.title.toLowerCase().includes(term) ||
        project.summary.toLowerCase().includes(term) ||
        project.tags.join(' ').toLowerCase().includes(term);

      return categoryPass && queryPass;
    });
  }, [activeCategory, query]);

  return (
    <div className="page works-page">
      <SEO
        title="Blue Cat | Portfolio & Case Studies"
        description="Browse filterable portfolio projects and open complete case studies with challenge, solution, stack, and measurable outcomes."
      />

      <section className="page-content">
        <header className="page-header">
          <p className="eyebrow">Portfolio</p>
          <h1 className="page-title">Filterable project gallery</h1>
          <p className="page-intro">
            Explore selected projects by category, then open complete case studies for delivery details and measurable results.
          </p>
        </header>

        <div className="portfolio-toolbar surface-panel">
          <div className="portfolio-filters" role="tablist" aria-label="Project categories">
            {projectCategories.map((category) => (
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
            <span className="sr-only">Search projects</span>
            <input
              id="portfolio-search"
              type="search"
              placeholder="Search by title, stack, or keyword..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>

        <p className="portfolio-meta">
          Showing <strong>{filteredProjects.length}</strong> of <strong>{projects.length}</strong> projects
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
                    Read Case Study
                  </Link>
                  <Link className="btn secondary small" to="/contact">
                    Discuss Similar Build
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
