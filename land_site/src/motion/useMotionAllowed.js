import { useSyncExternalStore } from 'react';
import useA11y from '../a11y/useA11y';

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange) => {
  const mql = window.matchMedia?.(REDUCE_QUERY);
  mql?.addEventListener('change', onChange);
  return () => mql?.removeEventListener('change', onChange);
};

const getOsReduced = () => Boolean(window.matchMedia?.(REDUCE_QUERY).matches);

/**
 * Whether animations may run.
 *
 * Input:
 * - OS `prefers-reduced-motion` media query.
 * - Accessibility widget `reduceMotion` flag (via `useA11y`).
 *
 * Output:
 * - (boolean) `false` if either asks for reduced motion.
 */
const useMotionAllowed = () => {
  const { state } = useA11y();
  const osReduced = useSyncExternalStore(subscribe, getOsReduced, () => true);
  return !osReduced && !state.reduceMotion;
};

export default useMotionAllowed;
