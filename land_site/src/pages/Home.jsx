import TransitionLink from '../motion/TransitionLink'
import useI18n from '../i18n/useI18n'
import { OWNER_NAME } from '../config/owner'
import RevealText from '../motion/RevealText'
import Magnetic from '../motion/Magnetic'
import Marquee from '../motion/Marquee'
import HoverPreviewList from '../motion/HoverPreviewList'
import OwnerPhoto from '../Components/OwnerPhoto/OwnerPhoto.comp'
import ServiceRows from '../Components/ServiceRows/ServiceRows.comp'
import projects from './in_Work/projectsData'
import { sortByTier, toPreviewItems } from './in_Work/projectItems'
import './Home.css'

const SELECTED_COUNT = 5

/**
 * Home page.
 *
 * Output:
 * - Hero: giant marquee, the offer as `<h1>`, magnetic round "Start a project" button.
 * - Intro: owner photo, name and a short first-person introduction.
 * - Selected work: the top projects (flagship first) as a hover-preview list.
 * - What I build: the five service levels as numbered rows linking to Services.
 */
const Home = () => {
  const { t, lang } = useI18n()
  const name = OWNER_NAME[lang]
  const selected = toPreviewItems(sortByTier(projects).slice(0, SELECTED_COUNT), t)

  return (
    <div className="home-page">
      <section className="home-hero section-ink">
        <Marquee className="display home-marquee">{t('home.marquee')}</Marquee>
        <div className="page-content home-hero-row">
          <RevealText as="h1" className="home-offer">
            {t('home.titleStart')}
            <span className="home-offer-accent">{t('home.titleAccent')}</span>
            {t('home.titleEnd')}
          </RevealText>
          <Magnetic>
            <TransitionLink className="btn-round" to="/contact" label={t('nav.contact')}>
              {t('home.ctaContact')}
            </TransitionLink>
          </Magnetic>
        </div>
      </section>

      <section className="home-intro section-paper">
        <div className="page-content home-intro-inner">
          <OwnerPhoto alt={name} className="home-intro-photo" />
          <div className="home-intro-copy">
            <p className="home-intro-name">{name}</p>
            <p className="home-intro-text">{t('home.intro')}</p>
            <TransitionLink className="home-intro-link" to="/about" label={t('nav.about')}>
              {t('home.introCta')}
            </TransitionLink>
          </div>
        </div>
      </section>

      <section className="home-work section-ink" aria-labelledby="home-work-title">
        <div className="page-content">
          <h2 id="home-work-title" className="home-section-title">
            {t('home.selectedTitle')}
          </h2>
          <HoverPreviewList items={selected} />
          <TransitionLink className="btn home-work-more" to="/works" label={t('nav.works')}>
            {t('home.ctaWorks')}
          </TransitionLink>
        </div>
      </section>

      <section className="home-build section-paper" aria-labelledby="home-build-title">
        <div className="page-content">
          <h2 id="home-build-title" className="home-section-title">
            {t('home.buildTitle')}
          </h2>
          <ServiceRows withLinks />
        </div>
      </section>
    </div>
  )
}

export default Home
