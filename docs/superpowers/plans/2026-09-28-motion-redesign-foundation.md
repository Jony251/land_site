# Motion Redesign — Plan 1: Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lay the foundation for the bluecat.cc redesign: a test toolchain, dependency cleanup, the new visual tokens and fonts, an owner-photo component, and the reusable motion building blocks (reduced-motion hook, smooth scroll, text reveal, magnetic, marquee).

**Architecture:** Everything stays inside the existing React 19 + Vite SPA in `land_site/`. Motion code lives in `land_site/src/motion/`; GSAP plugins are registered once in `src/motion/gsap.js` and every component imports from there (tests mock that one module). Every effect is gated by `useMotionAllowed()`, which combines the OS `prefers-reduced-motion` setting with the site's accessibility-widget toggle.

**Tech Stack:** React 19, Vite (rolldown-vite 7), react-router-dom 7, GSAP 3.15 (ScrollTrigger, SplitText) + `@gsap/react` 2.1, Lenis 1.3, `@fontsource-variable/inter` + `@fontsource-variable/heebo` 5.3, Vitest 5 + jsdom + Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-28-motion-redesign-design.md` (sections 2, 4, 5, 7, 8 items 1–3). Plan 2 (pages: spec §3 and delivery items 4–7) is written after this plan is merged.

## Global Constraints

- All commands run from `land_site/` (the app folder inside the repo) unless stated otherwise.
- Palette: `--ink #141517`, `--paper #F4F3F0`, `--accent #3D5AFE`, `--cat-gold #F5A623`. Existing token names (`--bg`, `--text`, `--accent`, …) are kept and re-pointed. High-contrast override stays.
- Font stack: `'Inter Variable', 'Heebo Variable', system-ui, sans-serif`, self-hosted via `@fontsource-variable/*` (no Google Fonts request).
- Every effect must switch off completely with OS `prefers-reduced-motion` **or** `data-reduce-motion="true"` from the accessibility widget; with motion off, content renders in its final visible state.
- Every effect must work in RTL (Hebrew, `dir="rtl"`).
- All GSAP code runs inside `useGSAP()` and imports `gsap`/plugins only from `src/motion/gsap.js`.
- Tests import `describe/it/expect/vi` explicitly from `vitest` (no globals).
- `npm run lint`, `npm test`, `npm run build` must all pass at the end of every task.
- **A push to `main` deploys to production.** Never push to `main`. Each PR stays open for owner review.
- Branching: three stacked PR branches, each in its own worktree under `.worktrees/` (repo root). PR 1 from `origin/main`; PR 2 from the PR 1 branch; PR 3 from the PR 2 branch. Owner merges them in order.

## Review Focus

1. **Language switch while a heading is on screen** — the heading re-splits and re-animates in the new language instead of showing stale or doubled text. Test: Task 7 "re-splits when children change".
2. **Reduced motion toggled in the accessibility widget while on a page** — smooth scroll stops immediately (Lenis destroyed), page stays usable. Test: Task 6 "destroys Lenis when reduce-motion is toggled on".
3. **Hebrew visitor** — marquee scrolls the opposite way and its duplicated copy stays hidden from screen readers. Test: Task 9 RTL + aria-hidden tests.
4. **Touch device** — magnetic buttons do nothing (no stuck offsets). Test: Task 8 "does nothing on a coarse pointer".
5. **High-contrast mode after the token change** — the high-contrast block still overrides `--bg`/`--text`. Test: Task 3 "keeps the high-contrast override".

---

## PR 1 — Tooling and cleanup (branch `chore/test-tooling`)

### Task 0: Create the PR 1 worktree

- [ ] **Step 1: Ignore `.worktrees/` locally and create the worktree** (from repo root)

```bash
cd ~/projects/land_site
grep -qx '.worktrees/' .git/info/exclude || echo '.worktrees/' >> .git/info/exclude
git fetch origin
git worktree add .worktrees/test-tooling -b chore/test-tooling origin/main
cd .worktrees/test-tooling/land_site && npm ci
```

Expected: worktree created, `npm ci` succeeds.

### Task 1: Vitest + Testing Library setup with an i18n parity test

**Files:**
- Modify: `land_site/package.json` (scripts, devDependencies)
- Modify: `land_site/vite.config.js`
- Create: `land_site/src/test/setup.js`
- Create: `land_site/src/test/matchMedia.js`
- Create: `land_site/src/test/renderWithProviders.jsx`
- Test: `land_site/src/i18n/translations.test.js`

**Interfaces:**
- Produces:
  - `mockMatchMedia(initial?: Record<string, boolean>) => { set(query: string, matches: boolean): void }` — replaces `window.matchMedia`; unknown queries report `false`; `set` fires `change` listeners.
  - `renderWithProviders(ui, { route = '/' } = {})` → Testing Library render result, wrapped in `AccessibilityProvider` → `LanguageProvider` → `MemoryRouter`.
  - `createWrapper({ route = '/' } = {})` → wrapper component for `renderHook`.
  - `npm test` runs `vitest run`.

- [ ] **Step 1: Install test dependencies**

```bash
npm i -D vitest@^5.0.2 jsdom@^30.1.1 @testing-library/react@^16.3.3 @testing-library/jest-dom@^7.0.1 @testing-library/user-event@^14.6.7
npm pkg set scripts.test="vitest run"
```

- [ ] **Step 2: Configure Vitest in `land_site/vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
```

- [ ] **Step 3: Create `land_site/src/test/matchMedia.js`**

