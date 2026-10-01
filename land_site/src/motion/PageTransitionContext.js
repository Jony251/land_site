import { createContext } from 'react';

/**
 * Page transition context.
 *
 * Output:
 * - `{ start(to: string, label: string): void }` inside a `PageTransitionProvider`, `null` without one.
 */
export const PageTransitionContext = createContext(null);
