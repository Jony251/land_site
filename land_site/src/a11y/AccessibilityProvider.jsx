import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AccessibilityContext = createContext(null);

const STORAGE_KEY = 'bc_a11y';

const defaultState = {
  fontScale: 1,
  highContrast: false,
  reduceMotion: false,
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

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

export const useA11y = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useA11y must be used within AccessibilityProvider');
  return ctx;
};