```js
/**
 * Replaces `window.matchMedia` with a controllable fake.
 *
 * Input:
 * - `initial` (object): media query string -> boolean. Unknown queries are `false`.
 *
 * Output:
 * - `{ set(query, matches) }` — changes a query result and fires its `change` listeners.
 */
export const mockMatchMedia = (initial = {}) => {
  const state = { ...initial }
  const listeners = new Map()

  window.matchMedia = (query) => ({
    get matches() {
      return Boolean(state[query])
    },
    media: query,
    addEventListener: (_type, cb) => {
      if (!listeners.has(query)) listeners.set(query, new Set())
      listeners.get(query).add(cb)
    },
    removeEventListener: (_type, cb) => listeners.get(query)?.delete(cb),
  })

  return {
    set(query, matches) {
      state[query] = matches
      listeners.get(query)?.forEach((cb) => cb({ matches, media: query }))
    },
  }
}
```

- [ ] **Step 4: Create `land_site/src/test/setup.js`**

```js
import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { mockMatchMedia } from './matchMedia'

beforeEach(() => {
  mockMatchMedia()
  window.scrollTo = vi.fn()
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  document.documentElement.removeAttribute('dir')
  vi.clearAllMocks()
})
```

- [ ] **Step 5: Create `land_site/src/test/renderWithProviders.jsx`**

```jsx
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AccessibilityProvider } from '../a11y/AccessibilityProvider'
import { LanguageProvider } from '../i18n/LanguageProvider'

/**
 * Builds a wrapper with the app's providers.
 *
 * Input:
 * - `route` (string): initial router path.
 *
 * Output:
 * - React component usable as a Testing Library `wrapper`.
 */
export const createWrapper = ({ route = '/' } = {}) =>
  function Wrapper({ children }) {
    return (
      <AccessibilityProvider>
        <LanguageProvider>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </LanguageProvider>
      </AccessibilityProvider>
    )
  }

/**
 * Renders UI inside the app's providers.
 *
 * Input:
 * - `ui` (React element), `{ route }`.
 *
 * Output:
 * - Testing Library render result.
 */
export const renderWithProviders = (ui, { route = '/' } = {}) =>
  render(ui, { wrapper: createWrapper({ route }) })
```

- [ ] **Step 6: Write the parity test `land_site/src/i18n/translations.test.js`**

```js
import { describe, expect, it } from 'vitest'
import { SUPPORTED_LANGUAGES, translations } from './translations'

const keysOf = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? keysOf(value, `${prefix}${key}.`)
      : [`${prefix}${key}`]
  )

describe('translations', () => {
  const enKeys = keysOf(translations.en).sort()

  it('has a dictionary for every supported language', () => {
    for (const { code } of SUPPORTED_LANGUAGES) {
      expect(translations[code], code).toBeDefined()
    }
  })

  it.each(['ru', 'he'])('%s has exactly the same keys as en', (code) => {
    expect(keysOf(translations[code]).sort()).toEqual(enKeys)
  })
})
```

- [ ] **Step 7: Run the tests**

Run: `npm test`
Expected: PASS, 3 tests. (Parity was verified by hand on 2026-09-28; this test is a new guard over existing data, so it passes on first run. To prove it can fail, temporarily delete one key from `translations.he`, run `npm test`, see the FAIL naming the key, then restore it.)

- [ ] **Step 8: Lint and build**

Run: `npm run lint && npm run build`
Expected: no lint errors; build succeeds.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vite.config.js src/test src/i18n/translations.test.js
git commit -m "test: add Vitest + Testing Library and i18n parity test"
```

### Task 2: Remove unused dependencies and run tests in CI

**Files:**
- Modify: `land_site/package.json`, `land_site/package-lock.json`
- Delete: `land_site/.expo/`, `land_site/src/Components/Cat_anime/`
- Modify: `.github/workflows/deploy.yml` (add a test step before Build)
- Modify: `README.md` (Run section)

**Interfaces:** none produced.

- [ ] **Step 1: Confirm nothing imports them**

Run: `grep -rnE "from ['\"](lottie-react|expo)|Cat_anime" src --include=*.jsx --include=*.js | grep -v "Components/Cat_anime/"`
Expected: no output. If there is output, stop and report it.

- [ ] **Step 2: Remove them**

```bash
npm uninstall expo lottie-react
git rm -rq .expo src/Components/Cat_anime
```

- [ ] **Step 3: Add the test step to `.github/workflows/deploy.yml`**, directly after the "Install dependencies" step:

```yaml
      - name: Test
        working-directory: land_site
        run: npm test
```

- [ ] **Step 4: Add to `README.md` under "Local dev"** (after the `npm run dev` bullet):

```markdown
  - `npm test` (Vitest unit tests)
```

- [ ] **Step 5: Verify**

Run: `npm run lint && npm test && npm run build`
Expected: all pass; the JS bundle is not larger than before (was 297.12 kB).

- [ ] **Step 6: Commit and push the PR branch**

```bash
git add -A package.json package-lock.json ../.github/workflows/deploy.yml ../README.md
git commit -m "chore: remove unused expo/lottie deps, run tests in CI"
git push -u origin chore/test-tooling
gh pr create --base main --title "Test tooling and dependency cleanup" --body "PR 1/3 of the motion redesign foundation. Adds Vitest + Testing Library, an i18n parity test, runs tests in CI, removes unused expo/lottie-react/Cat_anime."
```

---

## PR 2 — Visual foundation (branch `feat/visual-foundation`, based on `chore/test-tooling`)

### Task 3: Design tokens and fonts

**Files:**
- Modify: `land_site/src/pages/colors.css`
- Modify: `land_site/src/index.css:3-4` (font-family) and remove `html { scroll-behavior: smooth; }`
- Modify: `land_site/src/App.css` (body font-family; append section utilities)
- Modify: `land_site/src/main.jsx` (font imports)
- Test: `land_site/src/pages/colors.test.js`

**Interfaces:**
- Produces CSS tokens `--ink`, `--paper`, `--accent`, `--cat-gold`, `--font-sans` and classes `.section-ink`, `.section-paper`, `.display`.

- [ ] **Step 1: Create the worktree**

```bash
cd ~/projects/land_site
git worktree add .worktrees/visual-foundation -b feat/visual-foundation chore/test-tooling
cd .worktrees/visual-foundation/land_site && npm ci
```

- [ ] **Step 2: Write the failing test `land_site/src/pages/colors.test.js`**

```js
import { describe, expect, it } from 'vitest'
import css from './colors.css?raw'

