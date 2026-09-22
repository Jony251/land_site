import { Link } from 'react-router-dom'
import useI18n from '../i18n/useI18n'
import projects from './in_Work/projectsData'
import catGif from '../assets/cat.gif'
import './Home.css'

const SERVICE_KEYS = ['s1', 's2', 's3', 's4', 's5']

/**
 * Home page.
 *
 * Output:
 * - Hero with the studio's positioning and primary CTAs.
 * - A flagship project snapshot as visual proof.
 * - A "what we build" capability ladder (mirrors Services).
 * - A featured-work strip of the two flagship (system-level) projects.
 */
const Home = () => {
  const { t } = useI18n()

  const flagshipProjects = projects.filter((p) => p.tier === 'flagship')
  const heroProject = flagshipProjects[0]

  return (
    <div className="home-page">
      <section className="hero home-hero">
        <div className="page-content home-hero-inner">
          <div className="home-hero-copy">
            <span className="home-eyebrow">
              <img className="home-eyebrow-mark" src={catGif} alt="" aria-hidden="true" />
              {t('home.eyebrow')}
            </span>
            <h1>
              {t('home.titleStart')}
              <span className="home-title-accent">{t('home.titleAccent')}</span>
              {t('home.titleEnd')}
            </h1>
            <p className="hero-subtitle home-hero-subtitle">{t('home.subtitle')}</p>
            <div className="hero-actions">
              <Link className="btn primary" to="/works">
                {t('home.ctaWorks')}
              </Link>
              <Link className="btn" to="/contact">
                {t('home.ctaContact')}
              </Link>
            </div>
          </div>

          {heroProject && (
            <Link className="home-flagship-card" to={`/works/${heroProject.id}`}>
              <span className="home-flagship-eyebrow">{t('home.flagshipEyebrow')}</span>
              <img
                className="home-flagship-image"
                src={heroProject.thumbnail}
                alt={t(heroProject.titleKey)}
              />
              <div className="home-flagship-footer">
                <h3>{t(heroProject.titleKey)}</h3>
                <span className="home-flagship-cta">{t('home.flagshipCta')} →</span>
              </div>
            </Link>
          )}
        </div>
      </section>

      <section className="page-content home-section">
        <div className="home-section-head">
          <h2>{t('home.capabilitiesTitle')}</h2>
          <p>{t('home.capabilitiesLead')}</p>
        </div>
        <div className="card-grid home-capabilities-grid">
          {SERVICE_KEYS.map((key) => (
            <Link key={key} to="/services" className="card-link">
              <h3>{t(`services.${key}.title`)}</h3>
              <p>{t(`services.${key}.desc`)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-content home-section">
        <div className="home-section-head">
          <h2>{t('home.featuredTitle')}</h2>
          <p>{t('home.featuredLead')}</p>
        </div>
        <div className="card-grid home-featured-grid">
          {flagshipProjects.map((project) => (
            <Link key={project.id} to={`/works/${project.id}`} className="card-link home-featured-card">
              <img
                className="home-featured-image"
                src={project.thumbnail}
                alt={t(project.titleKey)}
              />
              <span className="project-card-badge tier-flagship">
                {t(`works.tier.${project.tier}`)}
              </span>
              <h3>{t(project.titleKey)}</h3>
              <p>{t(project.descKey)}</p>
            </Link>
          ))}
        </div>
        <div className="home-featured-more">
          <Link className="btn" to="/works">
            {t('home.ctaWorks')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
