import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, translations } from './translations';

const LanguageContext = createContext(null);

const getDir = (lang) => {
  return SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.dir || 'ltr';
};

const getInitialLanguage = () => {
  const saved = localStorage.getItem('bc_lang');
  if (saved && translations[saved]) return saved;

  const browser = (navigator.language || '').slice(0, 2).toLowerCase();
  if (translations[browser]) return browser;

  return DEFAULT_LANGUAGE;
};

const getByPath = (obj, path) => {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(getInitialLanguage);

  const dir = useMemo(() => getDir(lang), [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem('bc_lang', lang);
  }, [lang, dir]);

  const t = useCallback(
    (key) => {
      const primary = getByPath(translations[lang], key);
      if (primary !== undefined) return primary;

      const fallback = getByPath(translations[DEFAULT_LANGUAGE], key);
      if (fallback !== undefined) return fallback;

      return key;
    },
    [lang]
  );

  const value = useMemo(
    () => ({
      lang,
      dir,
      languages: SUPPORTED_LANGUAGES,
      setLang,
      t,
    }),
    [lang, dir, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider');
  return ctx;
};