const rootBlock = css.slice(css.indexOf(':root'), css.indexOf('}', css.indexOf(':root')))
const contrastStart = css.indexOf('html[data-high-contrast="true"]')
const contrastBlock = css.slice(contrastStart, css.indexOf('}', contrastStart))

describe('design tokens', () => {
  it.each([
    ['--ink', '#141517'],
    ['--paper', '#F4F3F0'],
    ['--accent', '#3D5AFE'],
    ['--cat-gold', '#F5A623'],
  ])('defines %s as %s', (name, value) => {
    expect(rootBlock).toContain(`${name}: ${value};`)
  })

  it('points the legacy tokens at the new palette', () => {
    expect(rootBlock).toContain('--bg: var(--paper);')
    expect(rootBlock).toContain('--text: var(--ink);')
  })

  it('defines the font stack', () => {
    expect(rootBlock).toContain("--font-sans: 'Inter Variable', 'Heebo Variable', system-ui, sans-serif;")
  })

  it('keeps the high-contrast override', () => {
    expect(contrastBlock).toContain('--bg: #000000;')
    expect(contrastBlock).toContain('--text: #ffffff;')
  })
})
```

- [ ] **Step 3: Run it to see it fail**

Run: `npm test -- src/pages/colors.test.js`
Expected: FAIL on `--ink`, `--paper`, `--accent`, `--cat-gold`, legacy tokens and font stack; high-contrast test PASSES.

- [ ] **Step 4: Replace the `:root` block in `land_site/src/pages/colors.css`** (keep the high-contrast block below it unchanged)

```css
/* ── Centralized Colors, Shadows, Radius & Type ── */

:root {
  /* Palette */
  --ink: #141517;
  --paper: #F4F3F0;
  --cat-gold: #F5A623;

  /* Backgrounds */
  --bg: var(--paper);
  --surface: #ffffff;
  --surface-2: #fbfbfa;

  /* Text */
  --text: var(--ink);
  --muted: rgba(20, 21, 23, 0.68);
  --text-muted: rgba(20, 21, 23, 0.68);

  /* Borders */
  --border: rgba(20, 21, 23, 0.12);

  /* Shadows */
  --shadow-sm: 0 6px 18px rgba(20, 21, 23, 0.06);
  --shadow: 0 10px 30px rgba(20, 21, 23, 0.08);
  --shadow-lg: 0 18px 52px rgba(20, 21, 23, 0.12);

  /* Accent / Brand */
  --accent: #3D5AFE;
  --accent-2: var(--accent);
  --primary: var(--accent);

  /* Status */
  --danger: #ff6b6b;
  --success: #22c55e;

  /* Radius */
  --radius: 14px;
  --radius-sm: 12px;

  /* Type */
  --font-sans: 'Inter Variable', 'Heebo Variable', system-ui, sans-serif;
}
```

- [ ] **Step 5: Run the test**

Run: `npm test -- src/pages/colors.test.js`
Expected: PASS (8 tests).

- [ ] **Step 6: Install fonts and wire them up**

```bash
npm i @fontsource-variable/inter@^5.3.0 @fontsource-variable/heebo@^5.3.0
```

In `land_site/src/main.jsx`, add above `import './index.css'`:

```js
import '@fontsource-variable/inter'
import '@fontsource-variable/heebo'
```

In `land_site/src/index.css` change `font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;` to `font-family: var(--font-sans);` and delete these lines (Lenis will own scrolling, and route changes must jump to top instantly):

```css
html {
  scroll-behavior: smooth;
}
```

In `land_site/src/App.css` replace the `body { font-family: -apple-system, … sans-serif; ... }` font-family declaration with `font-family: var(--font-sans);`, and append:

```css
/* ── Section themes & display type ── */
.section-ink {
  background: var(--ink);
  color: var(--paper);
}

.section-paper {
  background: var(--paper);
  color: var(--ink);
}

.display {
  font-size: clamp(3rem, 9vw, 10rem);
  line-height: 0.92;
  letter-spacing: -0.04em;
  font-weight: 500;
}
```

- [ ] **Step 7: Verify**

Run: `npm run lint && npm test && npm run build`
Expected: all pass; `dist/assets` contains `inter-*` and `heebo-*` `.woff2` files.
Then `npm run dev`, open http://localhost:5173 and check EN, RU and HE: text renders in Inter (Latin/Cyrillic) and Heebo (Hebrew), the accent is the new blue.

- [ ] **Step 8: Commit**

```bash
git add src/pages/colors.css src/pages/colors.test.js src/index.css src/App.css src/main.jsx package.json package-lock.json
git commit -m "feat: new palette tokens, section utilities and self-hosted fonts"
```

### Task 4: Owner config and `OwnerPhoto` with mascot fallback

**Files:**
- Create: `land_site/src/config/owner.js`
- Create: `land_site/src/Components/OwnerPhoto/OwnerPhoto.comp.jsx`
- Create: `land_site/src/Components/OwnerPhoto/OwnerPhoto.comp.css`
- Test: `land_site/src/Components/OwnerPhoto/OwnerPhoto.comp.test.jsx`

**Interfaces:**
- Produces:
  - `OWNER_PHOTO = '/owner.jpg'`, `MASCOT_IMAGE = '/logo_NO_font.png'` from `src/config/owner.js`.
  - `<OwnerPhoto alt: string, className?: string />` — round image; shows `OWNER_PHOTO`, switches to `MASCOT_IMAGE` (alt `"Blue Cat"`) if the photo fails to load.

- [ ] **Step 1: Write the failing test `OwnerPhoto.comp.test.jsx`**

```jsx
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import OwnerPhoto from './OwnerPhoto.comp'
import { MASCOT_IMAGE, OWNER_PHOTO } from '../../config/owner'

