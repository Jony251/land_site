import { Link, Navigate, useParams } from 'react-router-dom';
import SEO from '../Components/SEO/SEO.comp';
import SectionReveal from '../Components/SectionReveal/SectionReveal.comp';
import { getLocalizedProjectById, getLocalizedProjects } from '../data/projects';
import { useI18n } from '../i18n/LanguageProvider';
import { useSiteCopy } from '../i18n/siteCopy';
import './CaseStudy.css';

const CaseStudy = () => {
  const { projectId } = useParams();
  const { lang } = useI18n();
  const sc = useSiteCopy();
  const project = getLocalizedProjectById(projectId, lang);

  if (!project) {
    return <Navigate to="/works" replace />;
  }

  const relatedProjects = getLocalizedProjects(lang)
    .filter((item) => item.id !== project.id)
    .filter((item) => item.category === project.category)
    .slice(0, 2);

  return (
    <div className="page case-study-page">
      <SEO
        title={`${project.title} | ${sc('seo.caseTitleSuffix')}`}
        description={`${project.summary} ${sc('seo.caseDescriptionSuffix')}`}
      />

      <section className="page-content">
        <Link className="case-back-link" to="/works">
          ← {sc('caseStudy.backToPortfolio')}
        </Link>

        <header className="case-hero surface-panel">
          <div className="case-hero-top">
            <span className="case-pill">{project.category}</span>
            <span>{project.year}</span>
          </div>

          <h1>{project.title}</h1>
          <p>{project.summary}</p>

          <div className="case-meta-grid">
            <div>
              <span>{sc('caseStudy.role')}</span>
              <strong>{project.role}</strong>
            </div>
            <div>
              <span>{sc('caseStudy.timeline')}</span>
              <strong>{project.timeline}</strong>
            </div>
            <div>
              <span>{sc('caseStudy.mainStack')}</span>
              <strong>{project.stack.slice(0, 2).join(' + ')}</strong>
            </div>
          </div>
        </header>
      </section>

      <SectionReveal as="section" className="page-content case-body-grid">
        <article className="surface-panel case-block">
          <h2>{sc('caseStudy.challenge')}</h2>
          <p>{project.challenge}</p>
        </article>

        <article className="surface-panel case-block">
          <h2>{sc('caseStudy.solution')}</h2>
          <p>{project.solution}</p>
        </article>
      </SectionReveal>

      <SectionReveal as="section" className="page-content">
        <article className="surface-panel case-block">
          <h2>{sc('caseStudy.impact')}</h2>
          <ul className="impact-list">
            {project.results.map((result) => (
              <li key={result}>{result}</li>
            ))}
          </ul>

          <div className="impact-metrics">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </article>
      </SectionReveal>

      <SectionReveal as="section" className="page-content">
        <article className="surface-panel case-block">
          <h2>{sc('caseStudy.screenWalkthrough')}</h2>
          <div className="case-screen-grid">
            {project.screens.map((screen) => (
              <div key={screen.title} className="case-screen-item">
                <div className="case-screen-preview" style={{ background: screen.gradient }} aria-hidden="true" />
                <h3>{screen.title}</h3>
                <p>{screen.description}</p>
              </div>
            ))}
          </div>
        </article>
      </SectionReveal>

      <SectionReveal as="section" className="page-content">
        <article className="surface-panel case-block case-stack-block">
          <div>
            <h2>{sc('caseStudy.techStackTitle')}</h2>
            <p>{sc('caseStudy.techStackBody')}</p>
          </div>
          <div className="stack-tags">
            {project.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>
      </SectionReveal>

      <section className="page-content">
        <div className="surface-panel cta-banner">
          <div>
            <h3>{sc('caseStudy.ctaTitle')}</h3>
            <p>{sc('caseStudy.ctaBody')}</p>
          </div>
          <Link className="btn primary" to="/contact">
            {sc('caseStudy.ctaButton')}
          </Link>
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <SectionReveal as="section" className="page-content">
          <div className="section-head">
            <p className="eyebrow">{sc('caseStudy.relatedEyebrow')}</p>
            <h2 className="section-title">{sc('caseStudy.relatedTitle')}</h2>
          </div>

          <div className="case-related-grid">
            {relatedProjects.map((item) => (
              <article key={item.id} className="surface-panel case-related-card">
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <Link to={`/works/${item.id}`}>{sc('caseStudy.relatedRead')}</Link>
              </article>
            ))}
          </div>
        </SectionReveal>
      )}
    </div>
  );
};

export default CaseStudy;
