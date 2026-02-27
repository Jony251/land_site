import { useEffect, useMemo, useState } from 'react';

import AccessibilityContext from './AccessibilityContext';

const STORAGE_KEY = 'bc_a11y';

/**
 * Default accessibility settings.
 *
 * Output:
 * - Object with:
 *   - `fontScale` (number)
 *   - `highContrast` (boolean)
 *   - `reduceMotion` (boolean)
 */
const defaultState = {
  fontScale: 1,
  highContrast: false,
  reduceMotion: false,
};

/**
 * Clamps a numeric value into a range.
 *
 * Input:
 * - `v` (number)
 * - `min` (number)
 * - `max` (number)
 *
 * Output:
 * - (number) clamped value
 */
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/**
 * Reads initial accessibility settings from localStorage.
 *
 * Side effects:
 * - Reads `localStorage` key `bc_a11y`
 *
 * Output:
 * - State object compatible with `defaultState`.
 */
const readInitialState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);

    return {
      fontScale: clamp(Number(parsed.fontScale ?? 1), 1, 1.3),
      highContrast: Boolean(parsed.highContrast),
      reduceMotion: Boolean(parsed.reduceMotion),
    };
  } catch {
    return defaultState;
  }
};

/**
 * Accessibility provider.
 *
 * Input:
 * - `children` (React.ReactNode)
 *
 * Side effects:
 * - Persists state to `localStorage` (`bc_a11y`)
 * - Updates `document.documentElement.dataset`:
 *   - `data-font-scale`
 *   - `data-high-contrast`
 *   - `data-reduce-motion`
 *
 * Output:
 * - Provides `{ state, setFontScale, toggleHighContrast, toggleReduceMotion, reset }` via context.
 */
export const AccessibilityProvider = ({ children }) => {
  const [state, setState] = useState(readInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    document.documentElement.dataset.fontScale = state.fontScale.toFixed(1);
    document.documentElement.dataset.highContrast = state.highContrast ? 'true' : 'false';
    document.documentElement.dataset.reduceMotion = state.reduceMotion ? 'true' : 'false';
  }, [state]);

  const value = useMemo(
    () => ({
      state,
      setFontScale: (fontScale) => setState((s) => ({ ...s, fontScale: clamp(fontScale, 1, 1.3) })),
      toggleHighContrast: () => setState((s) => ({ ...s, highContrast: !s.highContrast })),
      toggleReduceMotion: () => setState((s) => ({ ...s, reduceMotion: !s.reduceMotion })),
      reset: () => setState(defaultState),
    }),
    [state]
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
};