describe('OwnerPhoto', () => {
  it('shows the owner photo', () => {
    render(<OwnerPhoto alt="Portrait of the owner" />)
    expect(screen.getByRole('img')).toHaveAttribute('src', OWNER_PHOTO)
    expect(screen.getByRole('img')).toHaveAccessibleName('Portrait of the owner')
  })

  it('falls back to the mascot when the photo fails to load', () => {
    render(<OwnerPhoto alt="Portrait of the owner" />)
    fireEvent.error(screen.getByRole('img'))
    expect(screen.getByRole('img')).toHaveAttribute('src', MASCOT_IMAGE)
    expect(screen.getByRole('img')).toHaveAccessibleName('Blue Cat')
  })

  it('does not loop if the mascot also fails', () => {
    render(<OwnerPhoto alt="Portrait of the owner" />)
    fireEvent.error(screen.getByRole('img'))
    fireEvent.error(screen.getByRole('img'))
    expect(screen.getByRole('img')).toHaveAttribute('src', MASCOT_IMAGE)
  })

  it('passes className through', () => {
    render(<OwnerPhoto alt="x" className="about-photo" />)
    expect(screen.getByRole('img')).toHaveClass('owner-photo', 'about-photo')
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npm test -- src/Components/OwnerPhoto`
Expected: FAIL — cannot resolve `./OwnerPhoto.comp` / `../../config/owner`.

- [ ] **Step 3: Create `land_site/src/config/owner.js`**

```js
/**
 * Owner portrait path (served from `public/`). Drop the photo at `public/owner.jpg`.
 * Until it exists, `OwnerPhoto` shows the mascot instead.
 */
export const OWNER_PHOTO = '/owner.jpg';

/**
 * Mascot image used as the owner-photo fallback and in playful brand moments.
 */
export const MASCOT_IMAGE = '/logo_NO_font.png';
```

- [ ] **Step 4: Create `OwnerPhoto.comp.jsx`**

```jsx
import { useState } from 'react';
import { MASCOT_IMAGE, OWNER_PHOTO } from '../../config/owner';
import './OwnerPhoto.comp.css';

/**
 * Round owner portrait with a mascot fallback.
 *
 * Input:
 * - `alt` (string): description of the owner photo.
 * - `className` (string, optional): extra classes.
 *
 * Output:
 * - `<img>` showing `OWNER_PHOTO`, or `MASCOT_IMAGE` if the photo fails to load.
 */
const OwnerPhoto = ({ alt, className = '' }) => {
  const [failed, setFailed] = useState(false);

  return (
    <img
      className={`owner-photo ${className}`.trim()}
      src={failed ? MASCOT_IMAGE : OWNER_PHOTO}
      alt={failed ? 'Blue Cat' : alt}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
};

export default OwnerPhoto;
```

- [ ] **Step 5: Create `OwnerPhoto.comp.css`**

```css
.owner-photo {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  max-width: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: var(--ink);
}
```

- [ ] **Step 6: Run the tests**

Run: `npm test -- src/Components/OwnerPhoto`
Expected: PASS (4 tests).

- [ ] **Step 7: Verify, commit, push PR 2**

```bash
npm run lint && npm test && npm run build
git add src/config/owner.js src/Components/OwnerPhoto
git commit -m "feat: OwnerPhoto component with mascot fallback"
git push -u origin feat/visual-foundation
gh pr create --base chore/test-tooling --title "Visual foundation: tokens, fonts, owner photo" --body "PR 2/3 of the motion redesign foundation (stacked on chore/test-tooling). New palette tokens, self-hosted Inter + Heebo, section utilities, OwnerPhoto with mascot fallback."
```

---

## PR 3 — Motion foundation (branch `feat/motion-foundation`, based on `feat/visual-foundation`)

### Task 5: GSAP registry and `useMotionAllowed`

**Files:**
- Create: `land_site/src/motion/gsap.js`
- Create: `land_site/src/motion/useMotionAllowed.js`
- Create: `land_site/src/test/gsapMock.js`
- Test: `land_site/src/motion/useMotionAllowed.test.jsx`

**Interfaces:**
- Produces:
  - `src/motion/gsap.js` exports `{ gsap, ScrollTrigger, SplitText, useGSAP }` with plugins registered.
  - `useMotionAllowed(): boolean` — `false` when `(prefers-reduced-motion: reduce)` matches or the a11y `reduceMotion` flag is on; re-renders when either changes.
  - `src/test/gsapMock.js` — drop-in mock of `src/motion/gsap.js` for tests: `gsap.{from, fromTo, to, quickTo, ticker.{add, remove, lagSmoothing}, utils.clamp}`, `ScrollTrigger.{update, create}`, `SplitText.create` (calls `onSplit({ lines: [el] })`), real `useGSAP`.

- [ ] **Step 1: Create the worktree and install**

```bash
cd ~/projects/land_site
git worktree add .worktrees/motion-foundation -b feat/motion-foundation feat/visual-foundation
cd .worktrees/motion-foundation/land_site && npm ci
npm i gsap@^3.15.0 @gsap/react@^2.1.2 lenis@^1.3.26
```

- [ ] **Step 2: Write the failing test `land_site/src/motion/useMotionAllowed.test.jsx`**

```jsx
import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import useMotionAllowed from './useMotionAllowed'
import useA11y from '../a11y/useA11y'
import { mockMatchMedia } from '../test/matchMedia'
import { createWrapper } from '../test/renderWithProviders'

const REDUCE = '(prefers-reduced-motion: reduce)'
const useBoth = () => ({ allowed: useMotionAllowed(), a11y: useA11y() })

describe('useMotionAllowed', () => {
  it('allows motion by default', () => {
    const { result } = renderHook(useBoth, { wrapper: createWrapper() })
    expect(result.current.allowed).toBe(true)
  })

  it('blocks motion when the OS asks for reduced motion', () => {
    mockMatchMedia({ [REDUCE]: true })
    const { result } = renderHook(useBoth, { wrapper: createWrapper() })
    expect(result.current.allowed).toBe(false)
  })

  it('reacts when the OS setting changes', () => {
    const media = mockMatchMedia()
    const { result } = renderHook(useBoth, { wrapper: createWrapper() })
    act(() => media.set(REDUCE, true))
    expect(result.current.allowed).toBe(false)
  })

  it('blocks motion when the accessibility widget toggle is on', () => {
    const { result } = renderHook(useBoth, { wrapper: createWrapper() })
    act(() => result.current.a11y.toggleReduceMotion())
    expect(result.current.allowed).toBe(false)
  })
})
```

- [ ] **Step 3: Run it to see it fail**

Run: `npm test -- src/motion/useMotionAllowed`
Expected: FAIL — cannot resolve `./useMotionAllowed`.

- [ ] **Step 4: Create `land_site/src/motion/useMotionAllowed.js`**

```js
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
```

- [ ] **Step 5: Run the test**

Run: `npm test -- src/motion/useMotionAllowed`
Expected: PASS (4 tests).

- [ ] **Step 6: Create `land_site/src/motion/gsap.js`**

```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };
```

- [ ] **Step 7: Create `land_site/src/test/gsapMock.js`**

```js
import { vi } from 'vitest'
import { useGSAP } from '@gsap/react'

/**
 * Test double for `src/motion/gsap.js`.
 * Usage: `vi.mock('../motion/gsap', () => import('../test/gsapMock'))` (adjust paths).
 */
export const gsap = {
  from: vi.fn(),
  to: vi.fn(),
  fromTo: vi.fn(() => ({ timeScale: vi.fn() })),
  quickTo: vi.fn(() => vi.fn()),
  ticker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() },
  utils: { clamp: (min, max, value) => Math.min(max, Math.max(min, value)) },
}

export const ScrollTrigger = { update: vi.fn(), create: vi.fn() }

export const SplitText = {
  create: vi.fn((el, options) => options?.onSplit?.({ lines: [el] })),
}

export { useGSAP }
```

Note: `vi.clearAllMocks()` in `setup.js` clears call history between tests but keeps these implementations.

- [ ] **Step 8: Verify and commit**

```bash
npm run lint && npm test && npm run build
git add package.json package-lock.json src/motion src/test/gsapMock.js
git commit -m "feat: GSAP registry and useMotionAllowed hook"
```

### Task 6: `SmoothScroll` provider (Lenis)

**Files:**
- Create: `land_site/src/motion/SmoothScroll.jsx`
- Modify: `land_site/src/main.jsx` (wrap `<App />`)
- Test: `land_site/src/motion/SmoothScroll.test.jsx`

**Interfaces:**
- Consumes: `useMotionAllowed()`, `{ gsap, ScrollTrigger }` from `./gsap`.
- Produces: `<SmoothScroll>{children}</SmoothScroll>` — must sit inside a Router. Creates one Lenis instance while motion is allowed, destroys it when not; jumps to top on every pathname change.

- [ ] **Step 1: Write the failing test `land_site/src/motion/SmoothScroll.test.jsx`**

```jsx
import { describe, expect, it, vi } from 'vitest'
import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useNavigate } from 'react-router-dom'
import Lenis from 'lenis'
import SmoothScroll from './SmoothScroll'
import useA11y from '../a11y/useA11y'
import { gsap } from './gsap'
import { mockMatchMedia } from '../test/matchMedia'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('./gsap', () => import('../test/gsapMock'))
vi.mock('lenis', () => ({
  default: vi.fn(function Lenis() {
    this.on = vi.fn()
    this.raf = vi.fn()
    this.scrollTo = vi.fn()
    this.destroy = vi.fn()
  }),
}))

let a11y
const Probe = () => {
  const navigate = useNavigate()
  a11y = useA11y()
  return <button onClick={() => navigate('/works')}>go</button>
}

const renderScroll = () =>
  renderWithProviders(
    <SmoothScroll>
      <Probe />
    </SmoothScroll>
  )

describe('SmoothScroll', () => {
  it('creates one Lenis instance driven by the GSAP ticker', () => {
    renderScroll()
    expect(Lenis).toHaveBeenCalledTimes(1)
    expect(gsap.ticker.add).toHaveBeenCalledTimes(1)
  })

  it('does not create Lenis when the OS asks for reduced motion', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true })
    renderScroll()
    expect(Lenis).not.toHaveBeenCalled()
  })

  it('destroys Lenis when reduce-motion is toggled on', () => {
    renderScroll()
    const lenis = Lenis.mock.instances[0]
    act(() => a11y.toggleReduceMotion())
    expect(lenis.destroy).toHaveBeenCalled()
    expect(gsap.ticker.remove).toHaveBeenCalled()
  })

  it('destroys Lenis on unmount', () => {
    const { unmount } = renderScroll()
    const lenis = Lenis.mock.instances[0]
    unmount()
    expect(lenis.destroy).toHaveBeenCalled()
  })

  it('jumps to top on route change with Lenis', async () => {
    renderScroll()
    const lenis = Lenis.mock.instances[0]
    await userEvent.click(screen.getByText('go'))
    expect(lenis.scrollTo).toHaveBeenLastCalledWith(0, { immediate: true })
  })

  it('jumps to top on route change without Lenis', async () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true })
    renderScroll()
    window.scrollTo.mockClear()
    await userEvent.click(screen.getByText('go'))
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npm test -- src/motion/SmoothScroll`
Expected: FAIL — cannot resolve `./SmoothScroll`.

- [ ] **Step 3: Create `land_site/src/motion/SmoothScroll.jsx`**

```jsx
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger } from './gsap';
import useMotionAllowed from './useMotionAllowed';

