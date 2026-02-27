import useI18n from '../../i18n/useI18n';
import './LanguageSwitcher.comp.css';

const LanguageSwitcher = () => {
  const { lang, languages, setLang } = useI18n();

  return (
    <div className="lang-switch" role="group" aria-label="Language selector">
      {languages.map((l) => (
        <button
          key={l.code}
          type="button"
          className={`lang-btn ${lang === l.code ? 'active' : ''}`}
          onClick={() => setLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
