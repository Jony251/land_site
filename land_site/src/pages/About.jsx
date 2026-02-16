import { useI18n } from '../i18n/LanguageProvider';
import { useSiteCopy } from '../i18n/siteCopy';
import SEO from '../Components/SEO/SEO.comp';
import SectionReveal from '../Components/SectionReveal/SectionReveal.comp';
import { getLocalizedSiteContent } from '../data/siteContent';
import './About.css';

const About = () => {
  const { t, lang } = useI18n();
  const sc = useSiteCopy();
  const { skillGroups } = getLocalizedSiteContent(lang);

  return (
    <div className="page about-page">
      <SEO
        title={sc('seo.aboutTitle')}
        description={sc('seo.aboutDescription')}
      />

      <section className="page-content">
        <header className="page-header">
          <p className="eyebrow">{t('about.title')}</p>
          <h1 className="page-title">{t('about.title')}</h1>
        </header>

        <div className="about-hero-grid">
          <article className="surface-panel about-bio">
            <p>{t('about.intro')}</p>
            <p>{t('about.skills')}</p>
            <p>{t('about.approach')}</p>
            <p className="about-cta">{t('about.cta')}</p>
          </article>

          <aside className="surface-panel about-side-card">
            <h2>{sc('aboutPage.principlesTitle')}</h2>
            <ul>
              <li>{sc('aboutPage.principle1')}</li>
              <li>{sc('aboutPage.principle2')}</li>
              <li>{sc('aboutPage.principle3')}</li>
              <li>{sc('aboutPage.principle4')}</li>
            </ul>
            <a className="btn secondary small" href="/Blue-Cat-CV.txt" download>
              {sc('nav.downloadCv')}
            </a>
          </aside>
        </div>
      </section>

      <SectionReveal as="section" className="page-content">
        <div className="section-head">
          <p className="eyebrow">{sc('aboutPage.coreStrengths')}</p>
          <h2 className="section-title">{sc('aboutPage.coreStrengths')}</h2>
        </div>

        <div className="skills-grid">
          {skillGroups.map((group) => (
            <article key={group.title} className="surface-panel skill-card">
              <h3>{group.title}</h3>
              <div className="skill-list">
                {group.items.map((item) => (
                  <div key={item.label} className="skill-item">
                    <div className="skill-item-head">
                      <span>{item.label}</span>
                      <strong>{item.level}%</strong>
                    </div>
                    <div className="skill-progress" aria-hidden="true">
                      <span style={{ width: `${item.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="page-content">
        <div className="card-grid">
          <a className="card-link" href="https://github.com/Jony251" target="_blank" rel="noreferrer">
            <h3>{t('about.githubTitle')}</h3>
            <p>{t('about.githubText')}</p>
          </a>
          <a className="card-link" href="https://www.linkedin.com/in/evgeny-nemchenko/" target="_blank" rel="noreferrer">
            <h3>{t('about.linkedinTitle')}</h3>
            <p>{t('about.linkedinText')}</p>
          </a>
        </div>

        <div className="surface-panel cta-banner about-cta-banner">
          <div>
            <h3>{sc('aboutPage.ctaTitle')}</h3>
            <p>{sc('aboutPage.ctaBody')}</p>
          </div>
          <a className="btn primary" href="mailto:bluecat.webdev@gmail.com">
            {sc('aboutPage.ctaButton')}
          </a>
        </div>
      </SectionReveal>
    </div>
  );
};

export default About;