/**
 * Smooth scrolling for the whole page.
 *
 * Input:
 * - `children` (React.ReactNode). Must be rendered inside a Router.
 *
 * Side effects:
 * - While motion is allowed: one Lenis instance driven by the GSAP ticker, synced with ScrollTrigger.
 * - On every pathname change: scrolls to the top instantly.
 *
 * Output:
 * - `children` unchanged.
 */
const SmoothScroll = ({ children }) => {
  const motionAllowed = useMotionAllowed();
  const lenisRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!motionAllowed) return undefined;

    const lenis = new Lenis({ autoRaf: false });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [motionAllowed]);

  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return children;
};

export default SmoothScroll;
```

- [ ] **Step 4: Run the test**

Run: `npm test -- src/motion/SmoothScroll`
Expected: PASS (6 tests).

- [ ] **Step 5: Wire it into `land_site/src/main.jsx`**

Add `import SmoothScroll from './motion/SmoothScroll.jsx'` and change the router block to:

```jsx
        <BrowserRouter>
          <SmoothScroll>
            <App />
          </SmoothScroll>
        </BrowserRouter>
```

- [ ] **Step 6: Verify and commit**

Run: `npm run lint && npm test && npm run build`, then `npm run dev`: scrolling is smooth; turning on "reduce motion" in the accessibility widget makes scrolling native again immediately; clicking nav links lands at the top of the new page.

```bash
git add src/motion/SmoothScroll.jsx src/motion/SmoothScroll.test.jsx src/main.jsx
git commit -m "feat: Lenis smooth scroll gated by reduced motion"
```

### Task 7: `RevealText`

**Files:**
- Create: `land_site/src/motion/RevealText.jsx`
- Modify: `land_site/src/pages/Home.jsx` (hero `<h1>` → `<RevealText as="h1">`)
- Test: `land_site/src/motion/RevealText.test.jsx`

**Interfaces:**
- Consumes: `useMotionAllowed()`, `{ gsap, SplitText, useGSAP }` from `./gsap`.
- Produces: `<RevealText as?: string = 'div', className?: string>{children}</RevealText>` — lines slide up from a mask when scrolled into view (once); re-splits on resize, font load and when `children` change.

- [ ] **Step 1: Write the failing test `land_site/src/motion/RevealText.test.jsx`**

```jsx
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import RevealText from './RevealText'
import { gsap, SplitText } from './gsap'
import { mockMatchMedia } from '../test/matchMedia'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('./gsap', () => import('../test/gsapMock'))

