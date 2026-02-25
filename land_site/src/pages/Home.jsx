import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/LanguageProvider'
import bg from '../assets/BG.png'
import CatAnime from '../Components/Cat_anime/Cat_anime.comp'

const Home = () => {
  const { t } = useI18n()

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <div className="landing-page" style={{ backgroundImage: `url(${bg})` }}>
      <div className="landing-center">
        <div className="landing-card" role="region" aria-label="Blue Cat landing">
          <CatAnime size={72} durationMs={14000} />
          <div className="landing-card-inner">
            <div className="landing-brand">
              <span className="landing-brand-ltr" dir="ltr">
                C.A.T.
              </span>
            </div>
            <div className="landing-subtitle">Creative Advanced Technology</div>
            <nav className="landing-nav" aria-label="Primary">
              <Link className="landing-link" to="/works">
                {t('nav.works')}
              </Link>
              <span className="landing-sep" aria-hidden="true">
                |
              </span>
              <Link className="landing-link" to="/services">
                {t('nav.services')}
              </Link>
              <span className="landing-sep" aria-hidden="true">
                |
              </span>
              <Link className="landing-link" to="/about">
                {t('nav.about')}
              </Link>
              <span className="landing-sep" aria-hidden="true">
                |
              </span>
              <Link className="landing-link" to="/contact">
                {t('nav.contact')}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
