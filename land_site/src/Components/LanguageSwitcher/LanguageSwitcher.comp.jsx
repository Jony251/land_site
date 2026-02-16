import { useI18n } from '../../i18n/LanguageProvider';
import { useSiteCopy } from '../../i18n/siteCopy';
import './LanguageSwitcher.comp.css';

const LanguageSwitcher = () => {
  const { lang, languages, setLang } = useI18n();
  const sc = useSiteCopy();

  return (
    <div className="lang-switch" role="group" aria-label={sc('nav.languageSelector')}>
      {languages.map((l) => (
        <button
          key={l.code}
          type="button"
          className={`lang-btn ${lang === l.code ? 'active' : ''}`}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          title={`Switch language to ${l.label}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