describe('RevealText', () => {
  it('renders the requested tag with its text', () => {
    renderWithProviders(<RevealText as="h1" className="display">Hello</RevealText>)
    const heading = screen.getByRole('heading', { level: 1, name: 'Hello' })
    expect(heading).toHaveClass('display')
  })

  it('splits into masked lines and animates them when motion is allowed', () => {
    renderWithProviders(<RevealText as="h2">Hello</RevealText>)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(SplitText.create).toHaveBeenCalledWith(
      heading,
      expect.objectContaining({ type: 'lines', mask: 'lines', autoSplit: true })
    )
    expect(gsap.from).toHaveBeenCalledWith([heading], expect.objectContaining({ yPercent: 110 }))
  })

  it('does not split or animate with reduced motion', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true })
    renderWithProviders(<RevealText>Hello</RevealText>)
    expect(screen.getByText('Hello')).toBeVisible()
    expect(SplitText.create).not.toHaveBeenCalled()
  })

  it('re-splits when children change (language switch)', () => {
    const { rerender } = renderWithProviders(<RevealText>Hello</RevealText>)
    rerender(<RevealText>Привет</RevealText>)
    expect(SplitText.create).toHaveBeenCalledTimes(2)
    expect(screen.getByText('Привет')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npm test -- src/motion/RevealText`
Expected: FAIL — cannot resolve `./RevealText`.

- [ ] **Step 3: Create `land_site/src/motion/RevealText.jsx`**

```jsx
import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from './gsap';
import useMotionAllowed from './useMotionAllowed';

/**
 * Text that reveals line by line when scrolled into view.
 *
 * Input:
 * - `as` (string): element tag, default `div`.
 * - `className` (string, optional).
 * - `children` (React.ReactNode): the text.
 *
 * Output:
 * - The element; with motion allowed, its lines slide up from a mask once on enter.
 *   With reduced motion, plain static text.
 */
const RevealText = ({ as: Tag = 'div', className, children }) => {
  const ref = useRef(null);
  const motionAllowed = useMotionAllowed();

  useGSAP(
    () => {
      if (!motionAllowed) return;
      SplitText.create(ref.current, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.08,
            scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
          }),
      });
    },
    { scope: ref, dependencies: [motionAllowed, children], revertOnUpdate: true }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
};

export default RevealText;
```

- [ ] **Step 4: Run the test**

Run: `npm test -- src/motion/RevealText`
Expected: PASS (4 tests).

- [ ] **Step 5: Use it on the Home hero** — in `land_site/src/pages/Home.jsx` add `import RevealText from '../motion/RevealText'` and replace the `<h1>…</h1>` element with:

```jsx
            <RevealText as="h1">
              {t('home.titleStart')}
              <span className="home-title-accent">{t('home.titleAccent')}</span>
              {t('home.titleEnd')}
            </RevealText>
```

- [ ] **Step 6: Verify and commit**

Run: `npm run lint && npm test && npm run build`, then `npm run dev`: the Home headline slides up line by line; switching EN → HE re-renders the Hebrew headline correctly (no doubled or missing words); with "reduce motion" on it appears instantly.

```bash
git add src/motion/RevealText.jsx src/motion/RevealText.test.jsx src/pages/Home.jsx
git commit -m "feat: RevealText line-by-line heading reveal"
```

### Task 8: `Magnetic`

**Files:**
- Create: `land_site/src/motion/Magnetic.jsx`
- Create: `land_site/src/motion/motion.css`
- Modify: `land_site/src/pages/Home.jsx` (wrap the primary hero CTA)
- Test: `land_site/src/motion/Magnetic.test.jsx`

**Interfaces:**
- Consumes: `useMotionAllowed()`, `{ gsap, useGSAP }` from `./gsap`.
- Produces: `<Magnetic strength?: number = 0.35>{children}</Magnetic>` — renders `<span class="magnetic">`; on a fine pointer with motion allowed, the span follows the mouse by `(pointer − centre) × strength` and springs back on leave. `src/motion/motion.css` holds the styles for all motion components.

- [ ] **Step 1: Write the failing test `land_site/src/motion/Magnetic.test.jsx`**

```jsx
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import Magnetic from './Magnetic'
import { gsap } from './gsap'
import { mockMatchMedia } from '../test/matchMedia'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('./gsap', () => import('../test/gsapMock'))

const FINE = '(pointer: fine)'

const renderMagnetic = () => {
  renderWithProviders(
    <Magnetic>
      <a href="/contact">Start</a>
    </Magnetic>
  )
  const wrapper = screen.getByText('Start').parentElement
  wrapper.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 40 })
  return wrapper
}

