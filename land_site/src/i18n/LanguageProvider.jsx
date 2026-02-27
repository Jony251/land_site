import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, translations } from './translations';
import LanguageContext from './LanguageContext';

/**
 * Returns the text direction for a language code.
 *
 * Input:
 * - `lang` (string): language code (e.g. `en`, `ru`, `he`)
 *
 * Output:
 * - `ltr` | `rtl`
 */
const getDir = (lang) => {
  return SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.dir || 'ltr';
};

/**
 * Determines the initial language.
 *
 * Input:
 * - Reads from `localStorage` key `bc_lang`
 * - Uses `navigator.language` as a fallback
 *
 * Output:
 * - A supported language code. Defaults to `DEFAULT_LANGUAGE`.
 */
const getInitialLanguage = () => {
  const saved = localStorage.getItem('bc_lang');
  if (saved && translations[saved]) return saved;

  const browser = (navigator.language || '').slice(0, 2).toLowerCase();
  if (translations[browser]) return browser;

  return DEFAULT_LANGUAGE;
};

/**
 * Safe getter for nested translation keys using dot notation.
 *
 * Input:
 * - `obj` (object): translations tree
 * - `path` (string): dot-notation key path, e.g. `nav.contact`
 *
 * Output:
 * - The found value or `undefined`
 */
const getByPath = (obj, path) => {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
};

/**
 * i18n provider.
 *
 * Input:
 * - `children` (React.ReactNode)
 *
 * Side effects:
 * - Updates `document.documentElement.lang` and `document.documentElement.dir`
 * - Persists selected language to `localStorage` (`bc_lang`)
 *
 * Output:
 * - Provides `{ lang, dir, languages, setLang, t }` via React context.
 */
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
