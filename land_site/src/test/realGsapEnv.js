import { mockMatchMedia } from './matchMedia'

/**
 * Environment prep for tests that import the REAL (unmocked) `src/motion/gsap.js`.
 *
 * GSAP's ScrollTrigger touches `window.matchMedia` while registering, at module-eval
 * time — before `setup.js`'s `beforeEach` installs the fake. Import this file FIRST
 * (before anything that pulls in `src/motion/gsap.js`) so the fake exists by then.
 *
 * Output:
 * - Side effect only: installs `mockMatchMedia()` (all queries `false`, so motion is allowed).
 */
mockMatchMedia()