describe('Magnetic', () => {
  it('wraps its child in a magnetic span', () => {
    const wrapper = renderMagnetic()
    expect(wrapper).toHaveClass('magnetic')
    expect(screen.getByRole('link', { name: 'Start' })).toBeInTheDocument()
  })

  it('moves toward the pointer and springs back on leave', () => {
    mockMatchMedia({ [FINE]: true })
    const wrapper = renderMagnetic()
    const [xTo, yTo] = gsap.quickTo.mock.results.map((r) => r.value)

    fireEvent.mouseMove(wrapper, { clientX: 150, clientY: 30 })
    expect(xTo).toHaveBeenLastCalledWith(35)
    expect(yTo).toHaveBeenLastCalledWith(3.5)

    fireEvent.mouseLeave(wrapper)
    expect(xTo).toHaveBeenLastCalledWith(0)
    expect(yTo).toHaveBeenLastCalledWith(0)
  })

  it('does nothing on a coarse pointer', () => {
    mockMatchMedia({ [FINE]: false })
    renderMagnetic()
    expect(gsap.quickTo).not.toHaveBeenCalled()
  })

  it('does nothing with reduced motion', () => {
    mockMatchMedia({ [FINE]: true, '(prefers-reduced-motion: reduce)': true })
    renderMagnetic()
    expect(gsap.quickTo).not.toHaveBeenCalled()
  })
})
```

(Arithmetic: centre = (50, 20); x = (150 − 50) × 0.35 = 35; y = (30 − 20) × 0.35 = 3.5.)

- [ ] **Step 2: Run it to see it fail**

Run: `npm test -- src/motion/Magnetic`
Expected: FAIL — cannot resolve `./Magnetic`.

- [ ] **Step 3: Create `land_site/src/motion/motion.css`**

```css
.magnetic {
  display: inline-block;
  will-change: transform;
}
```

- [ ] **Step 4: Create `land_site/src/motion/Magnetic.jsx`**

```jsx
import { useRef } from 'react';
import { gsap, useGSAP } from './gsap';
import useMotionAllowed from './useMotionAllowed';
import './motion.css';

const SPRING = { duration: 0.6, ease: 'elastic.out(1, 0.4)' };

/**
 * Pulls its content toward the mouse pointer.
 *
 * Input:
 * - `strength` (number): fraction of the pointer offset to follow, default 0.35.
 * - `children` (React.ReactNode).
 *
 * Output:
 * - `<span class="magnetic">`. Active only with a fine pointer and motion allowed.
 */
const Magnetic = ({ strength = 0.35, children }) => {
  const ref = useRef(null);
  const motionAllowed = useMotionAllowed();

  useGSAP(
    () => {
      const el = ref.current;
      if (!motionAllowed || !window.matchMedia?.('(pointer: fine)').matches) return undefined;

      const xTo = gsap.quickTo(el, 'x', SPRING);
      const yTo = gsap.quickTo(el, 'y', SPRING);

      const onMove = (event) => {
        const rect = el.getBoundingClientRect();
        xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
        yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    },
    { scope: ref, dependencies: [motionAllowed, strength], revertOnUpdate: true }
  );

  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  );
};

export default Magnetic;
```

- [ ] **Step 5: Run the test**

Run: `npm test -- src/motion/Magnetic`
Expected: PASS (4 tests).

- [ ] **Step 6: Use it on the Home primary CTA** — in `land_site/src/pages/Home.jsx` add `import Magnetic from '../motion/Magnetic'` and wrap the first hero button:

```jsx
              <Magnetic>
                <Link className="btn primary" to="/works">
                  {t('home.ctaWorks')}
                </Link>
              </Magnetic>
```

- [ ] **Step 7: Verify and commit**

Run: `npm run lint && npm test && npm run build`, then `npm run dev`: with a mouse, the "View works" button follows the cursor and springs back; in the browser's device toolbar (touch emulation) it stays still.

```bash
git add src/motion/Magnetic.jsx src/motion/Magnetic.test.jsx src/motion/motion.css src/pages/Home.jsx
git commit -m "feat: Magnetic hover effect"
```

### Task 9: `Marquee`

**Files:**
- Create: `land_site/src/motion/Marquee.jsx`
- Modify: `land_site/src/motion/motion.css` (append marquee styles)
- Test: `land_site/src/motion/Marquee.test.jsx`

**Interfaces:**
- Consumes: `useMotionAllowed()`, `useI18n().dir`, `{ gsap, ScrollTrigger, useGSAP }` from `./gsap`.
- Produces: `<Marquee duration?: number = 30, className?: string>{children}</Marquee>` — infinite horizontal loop of two copies of `children` (second copy `aria-hidden`); moves left in LTR, right in RTL (`data-direction="left" | "right"`); scrolling speeds it up and scrolling up reverses it. Used by the Home hero in Plan 2.

- [ ] **Step 1: Write the failing test `land_site/src/motion/Marquee.test.jsx`**

```jsx
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import Marquee from './Marquee'
import { gsap, ScrollTrigger } from './gsap'
import { mockMatchMedia } from '../test/matchMedia'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('./gsap', () => import('../test/gsapMock'))

