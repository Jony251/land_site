import { useContext } from 'react';
import LanguageContext from './LanguageContext';

/**
 * Hook for accessing i18n context.
 *
 * Output:
 * - `{ lang, dir, languages, setLang, t }`
 */
const useI18n = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider');
  return ctx;
};

export default useI18n;
