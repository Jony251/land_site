import ContactForm from '../Components/ContactForm/ContactForm.comp'
import { useI18n } from '../i18n/LanguageProvider'
import FinalCTA from '../Components/FinalCTA/FinalCTA.comp'

const Contact = () => {
  const { t } = useI18n()
  return (
    <div className="page">
      <div className="page-content" style={{ textAlign: 'center' }}>
        <h1>{t('contact.title')}</h1>
        <p>{t('contact.body')}</p>
        <FinalCTA />
        <ContactForm />
      </div>
    </div>
  )
}

export default Contact