const renderMarquee = () => renderWithProviders(<Marquee>Blue Cat — Web Studio —</Marquee>)
const track = () => document.querySelector('.marquee-track')

describe('Marquee', () => {
  it('renders two copies, hiding the second from screen readers', () => {
    renderMarquee()
    const copies = screen.getAllByText('Blue Cat — Web Studio —')
    expect(copies).toHaveLength(2)
    expect(copies[0]).not.toHaveAttribute('aria-hidden')
    expect(copies[1]).toHaveAttribute('aria-hidden', 'true')
  })

  it('moves left in LTR', () => {
    renderMarquee()
    expect(document.querySelector('.marquee')).toHaveAttribute('data-direction', 'left')
    expect(gsap.fromTo).toHaveBeenCalledWith(
      track(),
      { xPercent: 0 },
      expect.objectContaining({ xPercent: -50, repeat: -1, ease: 'none' })
    )
  })

  it('moves right in RTL', () => {
    localStorage.setItem('bc_lang', 'he')
    renderMarquee()
    expect(document.querySelector('.marquee')).toHaveAttribute('data-direction', 'right')
    expect(gsap.fromTo).toHaveBeenCalledWith(
      track(),
      { xPercent: -50 },
      expect.objectContaining({ xPercent: 0 })
    )
  })

  it('reacts to scroll velocity', () => {
    renderMarquee()
    expect(ScrollTrigger.create).toHaveBeenCalledWith(
      expect.objectContaining({ onUpdate: expect.any(Function) })
    )
  })

  it('stays still with reduced motion', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true })
    renderMarquee()
    expect(gsap.fromTo).not.toHaveBeenCalled()
    expect(ScrollTrigger.create).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npm test -- src/motion/Marquee`
Expected: FAIL — cannot resolve `./Marquee`.

- [ ] **Step 3: Append to `land_site/src/motion/motion.css`**

```css
.marquee {
  overflow: hidden;
  white-space: nowrap;
}

.marquee-track {
  display: flex;
  width: max-content;
  will-change: transform;
}

.marquee-item {
  flex: none;
  padding-inline-end: 0.5em;
}
```

- [ ] **Step 4: Create `land_site/src/motion/Marquee.jsx`**

```jsx
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from './gsap';
import useMotionAllowed from './useMotionAllowed';
import useI18n from '../i18n/useI18n';
import './motion.css';

/**
 * Infinite horizontal text loop that reacts to scroll speed and direction.
 *
 * Input:
 * - `duration` (number): seconds for one full loop at rest, default 30.
 * - `className` (string, optional).
 * - `children` (React.ReactNode): content of one loop segment.
 *
 * Output:
 * - Two copies of `children` (second `aria-hidden`). Moves left in LTR, right in RTL;
 *   static with reduced motion.
 */
const Marquee = ({ duration = 30, className = '', children }) => {
  const ref = useRef(null);
  const motionAllowed = useMotionAllowed();
  const { dir } = useI18n();
  const isRtl = dir === 'rtl';

  useGSAP(
    () => {
      if (!motionAllowed) return;
      const track = ref.current.querySelector('.marquee-track');
      const loop = gsap.fromTo(
        track,
        { xPercent: isRtl ? -50 : 0 },
        { xPercent: isRtl ? 0 : -50, duration, ease: 'none', repeat: -1 }
      );

      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(1, 4, 1 + Math.abs(self.getVelocity()) / 400);
          loop.timeScale(self.direction * boost);
          gsap.to(loop, { timeScale: self.direction, duration: 0.8, overwrite: true });
        },
      });
    },
    { scope: ref, dependencies: [motionAllowed, isRtl, duration], revertOnUpdate: true }
  );

  return (
    <div
      ref={ref}
      className={`marquee ${className}`.trim()}
      dir="ltr"
      data-direction={isRtl ? 'right' : 'left'}
    >
      <div className="marquee-track">
        <div className="marquee-item">{children}</div>
        <div className="marquee-item" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
```

(The outer element is forced to `dir="ltr"` so the two copies always sit left-to-right; direction of travel is controlled by the tween. Hebrew text inside still renders RTL because the Unicode bidi algorithm applies within each copy.)

- [ ] **Step 5: Run the test**

Run: `npm test -- src/motion/Marquee`
Expected: PASS (5 tests).

- [ ] **Step 6: Verify, commit, push PR 3**

Run: `npm run lint && npm test && npm run build`. For a manual check, temporarily render `<Marquee className="display">Blue Cat — Web Studio —</Marquee>` at the top of `Home.jsx`, confirm it loops seamlessly left (EN) and right (HE), speeds up on fast scroll and reverses on scroll up, then **remove** the temporary line (the real placement is Plan 2's Home redesign).

```bash
git add src/motion/Marquee.jsx src/motion/Marquee.test.jsx src/motion/motion.css
git commit -m "feat: scroll-reactive, RTL-aware Marquee"
git push -u origin feat/motion-foundation
gh pr create --base feat/visual-foundation --title "Motion foundation: smooth scroll, reveal, magnetic, marquee" --body "PR 3/3 of the motion redesign foundation (stacked on feat/visual-foundation). Adds GSAP + Lenis, useMotionAllowed (OS + a11y widget), SmoothScroll, RevealText, Magnetic, Marquee; uses RevealText/Magnetic on the current Home hero. Marquee is placed in Plan 2 (Home redesign)."
```

### Task 10: Hand-off

- [ ] **Step 1:** Report the three PR URLs to the owner, with the merge order (PR 1 → PR 2 → PR 3) and a reminder that each merge to `main` deploys to bluecat.cc.
- [ ] **Step 2:** Ask the owner for their display name in EN/RU/HE (needed for Plan 2 copy) and to add `public/owner.jpg` whenever ready.
