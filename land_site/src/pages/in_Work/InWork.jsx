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
