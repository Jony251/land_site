import { useContext } from 'react';
import AccessibilityContext from './AccessibilityContext';

/**
 * Hook for accessing accessibility context.
 *
 * Output:
 * - `{ state, setFontScale, toggleHighContrast, toggleReduceMotion, reset }`
 */
const useA11y = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useA11y must be used within AccessibilityProvider');
  return ctx;
};

export default useA11y;
