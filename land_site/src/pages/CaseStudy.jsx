import { Link, Navigate, useParams } from 'react-router-dom';
import SEO from '../Components/SEO/SEO.comp';
import SectionReveal from '../Components/SectionReveal/SectionReveal.comp';
import { getProjectById, projects } from '../data/projects';
import './CaseStudy.css';

const CaseStudy = () => {
  const { projectId } = useParams();
  const project = getProjectById(projectId);

  if (!project) {
    return <Navigate to="/works" replace />;
  }

  const relatedProjects = projects
    .filter((item) => item.id !== project.id)
    .filter((item) => item.category === project.category)
    .slice(0, 2);

  return (
    <div className="page case-study-page">
      <SEO
        title={`${project.title} | Case Study`}
        description={`${project.summary} Explore challenge, solution, timeline, stack, and business outcomes.`}
      />

      <section className="page-content">
        <Link className="case-back-link" to="/works">
          ← Back to portfolio
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
              <span>Role</span>
              <strong>{project.role}</strong>
            </div>
            <div>
              <span>Timeline</span>
              <strong>{project.timeline}</strong>
            </div>
            <div>
              <span>Main stack</span>
              <strong>{project.stack.slice(0, 2).join(' + ')}</strong>
            </div>
          </div>
        </header>
      </section>

      <SectionReveal as="section" className="page-content case-body-grid">
        <article className="surface-panel case-block">
          <h2>Challenge</h2>
          <p>{project.challenge}</p>
        </article>

        <article className="surface-panel case-block">
          <h2>Solution</h2>
          <p>{project.solution}</p>
        </article>
      </SectionReveal>

      <SectionReveal as="section" className="page-content">
        <article className="surface-panel case-block">
          <h2>Impact</h2>
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
          <h2>Screen walkthrough</h2>
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
            <h2>Tech stack & delivery notes</h2>
            <p>Built with reusable components, semantic HTML, responsive breakpoints, and measurable conversion hooks.</p>
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
            <h3>Want a similar outcome for your product?</h3>
            <p>Share your goals and I will suggest scope, timeline, and a practical implementation plan.</p>
          </div>
          <Link className="btn primary" to="/contact">
            Start Your Project
          </Link>
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <SectionReveal as="section" className="page-content">
          <div className="section-head">
            <p className="eyebrow">Related work</p>
            <h2 className="section-title">More projects in this category</h2>
          </div>

          <div className="case-related-grid">
            {relatedProjects.map((item) => (
              <article key={item.id} className="surface-panel case-related-card">
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <Link to={`/works/${item.id}`}>Read case study</Link>
              </article>
            ))}
          </div>
        </SectionReveal>
      )}
    </div>
  );
};

export default CaseStudy;
