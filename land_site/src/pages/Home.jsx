import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../Components/SEO/SEO.comp';
import SectionReveal from '../Components/SectionReveal/SectionReveal.comp';
import Info from '../Components/Info/Info.comp';
import TechStrip from '../Components/TechStrip/TechStrip.comp';
import { featuredProjects } from '../data/projects';
import { insights, processSteps, testimonials, trustStats } from '../data/siteContent';
import { useI18n } from '../i18n/LanguageProvider';
import { trackCtaClick } from '../lib/analytics';
import './Home.css';

const Home = () => {
  const { t } = useI18n();
  const [activeProjectId, setActiveProjectId] = useState(featuredProjects[0].id);

  const activeProject = useMemo(
    () => featuredProjects.find((project) => project.id === activeProjectId) || featuredProjects[0],
    [activeProjectId]
  );

  const handleTrack = (label) => trackCtaClick(label);

  return (
    <div className="page home-page">
      <SEO
        title="Blue Cat | Conversion-Focused Web Developer"
        description="Modern websites and web apps engineered for performance, trust, and measurable conversion growth."
      />

      <section className="hero">
        <div className="page-content hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Full-stack web development</p>
            <h1>Modern websites that look premium and convert consistently.</h1>
            <p className="hero-subtitle">{t('home.subtitle')}</p>

            <div className="hero-actions">
              <Link className="btn primary" to="/contact" onClick={() => handleTrack('hero_hire_me')}>
                Hire Me
              </Link>
              <Link className="btn ghost" to="/works" onClick={() => handleTrack('hero_view_projects')}>
                Explore Projects
              </Link>
              <a className="btn secondary" href="/Blue-Cat-CV.txt" download>
                Download CV
              </a>
            </div>

            <ul className="hero-stats" aria-label="Trust and performance indicators">
              {trustStats.map((item) => (
                <li key={item.label} className="hero-stat">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-card">
              <div className="hero-card-head">
                <span>Launch-ready product page</span>
                <span className="hero-chip">Live preview</span>
              </div>

              <div className="hero-code">
                <span className="hero-code-line">const cta = optimize(userIntent, trustSignals);</span>
                <span className="hero-code-line">render(&lt;HeroSection /&gt;, &lt;Portfolio /&gt;, &lt;Contact /&gt;);</span>
                <span className="hero-code-line">metrics.track(&quot;quote_request&quot;);</span>
              </div>

              <div className="hero-card-footer">
                <div className="hero-kpi">
                  <strong>+31%</strong>
                  <span>Quote requests</span>
                </div>
                <div className="hero-kpi">
                  <strong>95+</strong>
                  <span>Lighthouse score</span>
                </div>
                <div className="hero-kpi">
                  <strong>1.8s</strong>
                  <span>Largest contentful paint</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TechStrip />

      <SectionReveal as="section" className="page-content process-section">
        <div className="section-head">
          <p className="eyebrow">Workflow</p>
          <h2 className="section-title">A clear process from strategy to launch</h2>
        </div>
        <div className="process-grid">
          {processSteps.map((step, index) => (
            <article key={step.title} className="process-card surface-panel">
              <span className="process-index">{`0${index + 1}`}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal as="div">
        <Info />
      </SectionReveal>

      <SectionReveal as="section" className="page-content showcase-section">
        <div className="section-head">
          <p className="eyebrow">Portfolio highlight</p>
          <h2 className="section-title">Interactive project showcase</h2>
          <p className="section-description">
            Select a project to preview outcomes, role, and delivery details. Open the full case study for implementation notes.
          </p>
        </div>

        <div className="showcase-layout">
          <div className="showcase-list">
            {featuredProjects.map((project) => (
              <button
                key={project.id}
                type="button"
                className={`showcase-item ${activeProject.id === project.id ? 'active' : ''}`}
                onClick={() => setActiveProjectId(project.id)}
              >
                <span className="showcase-item-title">{project.title}</span>
                <span className="showcase-item-meta">{project.category}</span>
              </button>
            ))}
          </div>

          <article className="showcase-preview surface-panel">
            <div className="showcase-preview-head">
              <span className="showcase-badge">{activeProject.category}</span>
              <span>{activeProject.year}</span>
            </div>
            <h3>{activeProject.title}</h3>
            <p>{activeProject.summary}</p>
            <ul>
              {activeProject.results.slice(0, 2).map((result) => (
                <li key={result}>{result}</li>
              ))}
            </ul>

            <div className="showcase-preview-actions">
              <Link className="btn primary" to={`/works/${activeProject.id}`}>
                View Case Study
              </Link>
              <Link className="btn secondary" to="/contact">
                Start a Similar Project
              </Link>
            </div>
          </article>
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="page-content testimonial-section">
        <div className="section-head">
          <p className="eyebrow">Testimonials</p>
          <h2 className="section-title">What clients say</h2>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article key={item.name} className="testimonial-card surface-panel">
              <p className="testimonial-quote">&ldquo;{item.quote}&rdquo;</p>
              <p className="testimonial-author">{item.name}</p>
              <p className="testimonial-role">{item.role}</p>
            </article>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="page-content insight-section">
        <div className="section-head">
          <p className="eyebrow">Insights</p>
          <h2 className="section-title">Quick reads for better digital outcomes</h2>
        </div>

        <div className="insight-grid">
          {insights.map((item) => (
            <article key={item.title} className="insight-card surface-panel">
              <p className="insight-time">{item.readTime}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link to="/contact" className="insight-link">
                Discuss this topic
              </Link>
            </article>
          ))}
        </div>
      </SectionReveal>

      <section className="page-content">
        <div className="surface-panel cta-banner">
          <div>
            <h3>Need a clean redesign that drives more leads?</h3>
            <p>Get a focused audit plus a practical delivery plan for your website.</p>
          </div>
          <Link className="btn primary" to="/contact" onClick={() => handleTrack('footer_cta_quote')}>
            Get a Quote
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
