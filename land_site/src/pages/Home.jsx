import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/LanguageProvider'
import bg from '../assets/BG.png'

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
          <div className="landing-card-inner">
            <div className="landing-brand">C.A.T.</div>
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
