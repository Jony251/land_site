import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../Components/SEO/SEO.comp';
import SectionReveal from '../Components/SectionReveal/SectionReveal.comp';
import Info from '../Components/Info/Info.comp';
import TechStrip from '../Components/TechStrip/TechStrip.comp';
import { getLocalizedFeaturedProjects } from '../data/projects';
import { getLocalizedSiteContent } from '../data/siteContent';
import { useI18n } from '../i18n/LanguageProvider';
import { useSiteCopy } from '../i18n/siteCopy';
import { trackCtaClick } from '../lib/analytics';
import './Home.css';

const Home = () => {
  const { lang } = useI18n();
  const sc = useSiteCopy();
  const localizedContent = useMemo(() => getLocalizedSiteContent(lang), [lang]);
  const featuredProjects = useMemo(() => getLocalizedFeaturedProjects(lang), [lang]);
  const [activeProjectId, setActiveProjectId] = useState(featuredProjects[0]?.id ?? '');

  const activeProject = useMemo(
    () => featuredProjects.find((project) => project.id === activeProjectId) || featuredProjects[0],
    [activeProjectId, featuredProjects]
  );

  useEffect(() => {
    if (featuredProjects.length > 0 && !featuredProjects.some((project) => project.id === activeProjectId)) {
      setActiveProjectId(featuredProjects[0].id);
    }
  }, [activeProjectId, featuredProjects]);

  const handleTrack = (label) => trackCtaClick(label);

  const integrationItems = useMemo(
    () => [
      { title: sc('home.integration1Title'), body: sc('home.integration1Body'), tag: 'GA4' },
      { title: sc('home.integration2Title'), body: sc('home.integration2Body'), tag: 'CRM' },
      { title: sc('home.integration3Title'), body: sc('home.integration3Body'), tag: 'Automation' },
      { title: sc('home.integration4Title'), body: sc('home.integration4Body'), tag: 'Payments' },
    ],
    [sc]
  );

  const pricingPlans = useMemo(
    () => [
      {
        name: sc('home.pricingStarterName'),
        price: sc('home.pricingStarterPrice'),
        features: [
          sc('home.pricingStarterFeature1'),
          sc('home.pricingStarterFeature2'),
          sc('home.pricingStarterFeature3'),
        ],
      },
      {
        name: sc('home.pricingGrowthName'),
        price: sc('home.pricingGrowthPrice'),
        features: [
          sc('home.pricingGrowthFeature1'),
          sc('home.pricingGrowthFeature2'),
          sc('home.pricingGrowthFeature3'),
        ],
        highlighted: true,
      },
      {
        name: sc('home.pricingScaleName'),
        price: sc('home.pricingScalePrice'),
        features: [
          sc('home.pricingScaleFeature1'),
          sc('home.pricingScaleFeature2'),
          sc('home.pricingScaleFeature3'),
        ],
      },
    ],
    [sc]
  );

  if (!activeProject) {
    return null;
  }

  return (
    <div className="page home-page">
      <SEO
        title={sc('seo.homeTitle')}
        description={sc('seo.homeDescription')}
      />

      <section className="hero">
        <div className="page-content hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">{sc('home.heroEyebrow')}</p>
            <h1>{sc('home.heroTitle')}</h1>
            <p className="hero-subtitle">{sc('home.heroSubtitle')}</p>

            <div className="hero-actions">
              <Link className="btn primary" to="/contact" onClick={() => handleTrack('hero_hire_me')}>
                {sc('home.ctaHireMe')}
              </Link>
              <Link className="btn ghost" to="/works" onClick={() => handleTrack('hero_view_projects')}>
                {sc('home.ctaExploreProjects')}
              </Link>
              <a className="btn secondary" href="/Blue-Cat-CV.txt" download>
                {sc('nav.downloadCv')}
              </a>
            </div>

            <ul className="hero-stats" aria-label="Trust and performance indicators">
              {localizedContent.trustStats.map((item) => (
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
                <span>{sc('home.heroVisualTitle')}</span>
                <span className="hero-chip">{sc('home.heroVisualChip')}</span>
              </div>

              <div className="hero-code">
                <span className="hero-code-line">const cta = optimize(userIntent, trustSignals);</span>
                <span className="hero-code-line">render(&lt;HeroSection /&gt;, &lt;Portfolio /&gt;, &lt;Contact /&gt;);</span>
                <span className="hero-code-line">metrics.track(&quot;quote_request&quot;);</span>
              </div>

              <div className="hero-card-footer">
                <div className="hero-kpi">
                  <strong>+31%</strong>
                  <span>{sc('home.heroQuoteLabel')}</span>
                </div>
                <div className="hero-kpi">
                  <strong>95+</strong>
                  <span>{sc('home.trustScore')}</span>
                </div>
                <div className="hero-kpi">
                  <strong>1.8s</strong>
                  <span>{sc('home.heroSpeedLabel')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TechStrip />

      <SectionReveal as="section" className="page-content process-section">
        <div className="section-head">
          <p className="eyebrow">{sc('home.processEyebrow')}</p>
          <h2 className="section-title">{sc('home.processTitle')}</h2>
        </div>
        <div className="process-grid">
          {localizedContent.processSteps.map((step, index) => (
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

      <SectionReveal as="section" className="page-content integration-section">
        <div className="section-head">
          <p className="eyebrow">{sc('home.integrationEyebrow')}</p>
          <h2 className="section-title">{sc('home.integrationTitle')}</h2>
          <p className="section-description">{sc('home.integrationDescription')}</p>
        </div>

        <div className="integration-grid">
          {integrationItems.map((item) => (
            <article key={item.title} className="integration-card surface-panel">
              <span className="integration-tag">{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="page-content pricing-section">
        <div className="section-head">
          <p className="eyebrow">{sc('home.pricingEyebrow')}</p>
          <h2 className="section-title">{sc('home.pricingTitle')}</h2>
          <p className="section-description">{sc('home.pricingDescription')}</p>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`pricing-card surface-panel ${plan.highlighted ? 'highlighted' : ''}`}
            >
              {plan.highlighted && <span className="pricing-popular">{sc('home.pricingPopular')}</span>}
              <h3>{plan.name}</h3>
              <p className="pricing-price">{plan.price}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link
                className="btn primary small"
                to="/contact"
                onClick={() => handleTrack(`pricing_${plan.name}`)}
              >
                {sc('home.pricingCta')}
              </Link>
            </article>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="page-content showcase-section">
        <div className="section-head">
          <p className="eyebrow">{sc('home.showcaseEyebrow')}</p>
          <h2 className="section-title">{sc('home.showcaseTitle')}</h2>
          <p className="section-description">{sc('home.showcaseDescription')}</p>
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
                {sc('works.readCaseStudy')}
              </Link>
              <Link className="btn secondary" to="/contact">
                {sc('works.discussBuild')}
              </Link>
            </div>
          </article>
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="page-content testimonial-section">
        <div className="section-head">
          <p className="eyebrow">{sc('home.testimonialEyebrow')}</p>
          <h2 className="section-title">{sc('home.testimonialTitle')}</h2>
        </div>

        <div className="testimonial-grid">
          {localizedContent.testimonials.map((item) => (
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
          <p className="eyebrow">{sc('home.insightsEyebrow')}</p>
          <h2 className="section-title">{sc('home.insightsTitle')}</h2>
        </div>

        <div className="insight-grid">
          {localizedContent.insights.map((item) => (
            <article key={item.title} className="insight-card surface-panel">
              <p className="insight-time">{item.readTime}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link to="/contact" className="insight-link">
                {sc('home.discussTopic')}
              </Link>
            </article>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="page-content faq-section">
        <div className="section-head">
          <p className="eyebrow">{sc('home.faqEyebrow')}</p>
          <h2 className="section-title">{sc('home.faqTitle')}</h2>
        </div>

        <div className="faq-list">
          <details className="faq-item surface-panel" open>
            <summary>{sc('home.faq1Q')}</summary>
            <p>{sc('home.faq1A')}</p>
          </details>
          <details className="faq-item surface-panel">
            <summary>{sc('home.faq2Q')}</summary>
            <p>{sc('home.faq2A')}</p>
          </details>
          <details className="faq-item surface-panel">
            <summary>{sc('home.faq3Q')}</summary>
            <p>{sc('home.faq3A')}</p>
          </details>
        </div>
      </SectionReveal>

      <section className="page-content">
        <div className="surface-panel cta-banner">
          <div>
            <h3>{sc('home.ctaTitle')}</h3>
            <p>{sc('home.ctaDescription')}</p>
          </div>
          <Link className="btn primary" to="/contact" onClick={() => handleTrack('footer_cta_quote')}>
            {sc('home.ctaButton')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
