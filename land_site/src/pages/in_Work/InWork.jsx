import { useParams, useNavigate, Link } from 'react-router-dom';
import { useI18n } from '../../i18n/LanguageProvider';
import projects from './projectsData';
import './InWork.css';

const InWork = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <main className="inwork-route">
        <div className="inwork-layout">
          <div className="inwork-main" style={{ padding: '3rem' }}>
            <h2>Project not found</h2>
            <Link to="/works" className="inwork-back" style={{ marginTop: '1rem' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
              </svg>
              Back to Works
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const currentIndex = projects.findIndex((p) => p.id === id);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  const categoryLabel = project.category === 'web' ? 'WEB' : 'ANDROID';

  return (
    <main className="inwork-route">
      <div className="inwork-layout">
        {/* Left Sidebar */}
        <aside className="inwork-sidebar">
          <Link to="/works" className="inwork-sidebar-link">
            All Works
          </Link>
          <div className="inwork-sidebar-divider" />
          <span className="inwork-sidebar-link active">
            {categoryLabel}
          </span>
        </aside>

        {/* Main Content */}
        <div className="inwork-main">
          {/* Hero: text + first image */}
          <section className="inwork-hero">
            <div className="inwork-hero-text">
              <div className="inwork-breadcrumb">
                {categoryLabel} / <span>{t(project.titleKey)}</span>
              </div>
              <h1 className="inwork-title">{t(project.titleKey)}</h1>
              <p className="inwork-description">{t(project.descKey)}</p>
              {project.technologies && project.technologies.length > 0 && (
                <div className="inwork-technologies">
                  {project.technologies.map((item) => (
                    <span key={item.name} className="inwork-tech-tag">
                      {item.icon && (
                        <img className="inwork-tech-icon" src={item.icon} alt={item.name} />
                      )}
                      {item.name}
                    </span>
                  ))}
                </div>
              )}
              {(project.github || project.siteUrl) && (
                <div className="inwork-links">
                  {!project.siteUrl && project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inwork-ext-link"
                      aria-label="GitHub repository"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      <span className="inwork-link-url">{project.github.replace(/^https?:\/\//, '')}</span>
                    </a>
                  )}
                  {project.siteUrl && (
                    <a
                      href={project.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inwork-ext-link"
                      aria-label="Live website"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      <span className="inwork-link-url">{project.siteUrl.replace(/^https?:\/\//, '')}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
            <div className="inwork-hero-image">
              <img src={project.images[0]} alt={t(project.titleKey)} />
            </div>
          </section>

          {/* Gallery: remaining images */}
          {project.images.length > 1 && (
            <section className="inwork-gallery">
              {project.images.slice(1).map((img, index) => (
                <div key={index} className="inwork-gallery-item">
                  <img src={img} alt={`${t(project.titleKey)} — ${index + 2}`} />
                </div>
              ))}
            </section>
          )}

          {/* Prev / Next navigation */}
          <nav className="inwork-nav">
            {prevProject ? (
              <Link to={`/works/${prevProject.id}`} className="inwork-nav-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
                </svg>
                {t(prevProject.titleKey)}
              </Link>
            ) : <span />}

            {nextProject ? (
              <Link to={`/works/${nextProject.id}`} className="inwork-nav-link">
                {t(nextProject.titleKey)}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                </svg>
              </Link>
            ) : <span />}
          </nav>
        </div>
      </div>
    </main>
  );
};

export default InWork;
