# Motion Redesign — Pages (Plan 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild every page of bluecat.cc on the motion foundation from Plan 1 — Home, contact footer, hover-preview project lists, curtain page transitions, collapsing nav, 404, Works, case study, Services, About, Contact — and move all copy to the owner's "I" voice in EN/RU/HE.

**Architecture:** New reusable units live in `src/motion/` (HoverPreviewList, PageTransition, TransitionLink) and `src/Components/` (ServiceRows, ContactFooter); pages in `src/pages/` are rewritten to compose them on the ink/paper section system. All GSAP work runs inside `useGSAP()`; every effect has a no-motion path driven by `useMotionAllowed()`. Copy lives only in `src/i18n/translations.js`, guarded by the parity test and a new voice test.

**Tech Stack:** React 19, react-router-dom 7, Vite (rolldown), GSAP 3.15 (+ScrollTrigger, SplitText, @gsap/react), Lenis, Vitest 5 + Testing Library + user-event, jsdom.

**Spec:** `docs/superpowers/specs/2026-09-28-motion-redesign-design.md` (sections 2–4, 6–8 items 4–7). Plan 1 (items 1–3) is merged: `docs/superpowers/plans/2026-09-28-motion-redesign-foundation.md`.

## Global Constraints

- Work in worktree `.worktrees/pages` on branch `feat/pages` (already created from `origin/main` at `5728803`). App root is `land_site/`; run every npm command there.
- Node `>=22.12` (package.json `engines`; CI uses Node 22).
- No new runtime or dev dependencies.
- Palette tokens from `src/pages/colors.css`: `--ink #141517`, `--paper #F4F3F0`, `--accent #3D5AFE`, `--cat-gold #F5A623` (only next to the mascot). Section classes `.section-ink` / `.section-paper` and `.display` (`clamp(3rem, 9vw, 10rem)`) from `src/App.css`.
- Sections alternate ink/paper while scrolling; the contact footer is ink, so the last section above it is paper.
- Every GSAP call runs inside `useGSAP()`. When `useMotionAllowed()` is `false`, components render their final state with no animation.
- Every effect works in RTL (Hebrew). Use logical CSS properties (`inset-inline-*`, `margin-inline-*`, `padding-inline-*`) except where physical coordinates are required (pointer-following preview), and say so in a comment.
- All user-facing text comes from `translations.js` in `en`, `ru`, `he`; the parity test (`src/i18n/translations.test.js`) must stay green. RU/HE copy is proofread by the owner before landing.
- Owner name: EN `Eugeny`, RU `Евгений`, HE `יבגני`. Photo: `public/owner.jpg` (already on main).
- Voice: first person singular ("I"/"я"/"אני", masculine in Hebrew) everywhere.
- Mocks: tests use `vi.mock('<path>/motion/gsap', () => import('<path>/test/gsapMock'))`. Any behaviour that depends on real GSAP semantics (lifecycles, onComplete, transforms) gets at least one test with real GSAP (`import '../test/realGsapEnv'` as the first line).
- Done per task: `npm run lint && npm test && npm run build` green in `land_site/`.
- Landing: the owner authorized the main agent to land on `main` without PRs. Land only at phase boundaries after a reviewer-vesemir pass: end of Task 4 (Home), Task 8 (transitions/nav/404), Task 10 (Works/case), Task 14 (Services/About/Contact/voice). Land with `git push origin HEAD:main` (fast-forward only; never force). Every push touching `land_site/**` deploys bluecat.cc.

## Review Focus

1. **Broken project thumbnail** (GitHub-hosted images fail): the row must stay a working text link; neither the card thumbnail nor the floating preview may show a broken image. → Task 1 tests "hides a card thumbnail that fails…" and "hides the floating preview when its image fails".
2. **Hebrew / RTL**: numbering, list order and pointer-following must not mirror wrongly. → Task 1 test "keeps physical pointer coordinates in RTL"; Task 2 test "keeps numbering order in Hebrew"; Task 4 test "speaks Hebrew".
3. **Reduced motion switched on mid-transition**: the curtain must never stay on screen. → Task 5 test "hides the curtain instead of animating it if motion is switched off mid-transition".
4. **Double click / link to the current page**: no duplicate curtain, no stuck curtain, no navigation. → Task 5 tests "ignores a second click…" and "does nothing for a link to the current page".
5. **Keyboard users**: focus moves to the new page's `<h1>` after every navigation; the full-screen menu returns focus to its button on Escape. → Task 5 tests (focus assertions); Task 7 test "closes on Escape and returns focus to the button".

---

## Phase A — Home (§8.4)

### Task 1: `HoverPreviewList`

**Files:**
- Create: `land_site/src/motion/HoverPreviewList.jsx`
- Modify: `land_site/src/motion/motion.css` (append)
- Test: `land_site/src/motion/HoverPreviewList.test.jsx`

**Interfaces:**
- Consumes: `useMotionAllowed()` (`src/motion/useMotionAllowed.js`), `{ gsap, useGSAP }` from `./gsap`.
- Produces: `<HoverPreviewList items className? />` where `items: Array<{ id: string, href: string, title: string, meta: string, image: string }>`. Renders `<ul class="hpl">` of `<li class="hpl-row">` → `<Link class="hpl-link">`. With fine pointer + motion: list gets `hpl--preview`, one fixed `.hpl-preview` follows the pointer and shows `.hpl-preview-img` of the hovered row. Otherwise each row shows an `.hpl-thumb` card image. Failed images are hidden. (Task 6 swaps `Link` for `TransitionLink`.)

- [ ] **Step 1: Write the failing test `land_site/src/motion/HoverPreviewList.test.jsx`**

```jsx
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import HoverPreviewList from './HoverPreviewList'
import { gsap } from './gsap'
import { mockMatchMedia } from '../test/matchMedia'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('./gsap', () => import('../test/gsapMock'))

const FINE = '(hover: hover) and (pointer: fine)'
const REDUCE = '(prefers-reduced-motion: reduce)'
const ITEMS = [
  { id: 'a', href: '/works/a', title: 'Alpha CRM', meta: 'System', image: '/a.jpg' },
  { id: 'b', href: '/works/b', title: 'Beta Site', meta: 'Landing', image: '/b.jpg' },
]
const thumbs = () => document.querySelectorAll('.hpl-thumb')
const preview = () => document.querySelector('.hpl-preview')
const previewImg = () => document.querySelector('.hpl-preview-img')

describe('HoverPreviewList', () => {
  it('renders one link per item with its href', () => {
    renderWithProviders(<HoverPreviewList items={ITEMS} />)
    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.getByRole('link', { name: /Alpha CRM/ })).toHaveAttribute('href', '/works/a')
    expect(screen.getByRole('link', { name: /Beta Site/ })).toHaveAttribute('href', '/works/b')
  })

  it('shows card thumbnails and no floating preview on a coarse pointer', () => {
    mockMatchMedia({ [FINE]: false })
    renderWithProviders(<HoverPreviewList items={ITEMS} />)
    expect(thumbs()).toHaveLength(2)
    expect(preview()).toBeNull()
    expect(gsap.quickTo).not.toHaveBeenCalled()
  })

  it('hides a card thumbnail that fails to load but keeps the link', () => {
    renderWithProviders(<HoverPreviewList items={ITEMS} />)
    fireEvent.error(thumbs()[0])
    expect(thumbs()).toHaveLength(1)
    expect(screen.getByRole('link', { name: /Alpha CRM/ })).toBeInTheDocument()
  })

  it('follows the pointer and swaps the image on row hover with a fine pointer', () => {
    mockMatchMedia({ [FINE]: true })
    renderWithProviders(<HoverPreviewList items={ITEMS} />)
    const [xTo, yTo] = gsap.quickTo.mock.results.map((r) => r.value)
    expect(thumbs()).toHaveLength(0)

    const rowB = screen.getByRole('link', { name: /Beta Site/ }).closest('li')
    fireEvent.mouseEnter(rowB)
    expect(previewImg()).toHaveAttribute('src', '/b.jpg')
    expect(preview()).toHaveClass('is-visible')

    fireEvent.mouseMove(rowB, { clientX: 120, clientY: 340 })
    expect(xTo).toHaveBeenLastCalledWith(120)
    expect(yTo).toHaveBeenLastCalledWith(340)

    fireEvent.mouseLeave(screen.getByRole('list'))
    expect(preview()).not.toHaveClass('is-visible')
  })

  it('keeps physical pointer coordinates in RTL', () => {
    localStorage.setItem('bc_lang', 'he')
    mockMatchMedia({ [FINE]: true })
    renderWithProviders(<HoverPreviewList items={ITEMS} />)
    const [xTo] = gsap.quickTo.mock.results.map((r) => r.value)
    fireEvent.mouseMove(screen.getByRole('list'), { clientX: 50, clientY: 10 })
    expect(xTo).toHaveBeenLastCalledWith(50)
  })

  it('hides the floating preview when its image fails', () => {
    mockMatchMedia({ [FINE]: true })
    renderWithProviders(<HoverPreviewList items={ITEMS} />)
    fireEvent.mouseEnter(screen.getByRole('link', { name: /Alpha CRM/ }).closest('li'))
    fireEvent.error(previewImg())
    expect(previewImg()).toBeNull()
    expect(preview()).not.toHaveClass('is-visible')
  })

  it('renders no floating preview with reduced motion', () => {
    mockMatchMedia({ [FINE]: true, [REDUCE]: true })
    renderWithProviders(<HoverPreviewList items={ITEMS} />)
    expect(preview()).toBeNull()
    expect(gsap.quickTo).not.toHaveBeenCalled()
    expect(thumbs()).toHaveLength(2)
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/motion/HoverPreviewList.test.jsx`
Expected: FAIL — `Failed to resolve import "./HoverPreviewList"`.

- [ ] **Step 3: Create `land_site/src/motion/HoverPreviewList.jsx`**

```jsx
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from './gsap';
import useMotionAllowed from './useMotionAllowed';
import './motion.css';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const FOLLOW = { duration: 0.5, ease: 'power3' };

/**
 * Accessible list of project links with a pointer-following image preview.
 *
 * Input:
 * - `items` ({ id, href, title, meta, image }[]): one row per item.
 * - `className` (string, optional).
 *
 * Output:
 * - A list of links. With a fine pointer and motion allowed, one floating image follows the
 *   pointer and shows the hovered row's image. Otherwise every row shows a card thumbnail.
 *   Images that fail to load are hidden; the row stays a working text link.
 */
const HoverPreviewList = ({ items, className = '' }) => {
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const previewRef = useRef(null);
  const motionAllowed = useMotionAllowed();
  const [finePointer] = useState(() => Boolean(window.matchMedia?.(FINE_POINTER).matches));
  const [activeId, setActiveId] = useState(null);
  const [failed, setFailed] = useState(() => new Set());
  const previewEnabled = motionAllowed && finePointer;

  const markFailed = (id) => setFailed((prev) => new Set(prev).add(id));

  useGSAP(
    () => {
      if (!previewEnabled) return undefined;
      const xTo = gsap.quickTo(previewRef.current, 'x', FOLLOW);
      const yTo = gsap.quickTo(previewRef.current, 'y', FOLLOW);
      const list = listRef.current;
      const onMove = (event) => {
        xTo(event.clientX);
        yTo(event.clientY);
      };
      list.addEventListener('mousemove', onMove);
      return () => list.removeEventListener('mousemove', onMove);
    },
    { scope: rootRef, dependencies: [previewEnabled], revertOnUpdate: true }
  );

  const activeItem = items.find((item) => item.id === activeId);
  const showPreview = Boolean(previewEnabled && activeItem && !failed.has(activeItem.id));

  return (
    <div ref={rootRef} className="hpl-root">
      <ul
        ref={listRef}
        className={`hpl ${previewEnabled ? 'hpl--preview' : ''} ${className}`.replace(/\s+/g, ' ').trim()}
        onMouseLeave={() => setActiveId(null)}
      >
        {items.map((item) => (
          <li key={item.id} className="hpl-row" onMouseEnter={() => setActiveId(item.id)}>
            <Link className="hpl-link" to={item.href}>
              {!previewEnabled && !failed.has(item.id) && (
                <img
                  className="hpl-thumb"
                  src={item.image}
                  alt=""
                  loading="lazy"
                  onError={() => markFailed(item.id)}
                />
              )}
              <span className="hpl-title">{item.title}</span>
              <span className="hpl-meta">{item.meta}</span>
            </Link>
          </li>
        ))}
      </ul>
      {previewEnabled && (
        <div ref={previewRef} className={`hpl-preview ${showPreview ? 'is-visible' : ''}`.trim()} aria-hidden="true">
          {showPreview && (
            <img
              className="hpl-preview-img"
              src={activeItem.image}
              alt=""
              onError={() => markFailed(activeItem.id)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default HoverPreviewList;
```

- [ ] **Step 4: Append to `land_site/src/motion/motion.css`**

```css

/* ── HoverPreviewList ── */
.hpl {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid color-mix(in srgb, currentColor 20%, transparent);
}

.hpl-row {
  border-bottom: 1px solid color-mix(in srgb, currentColor 20%, transparent);
}

.hpl-link {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: baseline;
  gap: 0.75rem 2rem;
  padding-block: clamp(1.25rem, 3vw, 2.5rem);
  color: inherit;
  text-decoration: none;
  transition: opacity 0.25s ease, padding-inline-start 0.3s ease;
}

.hpl-title {
  font-size: clamp(1.75rem, 5vw, 4.5rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1;
}

.hpl-meta {
  font-size: 0.95rem;
  opacity: 0.7;
}

.hpl--preview:hover .hpl-link {
  opacity: 0.35;
}

.hpl--preview .hpl-link:hover,
.hpl-link:focus-visible {
  opacity: 1;
  padding-inline-start: 1rem;
}

.hpl-link:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 4px;
}

.hpl-thumb {
  grid-column: 1 / -1;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border-radius: 12px;
}

/* Physical left/top on purpose: GSAP moves it to the pointer's clientX/clientY in any direction. */
.hpl-preview {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.hpl-preview.is-visible {
  opacity: 1;
}

.hpl-preview-img {
  display: block;
  width: clamp(240px, 24vw, 380px);
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 12px;
  transform: translate(-50%, -50%);
}
```

- [ ] **Step 5: Run the test**

Run: `npx vitest run src/motion/HoverPreviewList.test.jsx`
Expected: PASS (7 tests).

- [ ] **Step 6: Verify and commit**

Run: `npm run lint && npm test && npm run build`

```bash
git add src/motion/HoverPreviewList.jsx src/motion/HoverPreviewList.test.jsx src/motion/motion.css
git commit -m "feat: HoverPreviewList with pointer-following preview"
```

### Task 2: `ServiceRows`

**Files:**
- Create: `land_site/src/Components/ServiceRows/ServiceRows.comp.jsx`
- Create: `land_site/src/Components/ServiceRows/ServiceRows.comp.css`
- Test: `land_site/src/Components/ServiceRows/ServiceRows.comp.test.jsx`

**Interfaces:**
- Consumes: `useI18n()` → `{ t }`; keys `services.s1…s5.{title,desc}`.
- Produces: `<ServiceRows withLinks? />` — `<ol class="service-rows">` with five `<li class="service-rows-item">`, each holding `.service-rows-num` ("01"…"05", `aria-hidden`), `.service-rows-title`, `.service-rows-desc`. With `withLinks` each row is a link to `/services`. Exports `SERVICE_KEYS`. (Task 6 swaps `Link` for `TransitionLink`.)

- [ ] **Step 1: Write the failing test `land_site/src/Components/ServiceRows/ServiceRows.comp.test.jsx`**

```jsx
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import ServiceRows from './ServiceRows.comp'
import { translations } from '../../i18n/translations'
import { renderWithProviders } from '../../test/renderWithProviders'

const numbers = (items) => items.map((li) => li.querySelector('.service-rows-num').textContent)

describe('ServiceRows', () => {
  it('lists the five service levels numbered 01–05 without links by default', () => {
    renderWithProviders(<ServiceRows />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(5)
    expect(numbers(items)).toEqual(['01', '02', '03', '04', '05'])
    expect(items[0]).toHaveTextContent(translations.en.services.s1.title)
    expect(items[4]).toHaveTextContent(translations.en.services.s5.desc)
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })

  it('links every row to /services when asked', () => {
    renderWithProviders(<ServiceRows withLinks />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(5)
    links.forEach((link) => expect(link).toHaveAttribute('href', '/services'))
  })

  it('keeps numbering order in Hebrew', () => {
    localStorage.setItem('bc_lang', 'he')
    renderWithProviders(<ServiceRows />)
    const items = screen.getAllByRole('listitem')
    expect(numbers(items)).toEqual(['01', '02', '03', '04', '05'])
    expect(items[4]).toHaveTextContent(translations.he.services.s5.title)
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/Components/ServiceRows`
Expected: FAIL — `Failed to resolve import "./ServiceRows.comp"`.

- [ ] **Step 3: Create `land_site/src/Components/ServiceRows/ServiceRows.comp.jsx`**

```jsx
import { Link } from 'react-router-dom';
import useI18n from '../../i18n/useI18n';
import './ServiceRows.comp.css';

export const SERVICE_KEYS = ['s1', 's2', 's3', 's4', 's5'];

/**
 * The five service levels as big numbered rows.
 *
 * Input:
 * - `withLinks` (boolean, optional): each row links to `/services`. Default `false`.
 *
 * Output:
 * - Ordered list of rows: two-digit number, title, description.
 */
const ServiceRows = ({ withLinks = false }) => {
  const { t } = useI18n();

  return (
    <ol className="service-rows">
      {SERVICE_KEYS.map((key, index) => {
        const body = (
          <>
            <span className="service-rows-num" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="service-rows-text">
              <span className="service-rows-title">{t(`services.${key}.title`)}</span>
              <span className="service-rows-desc">{t(`services.${key}.desc`)}</span>
            </span>
          </>
        );
        return (
          <li key={key} className="service-rows-item">
            {withLinks ? (
              <Link className="service-rows-row" to="/services">
                {body}
              </Link>
            ) : (
              <div className="service-rows-row">{body}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default ServiceRows;
```

- [ ] **Step 4: Create `land_site/src/Components/ServiceRows/ServiceRows.comp.css`**

```css
.service-rows {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid color-mix(in srgb, currentColor 20%, transparent);
}

.service-rows-item {
  border-bottom: 1px solid color-mix(in srgb, currentColor 20%, transparent);
}

.service-rows-row {
  display: grid;
  grid-template-columns: clamp(3rem, 8vw, 7rem) 1fr;
  gap: 1rem 2rem;
  align-items: baseline;
  padding-block: clamp(1.25rem, 3vw, 2.25rem);
  color: inherit;
  text-decoration: none;
}

a.service-rows-row {
  transition: padding-inline-start 0.3s ease;
}

a.service-rows-row:hover,
a.service-rows-row:focus-visible {
  padding-inline-start: 1rem;
}

a.service-rows-row:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 4px;
}

.service-rows-num {
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-variant-numeric: tabular-nums;
  opacity: 0.5;
}

.service-rows-text {
  display: grid;
  gap: 0.5rem;
}

.service-rows-title {
  font-size: clamp(1.5rem, 4vw, 3.25rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.service-rows-desc {
  max-width: 60ch;
  opacity: 0.75;
  line-height: 1.6;
}
```

- [ ] **Step 5: Run the test**

Run: `npx vitest run src/Components/ServiceRows`
Expected: PASS (3 tests).

- [ ] **Step 6: Verify and commit**

Run: `npm run lint && npm test && npm run build`

```bash
git add src/Components/ServiceRows
git commit -m "feat: ServiceRows numbered service list"
```

### Task 3: `ContactFooter` (replaces `Footer`) and `OWNER_NAME`

**Files:**
- Modify: `land_site/src/config/owner.js` (add `OWNER_NAME`)
- Test: `land_site/src/config/owner.test.js`
- Create: `land_site/src/Components/ContactFooter/ContactFooter.comp.jsx`
- Create: `land_site/src/Components/ContactFooter/ContactFooter.comp.css`
- Test: `land_site/src/Components/ContactFooter/ContactFooter.comp.test.jsx`
- Modify: `land_site/src/App.jsx` (use `ContactFooter`)
- Modify: `land_site/src/App.css` (add `.btn-round`)
- Modify: `land_site/src/i18n/translations.js` (add `footer` in en/ru/he)
- Delete: `land_site/src/Components/Footer/Footer.comp.jsx`, `land_site/src/Components/Footer/Footer.comp.css`
- Test: `land_site/src/App.test.jsx`

**Interfaces:**
- Consumes: `OwnerPhoto` (`src/Components/OwnerPhoto/OwnerPhoto.comp.jsx`, props `alt`, `className`), `Magnetic` (`src/motion/Magnetic.jsx`), `CONTACT_EMAIL`, `WHATSAPP_URL` (`src/config/contact.js`), `MASCOT_IMAGE` (`src/config/owner.js`).
- Produces: `OWNER_NAME: { en: string, ru: string, he: string }` from `src/config/owner.js`; `<ContactFooter />` (`<footer class="contact-footer section-ink">`); global `.btn-round` class; i18n keys `footer.title`, `footer.lead`, `footer.cta`, `footer.whatsapp`. (Task 6 swaps `Link` for `TransitionLink`.)

- [ ] **Step 1: Write the failing tests**

`land_site/src/config/owner.test.js`:

```js
import { describe, expect, it } from 'vitest'
import { SUPPORTED_LANGUAGES } from '../i18n/translations'
import { OWNER_NAME } from './owner'

describe('OWNER_NAME', () => {
  it.each(SUPPORTED_LANGUAGES.map((l) => l.code))('has a name for %s', (code) => {
    expect(OWNER_NAME[code]).toMatch(/\S/)
  })

  it('uses the owner-approved spellings', () => {
    expect(OWNER_NAME).toEqual({ en: 'Eugeny', ru: 'Евгений', he: 'יבגני' })
  })
})
```

`land_site/src/Components/ContactFooter/ContactFooter.comp.test.jsx`:

```jsx
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import ContactFooter from './ContactFooter.comp'
import { renderWithProviders } from '../../test/renderWithProviders'

vi.mock('../../motion/gsap', () => import('../../test/gsapMock'))
vi.mock('../../config/contact', () => ({
  CONTACT_EMAIL: 'hello@example.com',
  WHATSAPP_URL: 'https://wa.me/972500000000',
}))

describe('ContactFooter', () => {
  it('invites to work together and links to the contact page', () => {
    renderWithProviders(<ContactFooter />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: "Let's work together" })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Write to me' })).toHaveAttribute('href', '/contact')
  })

  it('shows email and WhatsApp when configured', () => {
    renderWithProviders(<ContactFooter />)
    expect(screen.getByRole('link', { name: 'hello@example.com' })).toHaveAttribute(
      'href',
      'mailto:hello@example.com'
    )
    const whatsapp = screen.getByRole('link', { name: 'WhatsApp' })
    expect(whatsapp).toHaveAttribute('href', 'https://wa.me/972500000000')
    expect(whatsapp).toHaveAttribute('target', '_blank')
    expect(whatsapp.getAttribute('rel')).toContain('noreferrer')
  })

  it('names the owner in the photo alt per language', () => {
    localStorage.setItem('bc_lang', 'he')
    renderWithProviders(<ContactFooter />)
    expect(screen.getByRole('img', { name: 'יבגני' })).toHaveClass('owner-photo')
  })
})
```

`land_site/src/App.test.jsx`:

```jsx
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import App from './App'
import { renderWithProviders } from './test/renderWithProviders'

vi.mock('./motion/gsap', () => import('./test/gsapMock'))

describe('App layout', () => {
  it('shows the contact footer on regular pages', () => {
    renderWithProviders(<App />, { route: '/' })
    expect(screen.getByRole('heading', { level: 2, name: "Let's work together" })).toBeInTheDocument()
  })

  it('hides the contact footer on /contact', () => {
    renderWithProviders(<App />, { route: '/contact' })
    expect(screen.queryByRole('heading', { name: "Let's work together" })).toBeNull()
  })
})
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/config/owner.test.js src/Components/ContactFooter src/App.test.jsx`
Expected: FAIL — `OWNER_NAME` undefined; `./ContactFooter.comp` unresolved; App shows no "Let's work together".

- [ ] **Step 3: Add `OWNER_NAME` to `land_site/src/config/owner.js`** (append after `MASCOT_IMAGE`)

```js

/**
 * Owner's display name per language (owner-approved spellings).
 */
export const OWNER_NAME = {
  en: 'Eugeny',
  ru: 'Евгений',
  he: 'יבגני',
};
```

- [ ] **Step 4: Add the `footer` dictionaries to `land_site/src/i18n/translations.js`**

In `en`, after the `finalCta: { … },` block add:

```js
    footer: {
      title: "Let's work together",
      lead: 'Tell me about your project and I’ll get back to you.',
      cta: 'Write to me',
      whatsapp: 'WhatsApp',
    },
```

In `ru`, after its `finalCta` block:

```js
    footer: {
      title: 'Давайте работать вместе',
      lead: 'Расскажите о проекте — я отвечу.',
      cta: 'Написать мне',
      whatsapp: 'WhatsApp',
    },
```

In `he`, after its `finalCta` block:

```js
    footer: {
      title: 'בואו נעבוד יחד',
      lead: 'ספרו לי על הפרויקט ואחזור אליכם.',
      cta: 'כתבו לי',
      whatsapp: 'WhatsApp',
    },
```

- [ ] **Step 5: Add `.btn-round` to the end of `land_site/src/App.css`**

```css

/* ── Round call-to-action (used with Magnetic) ── */
.btn-round {
  display: inline-grid;
  place-items: center;
  width: clamp(8rem, 14vw, 11rem);
  aspect-ratio: 1;
  padding: 1rem;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  line-height: 1.2;
}

.btn-round:focus-visible {
  outline: 3px solid currentColor;
  outline-offset: 6px;
}
```

- [ ] **Step 6: Create `land_site/src/Components/ContactFooter/ContactFooter.comp.jsx`**

```jsx
import { Link } from 'react-router-dom';
import { CONTACT_EMAIL, WHATSAPP_URL } from '../../config/contact';
import { MASCOT_IMAGE, OWNER_NAME } from '../../config/owner';
import useI18n from '../../i18n/useI18n';
import Magnetic from '../../motion/Magnetic';
import OwnerPhoto from '../OwnerPhoto/OwnerPhoto.comp';
import './ContactFooter.comp.css';

/**
 * Big contact footer shown at the bottom of every page except `/contact`.
 *
 * Output:
 * - Owner photo, "Let's work together" heading, lead line, magnetic round button to `/contact`,
 *   email and WhatsApp links when configured, copyright line and a waving mascot.
 */
const ContactFooter = () => {
  const { t, lang } = useI18n();
  const name = OWNER_NAME[lang];
  const year = new Date().getFullYear();

  return (
    <footer className="contact-footer section-ink">
      <div className="page-content contact-footer-inner">
        <div className="contact-footer-head">
          <OwnerPhoto alt={name} className="contact-footer-photo" />
          <h2 className="display contact-footer-title">{t('footer.title')}</h2>
        </div>
        <p className="contact-footer-lead">{t('footer.lead')}</p>
        <div className="contact-footer-actions">
          <Magnetic>
            <Link className="btn-round" to="/contact">
              {t('footer.cta')}
            </Link>
          </Magnetic>
          <ul className="contact-footer-links">
            {CONTACT_EMAIL && (
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
            )}
            {WHATSAPP_URL && (
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  {t('footer.whatsapp')}
                </a>
              </li>
            )}
          </ul>
        </div>
        <p className="contact-footer-bottom">
          © {year} Blue Cat · {name}
        </p>
      </div>
      <img className="contact-footer-cat" src={MASCOT_IMAGE} alt="" aria-hidden="true" />
    </footer>
  );
};

export default ContactFooter;
```

- [ ] **Step 7: Create `land_site/src/Components/ContactFooter/ContactFooter.comp.css`**

```css
.contact-footer {
  position: relative;
  overflow: hidden;
  padding-block: clamp(4rem, 10vw, 8rem) 2rem;
}

.contact-footer-inner {
  display: grid;
  gap: clamp(1.5rem, 4vw, 3rem);
}

.contact-footer-head {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 3vw, 2.5rem);
  flex-wrap: wrap;
}

.contact-footer-photo {
  width: clamp(4.5rem, 9vw, 7rem);
  height: clamp(4.5rem, 9vw, 7rem);
}

.contact-footer-title {
  margin: 0;
  font-size: clamp(2.5rem, 7vw, 7rem);
}

.contact-footer-lead {
  max-width: 50ch;
  margin: 0;
  font-size: 1.15rem;
  opacity: 0.8;
}

.contact-footer-actions {
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 5vw, 4rem);
  flex-wrap: wrap;
}

.contact-footer-links {
  display: grid;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: clamp(1.1rem, 2vw, 1.5rem);
}

.contact-footer-links a {
  color: inherit;
  text-underline-offset: 0.25em;
}

.contact-footer-bottom {
  margin: clamp(2rem, 6vw, 4rem) 0 0;
  padding-top: 1.5rem;
  border-top: 1px solid color-mix(in srgb, currentColor 20%, transparent);
  font-size: 0.9rem;
  opacity: 0.6;
}

.contact-footer-cat {
  position: absolute;
  inset-block-end: 1.5rem;
  inset-inline-end: 1.5rem;
  width: clamp(56px, 7vw, 96px);
  height: auto;
  transform-origin: 70% 90%;
  animation: cat-wave 2.4s ease-in-out infinite;
}

@keyframes cat-wave {
  0%, 60%, 100% { transform: rotate(0deg); }
  70% { transform: rotate(-12deg); }
  80% { transform: rotate(10deg); }
  90% { transform: rotate(-6deg); }
}

@media (prefers-reduced-motion: reduce) {
  .contact-footer-cat {
    animation: none;
  }
}
```

- [ ] **Step 8: Use it in `land_site/src/App.jsx`**

Replace `import Footer from './Components/Footer/Footer.comp'` with `import ContactFooter from './Components/ContactFooter/ContactFooter.comp'`, and `{!isContactRoute && <Footer />}` with `{!isContactRoute && <ContactFooter />}`. Update the JSDoc line "Conditionally renders `Footer`" to "Conditionally renders `ContactFooter`".

- [ ] **Step 9: Delete the old footer**

```bash
git rm src/Components/Footer/Footer.comp.jsx src/Components/Footer/Footer.comp.css
```

- [ ] **Step 10: Run the tests**

Run: `npx vitest run src/config/owner.test.js src/Components/ContactFooter src/App.test.jsx src/i18n`
Expected: PASS.

- [ ] **Step 11: Verify and commit**

Run: `npm run lint && npm test && npm run build`

```bash
git add -A src/config src/Components/ContactFooter src/Components/Footer src/App.jsx src/App.css src/App.test.jsx src/i18n/translations.js
git commit -m "feat: big contact footer with owner photo and waving cat"
```

### Task 4: Home redesign

**Files:**
- Create: `land_site/src/pages/in_Work/projectItems.js`
- Test: `land_site/src/pages/in_Work/projectItems.test.js`
- Modify (rewrite): `land_site/src/pages/Home.jsx`, `land_site/src/pages/Home.css`
- Modify: `land_site/src/App.jsx` (simplify `HomeRoute`)
- Modify: `land_site/src/i18n/translations.js` (replace `home` in en/ru/he)
- Test: `land_site/src/pages/Home.test.jsx`

**Interfaces:**
- Consumes: `Marquee` (`children`, `className`, `repeat`), `RevealText` (`as`, `className`), `Magnetic`, `HoverPreviewList` (Task 1), `ServiceRows` (Task 2), `OwnerPhoto`, `OWNER_NAME` (Task 3), `projects` (`src/pages/in_Work/projectsData.js`).
- Produces: `TIER_ORDER`, `sortByTier(projects)`, `toPreviewItems(projects, t)` from `src/pages/in_Work/projectItems.js` (Task 9 reuses them). Home sections: hero (ink), intro (paper), selected work (ink, `aria-labelledby` → "Selected work"), what I build (paper, → "What I build").
- i18n `home` keys after this task: `marquee, titleStart, titleAccent, titleEnd, ctaContact, ctaWorks, intro, introCta, selectedTitle, buildTitle` (old keys `eyebrow, subtitle, flagshipEyebrow, flagshipCta, capabilitiesTitle, capabilitiesLead, featuredTitle, featuredLead` are removed).

- [ ] **Step 1: Write the failing tests**

`land_site/src/pages/in_Work/projectItems.test.js`:

```js
import { describe, expect, it } from 'vitest'
import { sortByTier, toPreviewItems, TIER_ORDER } from './projectItems'

const P = (id, tier) => ({ id, tier, titleKey: `t.${id}`, thumbnail: `/${id}.jpg` })

describe('projectItems', () => {
  it('orders projects flagship → product → craft, keeping order inside a tier', () => {
    const sorted = sortByTier([P('c1', 'craft'), P('p1', 'product'), P('f1', 'flagship'), P('c2', 'craft'), P('f2', 'flagship')])
    expect(sorted.map((p) => p.id)).toEqual(['f1', 'f2', 'p1', 'c1', 'c2'])
    expect(TIER_ORDER).toEqual(['flagship', 'product', 'craft'])
  })

  it('does not mutate its input', () => {
    const input = [P('c1', 'craft'), P('f1', 'flagship')]
    sortByTier(input)
    expect(input.map((p) => p.id)).toEqual(['c1', 'f1'])
  })

  it('maps projects to HoverPreviewList items', () => {
    const t = (key) => `«${key}»`
    expect(toPreviewItems([P('x', 'product')], t)).toEqual([
      { id: 'x', href: '/works/x', title: '«t.x»', meta: '«works.tier.product»', image: '/x.jpg' },
    ])
  })
})
```

`land_site/src/pages/Home.test.jsx`:

```jsx
import { describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import Home from './Home'
import projects from './in_Work/projectsData'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('../motion/gsap', () => import('../test/gsapMock'))

describe('Home', () => {
  it('opens with the marquee, the offer as the page heading and a start button', () => {
    renderWithProviders(<Home />)
    expect(screen.getAllByText('Blue Cat — Web Studio —').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'I build sites people trust — and systems businesses run on.'
    )
    expect(screen.getByRole('link', { name: 'Start a project' })).toHaveAttribute('href', '/contact')
  })

  it('introduces the owner with photo and name', () => {
    renderWithProviders(<Home />)
    expect(screen.getByRole('img', { name: 'Eugeny' })).toBeInTheDocument()
    expect(screen.getByText('Eugeny')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'More about me' })).toHaveAttribute('href', '/about')
  })

  it('lists selected work, flagship projects first, linking to their case studies', () => {
    renderWithProviders(<Home />)
    const work = screen.getByRole('region', { name: 'Selected work' })
    const rows = within(work)
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href').startsWith('/works/'))
    expect(rows).toHaveLength(5)
    const flagship = projects.filter((p) => p.tier === 'flagship').map((p) => `/works/${p.id}`)
    expect(rows.slice(0, flagship.length).map((a) => a.getAttribute('href'))).toEqual(flagship)
    expect(within(work).getByRole('link', { name: 'All works' })).toHaveAttribute('href', '/works')
  })

  it('shows the five service levels linking to Services', () => {
    renderWithProviders(<Home />)
    const build = screen.getByRole('region', { name: 'What I build' })
    expect(within(build).getAllByRole('link')).toHaveLength(5)
  })

  it('speaks Hebrew', () => {
    localStorage.setItem('bc_lang', 'he')
    renderWithProviders(<Home />)
    expect(screen.getByRole('img', { name: 'יבגני' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'מה אני בונה' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/pages/in_Work/projectItems.test.js src/pages/Home.test.jsx`
Expected: FAIL — `./projectItems` unresolved; Home has no "Selected work" region and an old heading.

- [ ] **Step 3: Create `land_site/src/pages/in_Work/projectItems.js`**

```js
export const TIER_ORDER = ['flagship', 'product', 'craft'];

/**
 * Sorts projects by portfolio tier (flagship → product → craft), stable inside a tier.
 *
 * Input:
 * - `list` (object[]): projects with a `tier`.
 *
 * Output:
 * - New sorted array; the input is not changed.
 */
export const sortByTier = (list) =>
  [...list].sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));

/**
 * Maps projects to `HoverPreviewList` items.
 *
 * Input:
 * - `list` (object[]): projects from `projectsData`.
 * - `t` (function): i18n translate function.
 *
 * Output:
 * - `{ id, href, title, meta, image }[]`.
 */
export const toPreviewItems = (list, t) =>
  list.map((project) => ({
    id: project.id,
    href: `/works/${project.id}`,
    title: t(project.titleKey),
    meta: t(`works.tier.${project.tier}`),
    image: project.thumbnail,
  }));
```

- [ ] **Step 4: Replace the `home` dictionaries in `land_site/src/i18n/translations.js`**

`en.home`:

```js
    home: {
      marquee: 'Blue Cat — Web Studio —',
      titleStart: 'I build sites people trust — and ',
      titleAccent: 'systems',
      titleEnd: ' businesses run on.',
      ctaContact: 'Start a project',
      ctaWorks: 'All works',
      intro: 'I’m a full-stack developer. I design and build websites, web apps and role-based CRM systems — and add AI features when your product needs them. You talk directly to the person who writes the code.',
      introCta: 'More about me',
      selectedTitle: 'Selected work',
      buildTitle: 'What I build',
    },
```

`ru.home`:

```js
    home: {
      marquee: 'Blue Cat — веб-студия —',
      titleStart: 'Я делаю сайты, которым доверяют, — и ',
      titleAccent: 'системы',
      titleEnd: ', на которых работает бизнес.',
      ctaContact: 'Начать проект',
      ctaWorks: 'Все работы',
      intro: 'Я full-stack разработчик. Проектирую и делаю сайты, веб-приложения и CRM-системы с ролями, а когда продукту это нужно, добавляю AI-функции. Вы общаетесь напрямую с тем, кто пишет код.',
      introCta: 'Подробнее обо мне',
      selectedTitle: 'Избранные работы',
      buildTitle: 'Что я делаю',
    },
```

`he.home`:

```js
    home: {
      marquee: 'Blue Cat — סטודיו לאתרים —',
      titleStart: 'אני בונה אתרים שאנשים סומכים עליהם — ו',
      titleAccent: 'מערכות',
      titleEnd: ' שעסקים רצים עליהן.',
      ctaContact: 'בואו נתחיל פרויקט',
      ctaWorks: 'כל העבודות',
      intro: 'אני מפתח Full-stack. אני מתכנן ובונה אתרים, אפליקציות ווב ומערכות CRM עם הרשאות — ומוסיף יכולות AI כשהמוצר צריך אותן. אתם מדברים ישירות עם מי שכותב את הקוד.',
      introCta: 'עוד עליי',
      selectedTitle: 'עבודות נבחרות',
      buildTitle: 'מה אני בונה',
    },
```

- [ ] **Step 5: Rewrite `land_site/src/pages/Home.jsx`**

```jsx
import { Link } from 'react-router-dom'
import useI18n from '../i18n/useI18n'
import { OWNER_NAME } from '../config/owner'
import RevealText from '../motion/RevealText'
import Magnetic from '../motion/Magnetic'
import Marquee from '../motion/Marquee'
import HoverPreviewList from '../motion/HoverPreviewList'
import OwnerPhoto from '../Components/OwnerPhoto/OwnerPhoto.comp'
import ServiceRows from '../Components/ServiceRows/ServiceRows.comp'
import projects from './in_Work/projectsData'
import { sortByTier, toPreviewItems } from './in_Work/projectItems'
import './Home.css'

const SELECTED_COUNT = 5

/**
 * Home page.
 *
 * Output:
 * - Hero: giant marquee, the offer as `<h1>`, magnetic round "Start a project" button.
 * - Intro: owner photo, name and a short first-person introduction.
 * - Selected work: the top projects (flagship first) as a hover-preview list.
 * - What I build: the five service levels as numbered rows linking to Services.
 */
const Home = () => {
  const { t, lang } = useI18n()
  const name = OWNER_NAME[lang]
  const selected = toPreviewItems(sortByTier(projects).slice(0, SELECTED_COUNT), t)

  return (
    <div className="home-page">
      <section className="home-hero section-ink">
        <Marquee className="display home-marquee">{t('home.marquee')}</Marquee>
        <div className="page-content home-hero-row">
          <RevealText as="h1" className="home-offer">
            {t('home.titleStart')}
            <span className="home-offer-accent">{t('home.titleAccent')}</span>
            {t('home.titleEnd')}
          </RevealText>
          <Magnetic>
            <Link className="btn-round" to="/contact">
              {t('home.ctaContact')}
            </Link>
          </Magnetic>
        </div>
      </section>

      <section className="home-intro section-paper">
        <div className="page-content home-intro-inner">
          <OwnerPhoto alt={name} className="home-intro-photo" />
          <div className="home-intro-copy">
            <p className="home-intro-name">{name}</p>
            <p className="home-intro-text">{t('home.intro')}</p>
            <Link className="home-intro-link" to="/about">
              {t('home.introCta')}
            </Link>
          </div>
        </div>
      </section>

      <section className="home-work section-ink" aria-labelledby="home-work-title">
        <div className="page-content">
          <h2 id="home-work-title" className="home-section-title">
            {t('home.selectedTitle')}
          </h2>
          <HoverPreviewList items={selected} />
          <Link className="btn home-work-more" to="/works">
            {t('home.ctaWorks')}
          </Link>
        </div>
      </section>

      <section className="home-build section-paper" aria-labelledby="home-build-title">
        <div className="page-content">
          <h2 id="home-build-title" className="home-section-title">
            {t('home.buildTitle')}
          </h2>
          <ServiceRows withLinks />
        </div>
      </section>
    </div>
  )
}

export default Home
```

- [ ] **Step 6: Rewrite `land_site/src/pages/Home.css`**

```css
.home-page section {
  padding-block: clamp(4rem, 10vw, 9rem);
}

.home-hero {
  padding-block-start: clamp(7rem, 14vw, 11rem);
  overflow: hidden;
}

.home-marquee {
  margin-block-end: clamp(2rem, 5vw, 4rem);
}

.home-hero-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(2rem, 5vw, 5rem);
  flex-wrap: wrap;
}

.home-offer {
  max-width: 22ch;
  margin: 0;
  font-size: clamp(1.75rem, 4vw, 3.5rem);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.home-offer-accent {
  color: var(--accent);
}

.home-intro-inner {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: clamp(1.5rem, 5vw, 5rem);
}

.home-intro-photo {
  width: clamp(9rem, 22vw, 18rem);
  height: clamp(9rem, 22vw, 18rem);
}

.home-intro-name {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.6;
}

.home-intro-text {
  max-width: 34ch;
  margin: 0 0 1.5rem;
  font-size: clamp(1.4rem, 3vw, 2.4rem);
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.home-intro-link {
  color: var(--accent);
  font-weight: 600;
  text-underline-offset: 0.25em;
}

.home-section-title {
  margin: 0 0 clamp(1.5rem, 4vw, 3rem);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.6;
}

.home-work-more {
  margin-block-start: clamp(2rem, 5vw, 3.5rem);
}

@media (max-width: 640px) {
  .home-intro-inner {
    grid-template-columns: 1fr;
    justify-items: start;
  }
}
```

- [ ] **Step 7: Simplify `HomeRoute` in `land_site/src/App.jsx`**

Replace the `HomeRoute` component body with:

```jsx
const HomeRoute = () => (
  <main className="landing-route">
    <Home />
  </main>
)
```

and its JSDoc output line with "Renders the landing page inside `<main>`.".

- [ ] **Step 8: Run the tests**

Run: `npx vitest run src/pages src/i18n src/App.test.jsx`
Expected: PASS (parity test included: all three `home` objects have the same 10 keys).

- [ ] **Step 9: Verify, visual check and commit**

Run: `npm run lint && npm test && npm run build`. Then `npm run dev` and check `/` in EN, RU and HE at desktop width and 400px: marquee loops (left in EN, right in HE), headline reveals, round button pulls toward the cursor, hovering a project row on desktop shows the floating preview, rows show card images at 400px, sections alternate dark/light, the footer appears below. Toggle "Reduce motion" in the accessibility widget: everything is static and visible.

```bash
git add -A src/pages src/App.jsx src/i18n/translations.js
git commit -m "feat: redesigned Home — marquee hero, owner intro, selected work, services rows"
```

- [ ] **Step 10: Phase A landing** (controller)

Dispatch reviewer-vesemir (BRANCH REVIEW of `origin/main..feat/pages`). When APPROVED: `git push origin HEAD:main`; watch the deploy run (`gh run list --limit 1`).

## Phase B — Page transitions, collapsing nav, 404 (§8.5)

### Task 5: `PageTransition` provider and `TransitionLink`

**Files:**
- Create: `land_site/src/motion/PageTransition.jsx`
- Create: `land_site/src/motion/TransitionLink.jsx`
- Modify: `land_site/src/motion/motion.css` (append curtain styles)
- Modify: `land_site/src/test/gsapMock.js` (add `set`)
- Modify: `land_site/src/main.jsx` (wrap `App`)
- Test: `land_site/src/motion/PageTransition.test.jsx`
- Test: `land_site/src/motion/TransitionLink.real.test.jsx`

**Interfaces:**
- Consumes: `useMotionAllowed()`, `{ gsap, useGSAP }` from `./gsap`, `MASCOT_IMAGE`, react-router `useNavigate`, `useLocation`, `useNavigationType`, `Link`.
- Produces:
  - `PageTransitionContext` (React context; value `{ start(to: string, label: string): void }` or `null` without a provider).
  - `<PageTransitionProvider>{children}</PageTransitionProvider>` — renders children plus one `<div class="curtain" aria-hidden="true">` (mascot + `.curtain-label`). Motion on: `start` plays curtain in (`gsap.fromTo(curtain, { yPercent: 100, visibility: 'visible' }, { yPercent: 0, …, onComplete: navigate })`), then curtain out after the route changes (`gsap.to(curtain, { yPercent: -100, …, onComplete: hide })`, hide = `gsap.set(curtain, { visibility: 'hidden' })`). Browser back/forward with motion on: `gsap.set(curtain, { yPercent: 0, visibility: 'visible' })` then curtain out. After every route change focus moves to the page's `<h1>`.
  - `<TransitionLink to label? …linkProps>` — drop-in for router `Link` (string `to`). Plain left click + provider + motion allowed → curtain transition; otherwise behaves exactly like `Link`.
  - `gsapMock.gsap.set` (`vi.fn()`).

- [ ] **Step 1: Add `set` to the GSAP test double `land_site/src/test/gsapMock.js`**

In the exported `gsap` object add `set: vi.fn(),` after `to: vi.fn(),`.

- [ ] **Step 2: Write the failing test `land_site/src/motion/PageTransition.test.jsx`**

```jsx
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, screen } from '@testing-library/react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { PageTransitionProvider } from './PageTransition'
import TransitionLink from './TransitionLink'
import { gsap } from './gsap'
import { mockMatchMedia } from '../test/matchMedia'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('./gsap', () => import('../test/gsapMock'))

const REDUCE = '(prefers-reduced-motion: reduce)'

const BackButton = () => {
  const navigate = useNavigate()
  return (
    <button type="button" onClick={() => navigate(-1)}>
      Back
    </button>
  )
}

const Pages = () => (
  <Routes>
    <Route
      path="/"
      element={
        <main>
          <h1>Home page</h1>
          <TransitionLink to="/works" label="Works">
            Go to works
          </TransitionLink>
          <TransitionLink to="/">Stay home</TransitionLink>
        </main>
      }
    />
    <Route
      path="/works"
      element={
        <main>
          <h1>Works page</h1>
          <BackButton />
        </main>
      }
    />
  </Routes>
)

const renderApp = () => renderWithProviders(<PageTransitionProvider><Pages /></PageTransitionProvider>)
const curtain = () => document.querySelector('.curtain')
const goLink = () => screen.getByRole('link', { name: 'Go to works' })
const lastCall = (fn) => fn.mock.calls.at(-1)

describe('PageTransition + TransitionLink', () => {
  it('navigates immediately and focuses the new heading when motion is off', () => {
    mockMatchMedia({ [REDUCE]: true })
    renderApp()
    fireEvent.click(goLink())
    expect(screen.getByRole('heading', { name: 'Works page' })).toHaveFocus()
    expect(gsap.fromTo).not.toHaveBeenCalled()
  })

  it('covers the page with the curtain before navigating when motion is on', () => {
    renderApp()
    fireEvent.click(goLink())
    expect(screen.getByRole('heading', { name: 'Home page' })).toBeInTheDocument()
    expect(curtain()).toHaveTextContent('Works')

    const [target, from, to] = lastCall(gsap.fromTo)
    expect(target).toBe(curtain())
    expect(from).toEqual({ yPercent: 100, visibility: 'visible' })
    expect(to).toEqual(expect.objectContaining({ yPercent: 0 }))

    act(() => to.onComplete())
    expect(screen.getByRole('heading', { name: 'Works page' })).toHaveFocus()
    expect(gsap.to).toHaveBeenCalledWith(curtain(), expect.objectContaining({ yPercent: -100 }))
  })

  it('ignores a second click while a transition is running', () => {
    renderApp()
    fireEvent.click(goLink())
    fireEvent.click(goLink())
    expect(gsap.fromTo).toHaveBeenCalledTimes(1)
  })

  it('does nothing for a link to the current page', () => {
    renderApp()
    fireEvent.click(screen.getByRole('link', { name: 'Stay home' }))
    expect(gsap.fromTo).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: 'Home page' })).toBeInTheDocument()
  })

  it('leaves modified clicks to the browser', () => {
    renderApp()
    fireEvent.click(goLink(), { ctrlKey: true })
    expect(gsap.fromTo).not.toHaveBeenCalled()
  })

  it('hides the curtain instead of animating it if motion is switched off mid-transition', () => {
    const media = mockMatchMedia()
    renderApp()
    fireEvent.click(goLink())
    const [, , to] = lastCall(gsap.fromTo)

    act(() => media.set(REDUCE, true))
    act(() => to.onComplete())

    expect(screen.getByRole('heading', { name: 'Works page' })).toBeInTheDocument()
    expect(gsap.set).toHaveBeenCalledWith(curtain(), { visibility: 'hidden' })
    expect(gsap.to).not.toHaveBeenCalledWith(curtain(), expect.objectContaining({ yPercent: -100 }))
  })

  it('plays only the curtain-out on browser back', () => {
    const media = mockMatchMedia({ [REDUCE]: true })
    renderApp()
    fireEvent.click(goLink())
    act(() => media.set(REDUCE, false))

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(screen.getByRole('heading', { name: 'Home page' })).toHaveFocus()
    expect(gsap.fromTo).not.toHaveBeenCalled()
    expect(gsap.set).toHaveBeenCalledWith(curtain(), { yPercent: 0, visibility: 'visible' })
    expect(gsap.to).toHaveBeenCalledWith(curtain(), expect.objectContaining({ yPercent: -100 }))
  })

  it('works as a plain link without the provider', () => {
    renderWithProviders(<Pages />)
    fireEvent.click(goLink())
    expect(screen.getByRole('heading', { name: 'Works page' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Write the real-GSAP contract test `land_site/src/motion/TransitionLink.real.test.jsx`**

```jsx
import '../test/realGsapEnv'
import { describe, expect, it } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { PageTransitionProvider } from './PageTransition'
import TransitionLink from './TransitionLink'
import { renderWithProviders } from '../test/renderWithProviders'

// Real GSAP (no mock): proves onComplete really navigates and the curtain really ends hidden.
describe('TransitionLink with real GSAP', () => {
  it('runs the curtain in, navigates, then hides the curtain', async () => {
    renderWithProviders(
      <PageTransitionProvider>
        <Routes>
          <Route path="/" element={<main><h1>Home page</h1><TransitionLink to="/works" label="Works">Go</TransitionLink></main>} />
          <Route path="/works" element={<main><h1>Works page</h1></main>} />
        </Routes>
      </PageTransitionProvider>
    )
    fireEvent.click(screen.getByRole('link', { name: 'Go' }))
    expect(screen.getByRole('heading', { name: 'Home page' })).toBeInTheDocument()

    await screen.findByRole('heading', { name: 'Works page' }, { timeout: 3000 })
    const curtain = document.querySelector('.curtain')
    await waitFor(() => expect(curtain.style.visibility).toBe('hidden'), { timeout: 3000 })
    expect(curtain.style.transform).toContain('-100%')
  })
})
```

- [ ] **Step 4: Run them to see them fail**

Run: `npx vitest run src/motion/PageTransition.test.jsx src/motion/TransitionLink.real.test.jsx`
Expected: FAIL — `./PageTransition` and `./TransitionLink` unresolved.

- [ ] **Step 5: Create `land_site/src/motion/PageTransition.jsx`**

```jsx
import { createContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { gsap, useGSAP } from './gsap';
import useMotionAllowed from './useMotionAllowed';
import { MASCOT_IMAGE } from '../config/owner';
import './motion.css';

export const PageTransitionContext = createContext(null);

const CURTAIN_IN = { yPercent: 0, duration: 0.45, ease: 'power3.inOut' };
const CURTAIN_OUT = { yPercent: -100, duration: 0.45, ease: 'power3.inOut', delay: 0.05 };

/** Moves keyboard focus to the new page's main heading without scrolling. */
const focusHeading = () => {
  const heading = document.querySelector('main h1') || document.querySelector('h1');
  if (!heading) return;
  if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
};

/**
 * Curtain page transitions.
 *
 * Input:
 * - `children` (React.ReactNode). Must be rendered inside a Router.
 *
 * Output:
 * - `children` plus a full-screen curtain (mascot + page name), and `PageTransitionContext`
 *   with `start(to, label)`: curtain in → navigate → curtain out. Motion off → plain navigation.
 *   Browser back/forward → curtain out only. After every route change, focus moves to `<h1>`.
 */
export const PageTransitionProvider = ({ children }) => {
  const curtainRef = useRef(null);
  const busyRef = useRef(false);
  const lastKeyRef = useRef(null);
  const [label, setLabel] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const motionAllowed = useMotionAllowed();
  const { contextSafe } = useGSAP({ scope: curtainRef });

  if (lastKeyRef.current === null) lastKeyRef.current = location.key;

  const hide = contextSafe(() => {
    gsap.set(curtainRef.current, { visibility: 'hidden' });
    busyRef.current = false;
  });

  const curtainOut = contextSafe(() => {
    gsap.to(curtainRef.current, { ...CURTAIN_OUT, onComplete: hide });
  });

  const start = contextSafe((to, nextLabel = '') => {
    if (busyRef.current || to === location.pathname) return;
    busyRef.current = true;
    setLabel(nextLabel);
    gsap.fromTo(
      curtainRef.current,
      { yPercent: 100, visibility: 'visible' },
      { ...CURTAIN_IN, onComplete: () => navigate(to) }
    );
  });

  useEffect(() => {
    if (lastKeyRef.current === location.key) return;
    lastKeyRef.current = location.key;
    focusHeading();

    if (busyRef.current) {
      if (motionAllowed) curtainOut();
      else hide();
      return;
    }
    if (motionAllowed && navigationType === 'POP') {
      busyRef.current = true;
      gsap.set(curtainRef.current, { yPercent: 0, visibility: 'visible' });
      curtainOut();
    }
    // Runs only when the location changes; motion state is read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  return (
    <PageTransitionContext.Provider value={{ start }}>
      {children}
      <div ref={curtainRef} className="curtain" aria-hidden="true">
        <img className="curtain-cat" src={MASCOT_IMAGE} alt="" />
        <span className="curtain-label">{label}</span>
      </div>
    </PageTransitionContext.Provider>
  );
};
```

- [ ] **Step 6: Create `land_site/src/motion/TransitionLink.jsx`**

```jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PageTransitionContext } from './PageTransition';
import useMotionAllowed from './useMotionAllowed';

const isPlainLeftClick = (event) =>
  event.button === 0 && !event.metaKey && !event.altKey && !event.ctrlKey && !event.shiftKey;

/**
 * Drop-in replacement for the router `Link` that plays the curtain transition.
 *
 * Input:
 * - `to` (string): internal path.
 * - `label` (string, optional): page name shown on the curtain.
 * - Any other `Link` props (`className`, `onClick`, `target`, `aria-*`, …).
 *
 * Output:
 * - A `Link`. A plain left click with motion allowed and a `PageTransitionProvider` above
 *   starts the curtain transition; anything else behaves exactly like `Link`.
 */
const TransitionLink = ({ to, label = '', onClick, target, children, ...rest }) => {
  const transition = useContext(PageTransitionContext);
  const motionAllowed = useMotionAllowed();

  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || !transition || !motionAllowed) return;
    if (!isPlainLeftClick(event) || (target && target !== '_self')) return;
    event.preventDefault();
    transition.start(to, label);
  };

  return (
    <Link to={to} target={target} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
};

export default TransitionLink;
```

- [ ] **Step 7: Append the curtain styles to `land_site/src/motion/motion.css`**

```css

/* ── Page transition curtain ── */
.curtain {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 1rem;
  background: var(--ink);
  color: var(--paper);
  visibility: hidden;
  pointer-events: none;
}

.curtain-cat {
  width: 96px;
  height: auto;
}

.curtain-label {
  font-size: clamp(2rem, 6vw, 5rem);
  font-weight: 500;
  letter-spacing: -0.03em;
}
```

- [ ] **Step 8: Wire the provider in `land_site/src/main.jsx`**

Add `import { PageTransitionProvider } from './motion/PageTransition.jsx'` and wrap `<App />`:

```jsx
          <SmoothScroll>
            <PageTransitionProvider>
              <App />
            </PageTransitionProvider>
          </SmoothScroll>
```

Update the bootstrap JSDoc: "Wraps the app with providers (a11y, i18n, router, smooth scroll, page transitions)."

- [ ] **Step 9: Run the tests**

Run: `npx vitest run src/motion`
Expected: PASS (8 mocked + 1 real-GSAP test; existing motion tests still green).

- [ ] **Step 10: Verify and commit**

Run: `npm run lint && npm test && npm run build`

```bash
git add src/motion/PageTransition.jsx src/motion/TransitionLink.jsx src/motion/PageTransition.test.jsx src/motion/TransitionLink.real.test.jsx src/motion/motion.css src/test/gsapMock.js src/main.jsx
git commit -m "feat: curtain page transitions with TransitionLink"
```

### Task 6: Use `TransitionLink` for every internal link

**Files:**
- Test: `land_site/src/test/links.test.js`
- Modify: `land_site/src/pages/Home.jsx`, `land_site/src/Components/Nav/Nav.comp.jsx`, `land_site/src/pages/in_Work/InWork.jsx`, `land_site/src/pages/About.jsx`, `land_site/src/Components/ContactFooter/ContactFooter.comp.jsx`, `land_site/src/motion/HoverPreviewList.jsx`, `land_site/src/Components/ServiceRows/ServiceRows.comp.jsx`

**Interfaces:**
- Consumes: `TransitionLink` (Task 5).
- Produces: a fitness test that fails if any non-test source file imports `Link`/`NavLink` from `react-router-dom` (only `src/motion/TransitionLink.jsx` may).

- [ ] **Step 1: Write the failing test `land_site/src/test/links.test.js`**

```js
import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = fileURLToPath(new URL('..', import.meta.url))
const ROUTER_LINK = /import\s*\{[^}]*\b(Link|NavLink)\b[^}]*\}\s*from\s*['"]react-router-dom['"]/
const ALLOWED = new Set([join('motion', 'TransitionLink.jsx')])

const sourceFiles = readdirSync(SRC, { recursive: true }).filter(
  (file) => /\.jsx?$/.test(file) && !/\.test\.jsx?$/.test(file) && !ALLOWED.has(file)
)

describe('internal links', () => {
  it.each(sourceFiles)('%s uses TransitionLink, not the router Link', (file) => {
    expect(readFileSync(join(SRC, file), 'utf8')).not.toMatch(ROUTER_LINK)
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/test/links.test.js`
Expected: FAIL for `pages/Home.jsx`, `Components/Nav/Nav.comp.jsx`, `pages/in_Work/InWork.jsx`, `pages/About.jsx`, `Components/ContactFooter/ContactFooter.comp.jsx`, `motion/HoverPreviewList.jsx`, `Components/ServiceRows/ServiceRows.comp.jsx`.

- [ ] **Step 3: Swap the imports and tags**

In each failing file: replace the router import with `import TransitionLink from '<relative path>/motion/TransitionLink'` (from `src/pages/`: `'../motion/TransitionLink'`; from `src/pages/in_Work/` and `src/Components/*/`: `'../../motion/TransitionLink'`; from `src/motion/`: `'./TransitionLink'`). If the file also imported other names from `react-router-dom` (`InWork.jsx` imports `useParams`), keep them: `import { useParams } from 'react-router-dom'`. Replace every `<Link` with `<TransitionLink` and `</Link>` with `</TransitionLink>`. Add a `label` with the destination page name where it is known:
- `Home.jsx`: start button `label={t('nav.contact')}`; intro link `label={t('nav.about')}`; "All works" `label={t('nav.works')}`.
- `ContactFooter.comp.jsx`: `label={t('nav.contact')}`.
- `ServiceRows.comp.jsx`: `label={t('nav.services')}`.
- `HoverPreviewList.jsx`: `label={item.title}`.
- `Nav.comp.jsx`: each nav link `label={t('nav.<key>')}`; logo link `label="Blue Cat"`.
- `About.jsx`: `label={t('nav.contact')}`.
- `InWork.jsx`: back/prev/next links `label={t(…titleKey)}` of the target project, "Back to Works" `label={t('nav.works')}`.

- [ ] **Step 4: Run the tests**

Run: `npm test`
Expected: PASS — the links test and every existing component test (TransitionLink without a provider is a plain `Link`).

- [ ] **Step 5: Verify and commit**

Run: `npm run lint && npm test && npm run build`

```bash
git add -A src
git commit -m "refactor: route all internal links through TransitionLink"
```

### Task 7: Collapsing nav with full-screen menu

**Files:**
- Modify (rewrite): `land_site/src/Components/Nav/Nav.comp.jsx`, `land_site/src/Components/Nav/Nav.comp.css`
- Modify: `land_site/src/i18n/translations.js` (add `nav.menu`, `nav.close`, `nav.aria`)
- Modify: `land_site/src/App.css` (add `html.menu-open`)
- Test: `land_site/src/Components/Nav/Nav.comp.test.jsx`

**Interfaces:**
- Consumes: `TransitionLink`, `LanguageSwitcher`, `useI18n()`.
- Deliberate deviation from spec §4 ("Nav depends on ScrollTrigger"): collapse is driven by a passive `scroll` listener (`scrollY > innerHeight`). Lenis scrolls the real window, so the event fires with and without smooth scroll, and the nav needs no animation timeline; ScrollTrigger would add nothing but a dependency on motion being on.
- Produces: `<header class="navbar">` (banner) with text wordmark "Blue Cat", inline `<nav aria-label="Main">` (4 links), and `button.nav-menu-button` (`aria-expanded`, `aria-controls="site-menu"`, name "Menu"/"Close menu"). After `scrollY > innerHeight` the header gets `navbar--collapsed`. The button opens `#site-menu` (`role="dialog"`, `aria-modal`, name "Menu") with 5 links (Home + 4); Escape closes it and returns focus to the button; choosing a link closes it.

- [ ] **Step 1: Add nav keys to `land_site/src/i18n/translations.js`**

In `en.nav` add: `menu: 'Menu', close: 'Close menu', aria: 'Main',`
In `ru.nav` add: `menu: 'Меню', close: 'Закрыть меню', aria: 'Основная навигация',`
In `he.nav` add: `menu: 'תפריט', close: 'סגירת התפריט', aria: 'ניווט ראשי',`

- [ ] **Step 2: Write the failing test `land_site/src/Components/Nav/Nav.comp.test.jsx`**

```jsx
import { describe, expect, it } from 'vitest'
import { act, fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Nav from './Nav.comp'
import { renderWithProviders } from '../../test/renderWithProviders'

const setScroll = (y) => {
  Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true })
  act(() => {
    fireEvent.scroll(window)
  })
}

describe('Nav', () => {
  it('shows the wordmark and the four main links', () => {
    renderWithProviders(<Nav />)
    expect(screen.getByRole('link', { name: 'Blue Cat' })).toHaveAttribute('href', '/')
    const main = screen.getByRole('navigation', { name: 'Main' })
    expect(within(main).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual([
      '/works',
      '/services',
      '/about',
      '/contact',
    ])
  })

  it('collapses after one viewport of scrolling and expands back at the top', () => {
    renderWithProviders(<Nav />)
    const header = screen.getByRole('banner')
    expect(header).not.toHaveClass('navbar--collapsed')
    setScroll(1200)
    expect(header).toHaveClass('navbar--collapsed')
    setScroll(0)
    expect(header).not.toHaveClass('navbar--collapsed')
  })

  it('opens a full-screen menu and moves focus into it', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Nav />)
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    const dialog = screen.getByRole('dialog', { name: 'Menu' })
    const links = within(dialog).getAllByRole('link')
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/', '/works', '/services', '/about', '/contact'])
    expect(links[0]).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes on Escape and returns focus to the button', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Nav />)
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveFocus()
    expect(document.documentElement).not.toHaveClass('menu-open')
  })

  it('closes when a menu link is chosen', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Nav />)
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    expect(document.documentElement).toHaveClass('menu-open')
    await user.click(within(screen.getByRole('dialog')).getByRole('link', { name: 'Works' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
```

- [ ] **Step 3: Run it to see it fail**

Run: `npx vitest run src/Components/Nav`
Expected: FAIL — no "Main" navigation, no "Menu" button, no dialog.

- [ ] **Step 4: Rewrite `land_site/src/Components/Nav/Nav.comp.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react'
import TransitionLink from '../../motion/TransitionLink'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher.comp'
import useI18n from '../../i18n/useI18n'
import './Nav.comp.css'

const LINKS = [
  { to: '/works', key: 'nav.works' },
  { to: '/services', key: 'nav.services' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
]
const MENU_LINKS = [{ to: '/', key: 'nav.home' }, ...LINKS]

/**
 * Site header.
 *
 * Output:
 * - Text wordmark, inline links and the language switcher.
 * - After one viewport of scrolling the header collapses into a round floating menu button
 *   (on small screens the button is always shown). The button opens a full-screen menu that
 *   closes on Escape (focus returns to the button) or when a link is chosen.
 */
const Nav = () => {
  const { t } = useI18n()
  const [collapsed, setCollapsed] = useState(false)
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const update = () => setCollapsed(window.scrollY > window.innerHeight)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const root = document.documentElement
    root.classList.add('menu-open')
    menuRef.current?.querySelector('a')?.focus()
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      root.classList.remove('menu-open')
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`navbar ${collapsed ? 'navbar--collapsed' : ''}`.trim()}>
      <div className="nav-shell">
        <TransitionLink to="/" className="nav-wordmark" label="Blue Cat">
          Blue Cat
        </TransitionLink>
        <nav className="nav-inline" aria-label={t('nav.aria')}>
          <ul className="nav-links">
            {LINKS.map(({ to, key }) => (
              <li key={to}>
                <TransitionLink className="nav-link" to={to} label={t(key)}>
                  {t(key)}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-actions">
          <LanguageSwitcher />
        </div>
      </div>

      <button
        ref={buttonRef}
        type="button"
        className={`nav-menu-button ${open ? 'is-open' : ''}`.trim()}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? t('nav.close') : t('nav.menu')}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {open && (
        <div
          id="site-menu"
          ref={menuRef}
          className="site-menu section-ink"
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.menu')}
          data-lenis-prevent
        >
          <nav aria-label={t('nav.menu')}>
            <ul className="site-menu-links">
              {MENU_LINKS.map(({ to, key }) => (
                <li key={to}>
                  <TransitionLink className="site-menu-link" to={to} label={t(key)} onClick={close}>
                    {t(key)}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
          <LanguageSwitcher />
        </div>
      )}
    </header>
  )
}

export default Nav
```

- [ ] **Step 5: Rewrite `land_site/src/Components/Nav/Nav.comp.css`**

```css
.navbar {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: 1000;
  color: var(--ink);
}

/* Own translucent paper bar so the header reads on both ink and paper sections. */
.nav-shell {
  background: color-mix(in srgb, var(--paper) 88%, transparent);
  backdrop-filter: blur(10px);
}

.nav-shell {
  display: flex;
  align-items: center;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.25rem clamp(1rem, 4vw, 2.5rem);
}

.nav-wordmark {
  color: inherit;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  text-decoration: none;
}

.nav-inline {
  margin-inline-start: auto;
}

.nav-links {
  display: flex;
  gap: clamp(1rem, 3vw, 2.5rem);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: inherit;
  text-decoration: none;
  font-weight: 500;
}

.nav-link:hover,
.nav-link:focus-visible {
  text-decoration: underline;
  text-underline-offset: 0.3em;
}

.navbar--collapsed .nav-shell {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-100%);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.nav-menu-button {
  position: fixed;
  inset-block-start: 1.25rem;
  inset-inline-end: clamp(1rem, 4vw, 2.5rem);
  z-index: 1100;
  display: none;
  place-content: center;
  gap: 6px;
  width: 64px;
  height: 64px;
  border: 0;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
}

.nav-menu-button span {
  display: block;
  width: 24px;
  height: 2px;
  background: #fff;
  transition: transform 0.3s ease;
}

.nav-menu-button.is-open span:first-child {
  transform: translateY(4px) rotate(45deg);
}

.nav-menu-button.is-open span:last-child {
  transform: translateY(-4px) rotate(-45deg);
}

.nav-menu-button:focus-visible {
  outline: 3px solid var(--paper);
  outline-offset: 4px;
}

.navbar--collapsed .nav-menu-button,
.nav-menu-button.is-open {
  display: grid;
}

.site-menu {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: grid;
  align-content: center;
  gap: 3rem;
  padding: clamp(1.5rem, 6vw, 5rem);
  overflow-y: auto;
}

.site-menu-links {
  display: grid;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.site-menu-link {
  color: inherit;
  font-size: clamp(2.5rem, 9vw, 6rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.05;
  text-decoration: none;
}

.site-menu-link:hover,
.site-menu-link:focus-visible {
  color: var(--accent);
}

@media (max-width: 768px) {
  .nav-inline,
  .nav-actions {
    display: none;
  }

  .nav-menu-button {
    display: grid;
  }
}
```

- [ ] **Step 6: Lock page scroll while the menu is open — append to `land_site/src/App.css`**

```css

html.menu-open {
  overflow: hidden;
}
```

- [ ] **Step 7: Run the tests**

Run: `npx vitest run src/Components/Nav src/i18n`
Expected: PASS (5 Nav tests, parity green).

- [ ] **Step 8: Verify, visual check and commit**

Run: `npm run lint && npm test && npm run build`. In `npm run dev`: scroll one screen on Home → header collapses into the round button; open/close the menu with mouse and keyboard; in HE the button sits on the left; at 400px the button is always visible; the header bar stays readable over the dark hero and light pages, including high-contrast mode.

```bash
git add src/Components/Nav src/i18n/translations.js src/App.css
git commit -m "feat: collapsing nav with full-screen menu"
```

### Task 8: 404 page

**Files:**
- Create: `land_site/src/pages/NotFound.jsx`, `land_site/src/pages/NotFound.css`
- Modify: `land_site/src/App.jsx` (route `*`)
- Modify: `land_site/src/pages/in_Work/InWork.jsx` (unknown id → `NotFound`)
- Modify: `land_site/src/i18n/translations.js` (add `notFound` in en/ru/he)
- Test: `land_site/src/App.test.jsx` (extend)

**Interfaces:**
- Consumes: `TransitionLink`, `MASCOT_IMAGE`, `useI18n()`.
- Produces: `<NotFound />` (`<main class="notfound-route section-paper">` with mascot, `<h1>` `notFound.title`, `notFound.body`, link home `notFound.cta`). Task 10 keeps using it for unknown project ids.

- [ ] **Step 1: Add the `notFound` dictionaries to `land_site/src/i18n/translations.js`**

`en` (after `footer`):

```js
    notFound: {
      title: 'This page wandered off',
      body: 'The link may be old — or the cat moved it.',
      cta: 'Back home',
    },
```

`ru`:

```js
    notFound: {
      title: 'Эта страница куда-то ушла',
      body: 'Возможно, ссылка устарела — или кот её утащил.',
      cta: 'На главную',
    },
```

`he`:

```js
    notFound: {
      title: 'הדף הזה הלך לאיבוד',
      body: 'אולי הקישור ישן — או שהחתול הזיז אותו.',
      cta: 'חזרה לדף הבית',
    },
```

- [ ] **Step 2: Extend `land_site/src/App.test.jsx`** (add inside the `describe`)

```jsx
  it('renders the 404 page for an unknown path', () => {
    renderWithProviders(<App />, { route: '/no-such-page' })
    expect(screen.getByRole('heading', { level: 1, name: 'This page wandered off' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back home' })).toHaveAttribute('href', '/')
  })

  it('renders the 404 page for an unknown project', () => {
    renderWithProviders(<App />, { route: '/works/no-such-project' })
    expect(screen.getByRole('heading', { level: 1, name: 'This page wandered off' })).toBeInTheDocument()
  })
```

- [ ] **Step 3: Run it to see it fail**

Run: `npx vitest run src/App.test.jsx`
Expected: FAIL — no 404 heading (unknown path renders nothing; unknown project shows "Project not found").

- [ ] **Step 4: Create `land_site/src/pages/NotFound.jsx`**

```jsx
import { MASCOT_IMAGE } from '../config/owner';
import useI18n from '../i18n/useI18n';
import TransitionLink from '../motion/TransitionLink';
import './NotFound.css';

/**
 * 404 page.
 *
 * Output:
 * - Mascot, "This page wandered off" heading, short explanation and a link home.
 */
const NotFound = () => {
  const { t } = useI18n();

  return (
    <main className="notfound-route section-paper">
      <div className="page-content notfound">
        <img className="notfound-cat" src={MASCOT_IMAGE} alt="" />
        <h1 className="display notfound-title">{t('notFound.title')}</h1>
        <p className="notfound-body">{t('notFound.body')}</p>
        <TransitionLink className="btn" to="/" label={t('nav.home')}>
          {t('notFound.cta')}
        </TransitionLink>
      </div>
    </main>
  );
};

export default NotFound;
```

- [ ] **Step 5: Create `land_site/src/pages/NotFound.css`**

```css
.notfound-route {
  min-height: 80vh;
  display: grid;
  align-items: center;
  padding-block: clamp(7rem, 14vw, 10rem) clamp(4rem, 10vw, 8rem);
}

.notfound {
  display: grid;
  justify-items: start;
  gap: 1.5rem;
}

.notfound-cat {
  width: clamp(80px, 12vw, 140px);
  height: auto;
}

.notfound-title {
  margin: 0;
  font-size: clamp(2.75rem, 8vw, 7rem);
}

.notfound-body {
  max-width: 40ch;
  margin: 0;
  font-size: 1.2rem;
  opacity: 0.75;
}
```

- [ ] **Step 6: Route it in `land_site/src/App.jsx`**

Add `import NotFound from './pages/NotFound'` and, as the last route inside `<Routes>`, `<Route path="*" element={<NotFound />} />`.

- [ ] **Step 7: Use it for unknown projects in `land_site/src/pages/in_Work/InWork.jsx`**

Add `import NotFound from '../NotFound';` and replace the whole `if (!project) { return ( … ); }` block with:

```jsx
  if (!project) return <NotFound />;
```

- [ ] **Step 8: Run the tests**

Run: `npx vitest run src/App.test.jsx src/i18n src/test`
Expected: PASS.

- [ ] **Step 9: Verify and commit**

Run: `npm run lint && npm test && npm run build`

```bash
git add src/pages/NotFound.jsx src/pages/NotFound.css src/App.jsx src/App.test.jsx src/pages/in_Work/InWork.jsx src/i18n/translations.js
git commit -m "feat: 404 page with the mascot"
```

- [ ] **Step 10: Phase B landing** (controller)

reviewer-vesemir BRANCH REVIEW of the Phase B commits (ask for a real-GSAP probe of the curtain on back/forward). When APPROVED: `git push origin HEAD:main`; check the deploy run. Manual: in a real browser click through all nav links with motion on/off, use browser Back/Forward, and Tab through a page after a transition (focus starts at the `<h1>`).

## Phase C — Works and case study (§8.6)

### Task 9: Works page on `HoverPreviewList`

**Files:**
- Modify (rewrite): `land_site/src/pages/Works.jsx`, `land_site/src/pages/Works.css`
- Modify: `land_site/src/i18n/translations.js` (add `works.filtersAria`)
- Test: `land_site/src/pages/Works.test.jsx`

**Interfaces:**
- Consumes: `HoverPreviewList`, `RevealText`, `TIER_ORDER`, `sortByTier`, `toPreviewItems` (Task 4), `projects`.
- Produces: Works page with `<h1>` `works.title`, a filter group (`role="group"`, name `works.filtersAria`) of `aria-pressed` buttons with counts, and the full-width hover-preview list.

- [ ] **Step 1: Add the filter label to `land_site/src/i18n/translations.js`**

In `en.works` add `filtersAria: 'Filter projects',`; in `ru.works` `filtersAria: 'Фильтр проектов',`; in `he.works` `filtersAria: 'סינון פרויקטים',`.

- [ ] **Step 2: Write the failing test `land_site/src/pages/Works.test.jsx`**

```jsx
import { describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Works from './Works'
import projects from './in_Work/projectsData'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('../motion/gsap', () => import('../test/gsapMock'))

const listedHrefs = () =>
  within(screen.getByRole('list'))
    .getAllByRole('link')
    .map((a) => a.getAttribute('href'))

describe('Works', () => {
  it('lists every project as a link to its case study, flagship first', () => {
    renderWithProviders(<Works />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    const hrefs = listedHrefs()
    expect(hrefs).toHaveLength(projects.length)
    const firstFlagship = projects.find((p) => p.tier === 'flagship')
    expect(hrefs[0]).toBe(`/works/${firstFlagship.id}`)
  })

  it('filters by tier and marks the active filter', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Works />)
    const filters = screen.getByRole('group', { name: 'Filter projects' })
    const systems = within(filters).getByRole('button', { name: /Systems/ })
    await user.click(systems)
    expect(systems).toHaveAttribute('aria-pressed', 'true')
    expect(within(filters).getByRole('button', { name: /All/ })).toHaveAttribute('aria-pressed', 'false')
    const flagship = projects.filter((p) => p.tier === 'flagship').map((p) => `/works/${p.id}`)
    expect(listedHrefs()).toEqual(flagship)
  })

  it('shows a count on every filter', () => {
    renderWithProviders(<Works />)
    const filters = screen.getByRole('group', { name: 'Filter projects' })
    expect(within(filters).getByRole('button', { name: /All/ })).toHaveTextContent(String(projects.length))
    const craft = projects.filter((p) => p.tier === 'craft').length
    expect(within(filters).getByRole('button', { name: /Quick builds/ })).toHaveTextContent(String(craft))
  })
})
```

- [ ] **Step 3: Run it to see it fail**

Run: `npx vitest run src/pages/Works.test.jsx`
Expected: FAIL — no filter group named "Filter projects", no list.

- [ ] **Step 4: Rewrite `land_site/src/pages/Works.jsx`**

```jsx
import { useState } from 'react';
import useI18n from '../i18n/useI18n';
import HoverPreviewList from '../motion/HoverPreviewList';
import RevealText from '../motion/RevealText';
import projects from './in_Work/projectsData';
import { sortByTier, TIER_ORDER, toPreviewItems } from './in_Work/projectItems';
import './Works.css';

const FILTERS = ['all', ...TIER_ORDER];

/**
 * Works page.
 *
 * Output:
 * - Big heading and lead, tier filters (all / flagship / product / craft) with counts,
 *   and every visible project as a hover-preview row linking to `/works/:id`.
 */
const Works = () => {
  const { t } = useI18n();
  const [tier, setTier] = useState('all');

  const visible = sortByTier(projects.filter((p) => tier === 'all' || p.tier === tier));
  const countFor = (key) => (key === 'all' ? projects.length : projects.filter((p) => p.tier === key).length);

  return (
    <main className="works-route section-paper">
      <div className="page-content">
        <RevealText as="h1" className="display works-title">
          {t('works.title')}
        </RevealText>
        <p className="works-lead">{t('works.body')}</p>
        <div className="works-filters" role="group" aria-label={t('works.filtersAria')}>
          {FILTERS.map((key) => (
            <button
              key={key}
              type="button"
              className="works-filter"
              aria-pressed={tier === key}
              onClick={() => setTier(key)}
            >
              {t(`works.filters.${key}`)} <span className="works-filter-count">{countFor(key)}</span>
            </button>
          ))}
        </div>
        <HoverPreviewList items={toPreviewItems(visible, t)} className="works-list" />
      </div>
    </main>
  );
};

export default Works;
```

- [ ] **Step 5: Rewrite `land_site/src/pages/Works.css`**

```css
.works-route {
  padding-block: clamp(7rem, 14vw, 10rem) clamp(4rem, 10vw, 8rem);
}

.works-title {
  margin: 0 0 1.5rem;
}

.works-lead {
  max-width: 50ch;
  margin: 0 0 clamp(2rem, 5vw, 3.5rem);
  font-size: 1.2rem;
  opacity: 0.75;
}

.works-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-block-end: clamp(2rem, 5vw, 3rem);
}

.works-filter {
  padding: 0.6rem 1.2rem;
  border: 1px solid currentColor;
  border-radius: 999px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.works-filter[aria-pressed='true'] {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--paper);
}

.works-filter:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 3px;
}

.works-filter-count {
  opacity: 0.6;
  font-variant-numeric: tabular-nums;
}
```

- [ ] **Step 6: Run the tests**

Run: `npx vitest run src/pages src/i18n src/test`
Expected: PASS.

- [ ] **Step 7: Verify and commit**

Run: `npm run lint && npm test && npm run build`

```bash
git add src/pages/Works.jsx src/pages/Works.css src/pages/Works.test.jsx src/i18n/translations.js
git commit -m "feat: Works page as a filterable hover-preview list"
```

### Task 10: Case study page

**Files:**
- Modify (rewrite): `land_site/src/pages/in_Work/InWork.jsx`, `land_site/src/pages/in_Work/InWork.css`
- Modify: `land_site/src/i18n/translations.js` (add `works.case.back|next|links|live|github|gallery`)
- Test: `land_site/src/pages/in_Work/InWork.test.jsx`

**Interfaces:**
- Consumes: `TransitionLink`, `RevealText`, `NotFound` (Task 8), `projects` (fields `images`, `caseKeys`, `technologies`, `workTypes`, `siteUrl`, `github`).
- Produces: `/works/:id` page: full-bleed hero image, back link, tier badge, `<h1>` title, lead, problem/solution/stack/result in large type (only when `caseKeys`), meta list (technologies, work types, links), gallery, and a "Next project" link that wraps from the last project to the first.

- [ ] **Step 1: Add the case keys to `land_site/src/i18n/translations.js`**

In `en.works.case` add:

```js
        back: 'All works',
        next: 'Next project',
        links: 'Links',
        live: 'Live site',
        github: 'Source code',
        gallery: 'Gallery',
```

In `ru.works.case`:

```js
        back: 'Все работы',
        next: 'Следующий проект',
        links: 'Ссылки',
        live: 'Сайт',
        github: 'Исходный код',
        gallery: 'Галерея',
```

In `he.works.case`:

```js
        back: 'כל העבודות',
        next: 'הפרויקט הבא',
        links: 'קישורים',
        live: 'לאתר',
        github: 'קוד מקור',
        gallery: 'גלריה',
```

- [ ] **Step 2: Write the failing test `land_site/src/pages/in_Work/InWork.test.jsx`**

```jsx
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import InWork from './InWork'
import projects from './projectsData'
import { translations } from '../../i18n/translations'
import { renderWithProviders } from '../../test/renderWithProviders'

vi.mock('../../motion/gsap', () => import('../../test/gsapMock'))

const en = translations.en
const titleOf = (project) => project.titleKey.split('.').reduce((node, key) => node[key], en)
const renderCase = (id) =>
  renderWithProviders(
    <Routes>
      <Route path="/works/:id" element={<InWork />} />
    </Routes>,
    { route: `/works/${id}` }
  )

describe('InWork (case study)', () => {
  it('shows the project title as the page heading and the narrative for case-study projects', () => {
    const project = projects.find((p) => p.caseKeys)
    renderCase(project.id)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(titleOf(project))
    for (const part of ['problem', 'solution', 'stack', 'result']) {
      expect(screen.getByRole('heading', { level: 2, name: en.works.case[part] })).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: 'All works' })).toHaveAttribute('href', '/works')
  })

  it('skips the narrative for projects without case keys', () => {
    const project = projects.find((p) => !p.caseKeys)
    renderCase(project.id)
    expect(screen.queryByRole('heading', { level: 2, name: en.works.case.problem })).toBeNull()
  })

  it('lists technologies and links to the source code', () => {
    const project = projects.find((p) => p.github && p.technologies?.length)
    renderCase(project.id)
    for (const tech of project.technologies) {
      expect(screen.getByText(tech.name)).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: /Source code/ })).toHaveAttribute('href', project.github)
  })

  it('links the last project to the first one as "next"', () => {
    const last = projects.at(-1)
    renderCase(last.id)
    expect(screen.getByRole('link', { name: /Next project/ })).toHaveAttribute('href', `/works/${projects[0].id}`)
  })

  it('renders the 404 page for an unknown id', () => {
    renderCase('no-such-project')
    expect(screen.getByRole('heading', { level: 1, name: en.notFound.title })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run it to see it fail**

Run: `npx vitest run src/pages/in_Work/InWork.test.jsx`
Expected: FAIL — no "All works" link, no "Next project" wrap, case labels are `h3`.

- [ ] **Step 4: Rewrite `land_site/src/pages/in_Work/InWork.jsx`**

```jsx
import { useParams } from 'react-router-dom';
import useI18n from '../../i18n/useI18n';
import RevealText from '../../motion/RevealText';
import TransitionLink from '../../motion/TransitionLink';
import NotFound from '../NotFound';
import projects from './projectsData';
import './InWork.css';

const CASE_PARTS = ['problem', 'solution', 'stack', 'result'];

/**
 * Case study page for `/works/:id`.
 *
 * Input:
 * - Route param `id` (string).
 *
 * Output:
 * - Full-bleed hero image, title, lead, the problem/solution/stack/result narrative (when the
 *   project has `caseKeys`), technologies, work types, external links, gallery and a link to the
 *   next project (the last project wraps to the first). Unknown `id` → 404 page.
 */
const InWork = () => {
  const { id } = useParams();
  const { t } = useI18n();

  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return <NotFound />;

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const title = t(project.titleKey);

  return (
    <main className="case-route section-paper">
      <div className="case-hero">
        <img className="case-hero-image" src={project.images[0]} alt={title} />
      </div>

      <div className="page-content case-content">
        <TransitionLink className="case-back" to="/works" label={t('nav.works')}>
          {t('works.case.back')}
        </TransitionLink>
        <span className={`project-card-badge tier-${project.tier}`}>{t(`works.tier.${project.tier}`)}</span>
        <RevealText as="h1" className="display case-title">
          {title}
        </RevealText>
        <p className="case-lead">{t(project.descKey)}</p>

        {project.caseKeys && (
          <section className="case-story" aria-label={title}>
            {CASE_PARTS.map((part) => (
              <div key={part} className="case-story-item">
                <h2 className="case-label">{t(`works.case.${part}`)}</h2>
                <p className="case-big">{t(project.caseKeys[part])}</p>
              </div>
            ))}
          </section>
        )}

        <dl className="case-meta">
          {project.technologies?.length > 0 && (
            <div className="case-meta-row">
              <dt>{t('works.case.technologies')}</dt>
              <dd>
                <ul className="case-tags">
                  {project.technologies.map((item) => (
                    <li key={item.name}>
                      {item.icon && <img src={item.icon} alt="" width="20" height="20" />}
                      {item.name}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
          {project.workTypes?.length > 0 && (
            <div className="case-meta-row">
              <dt>{t('works.case.workTypes')}</dt>
              <dd>{project.workTypes.map((key) => t(`works.types.${key}`)).join(', ')}</dd>
            </div>
          )}
          {(project.siteUrl || project.github) && (
            <div className="case-meta-row">
              <dt>{t('works.case.links')}</dt>
              <dd className="case-links">
                {project.siteUrl && (
                  <a href={project.siteUrl} target="_blank" rel="noopener noreferrer">
                    {t('works.case.live')} ↗
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    {t('works.case.github')} ↗
                  </a>
                )}
              </dd>
            </div>
          )}
        </dl>

        {project.images.length > 1 && (
          <section className="case-gallery" aria-label={t('works.case.gallery')}>
            {project.images.slice(1).map((src, i) => (
              <img key={`${i}-${src}`} src={src} alt={`${title} — ${i + 2}`} loading="lazy" />
            ))}
          </section>
        )}
      </div>

      <TransitionLink className="case-next" to={`/works/${next.id}`} label={t(next.titleKey)}>
        <span className="case-next-label">{t('works.case.next')}</span>
        <span className="display case-next-title">{t(next.titleKey)}</span>
      </TransitionLink>
    </main>
  );
};

export default InWork;
```

- [ ] **Step 5: Rewrite `land_site/src/pages/in_Work/InWork.css`**

```css
.case-route {
  padding-block-start: 0;
}

.case-hero {
  width: 100%;
  height: clamp(320px, 70vh, 760px);
  overflow: hidden;
  background: var(--ink);
}

.case-hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.case-content {
  display: grid;
  gap: 1.5rem;
  padding-block: clamp(3rem, 8vw, 6rem);
}

.case-back {
  color: inherit;
  font-weight: 500;
  text-underline-offset: 0.25em;
}

.case-title {
  margin: 0;
  font-size: clamp(2.75rem, 8vw, 8rem);
}

.case-lead {
  max-width: 60ch;
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.6;
  opacity: 0.8;
}

.case-story {
  display: grid;
  gap: clamp(2.5rem, 6vw, 5rem);
  margin-block: clamp(2rem, 6vw, 5rem);
}

.case-label {
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.6;
}

.case-big {
  max-width: 30ch;
  margin: 0;
  font-size: clamp(1.5rem, 3.5vw, 2.75rem);
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.case-meta {
  display: grid;
  gap: 1.5rem;
  margin: 0;
  padding-block: 2rem;
  border-block: 1px solid color-mix(in srgb, currentColor 20%, transparent);
}

.case-meta-row {
  display: grid;
  grid-template-columns: minmax(8rem, 14rem) 1fr;
  gap: 1rem;
}

.case-meta-row dt {
  opacity: 0.6;
}

.case-meta-row dd {
  margin: 0;
}

.case-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.case-tags li {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.8rem;
  border: 1px solid color-mix(in srgb, currentColor 25%, transparent);
  border-radius: 999px;
}

.case-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.case-links a {
  color: var(--accent);
  font-weight: 600;
}

.case-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  gap: 1.5rem;
}

.case-gallery img {
  width: 100%;
  border-radius: 12px;
}

.case-next {
  display: grid;
  gap: 0.75rem;
  padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 2.5rem);
  background: var(--accent);
  color: #fff;
  text-decoration: none;
}

.case-next-label {
  font-size: 1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.8;
}

.case-next-title {
  font-size: clamp(2.5rem, 7vw, 7rem);
}

.case-next:focus-visible {
  outline: 3px solid var(--ink);
  outline-offset: -6px;
}

@media (max-width: 640px) {
  .case-meta-row {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: Run the tests**

Run: `npx vitest run src/pages src/App.test.jsx src/i18n src/test`
Expected: PASS.

- [ ] **Step 7: Verify and commit**

Run: `npm run lint && npm test && npm run build`

```bash
git add src/pages/in_Work src/i18n/translations.js
git commit -m "feat: big-type case study page with next-project link"
```

- [ ] **Step 8: Phase C landing** (controller)

reviewer-vesemir BRANCH REVIEW of the Phase C commits. When APPROVED: `git push origin HEAD:main`; check the deploy run. Manual: open every case study in EN and HE; a broken GitHub image leaves the page usable.

## Phase D — Services, About, Contact and the "I" voice (§8.7)

### Task 11: Services page

**Files:**
- Modify (rewrite): `land_site/src/pages/Services.jsx`
- Create: `land_site/src/pages/Services.css`
- Delete: `land_site/src/Components/Info/Info.comp.jsx`, `land_site/src/Components/Info/Info.comp.css`
- Test: `land_site/src/pages/Services.test.jsx`

**Interfaces:**
- Consumes: `ServiceRows`, `RevealText`, `Magnetic`, `TransitionLink`.
- Produces: Services page (paper): `<h1>` `services.title`, lead, numbered rows (no links), magnetic round button to `/contact` (`home.ctaContact`).

- [ ] **Step 1: Write the failing test `land_site/src/pages/Services.test.jsx`**

```jsx
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import Services from './Services'
import { translations } from '../i18n/translations'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('../motion/gsap', () => import('../test/gsapMock'))

describe('Services', () => {
  it('shows the heading, the five service rows and a start-a-project button', () => {
    renderWithProviders(<Services />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(translations.en.services.title)
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    expect(screen.getByRole('link', { name: 'Start a project' })).toHaveAttribute('href', '/contact')
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/pages/Services.test.jsx`
Expected: FAIL — the current page has an `<h2>`, not an `<h1>`, and no contact link.

- [ ] **Step 3: Rewrite `land_site/src/pages/Services.jsx`**

```jsx
import ServiceRows from '../Components/ServiceRows/ServiceRows.comp';
import useI18n from '../i18n/useI18n';
import Magnetic from '../motion/Magnetic';
import RevealText from '../motion/RevealText';
import TransitionLink from '../motion/TransitionLink';
import './Services.css';

/**
 * Services page.
 *
 * Output:
 * - Big heading and lead, the five service levels as numbered rows and a magnetic
 *   "Start a project" button to `/contact`.
 */
const Services = () => {
  const { t } = useI18n();

  return (
    <main className="services-route section-paper">
      <div className="page-content services-page">
        <RevealText as="h1" className="display services-title">
          {t('services.title')}
        </RevealText>
        <p className="services-lead">{t('services.lead')}</p>
        <ServiceRows />
        <div className="services-cta">
          <Magnetic>
            <TransitionLink className="btn-round" to="/contact" label={t('nav.contact')}>
              {t('home.ctaContact')}
            </TransitionLink>
          </Magnetic>
        </div>
      </div>
    </main>
  );
};

export default Services;
```

- [ ] **Step 4: Create `land_site/src/pages/Services.css`**

```css
.services-route {
  padding-block: clamp(7rem, 14vw, 10rem) clamp(4rem, 10vw, 8rem);
}

.services-title {
  margin: 0 0 1.5rem;
}

.services-lead {
  max-width: 40ch;
  margin: 0 0 clamp(2.5rem, 6vw, 4.5rem);
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  line-height: 1.4;
}

.services-cta {
  display: flex;
  justify-content: flex-end;
  margin-block-start: clamp(2.5rem, 6vw, 4rem);
}
```

- [ ] **Step 5: Delete the old `Info` component**

```bash
git rm src/Components/Info/Info.comp.jsx src/Components/Info/Info.comp.css
```

- [ ] **Step 6: Run the tests**

Run: `npx vitest run src/pages src/test`
Expected: PASS.

- [ ] **Step 7: Verify and commit**

Run: `npm run lint && npm test && npm run build`

```bash
git add -A src/pages/Services.jsx src/pages/Services.css src/pages/Services.test.jsx src/Components/Info
git commit -m "feat: big-type Services page"
```

### Task 12: About and Contact pages

**Files:**
- Modify (rewrite): `land_site/src/pages/About.jsx`, `land_site/src/pages/About.css`, `land_site/src/pages/Contact.jsx`
- Create: `land_site/src/pages/Contact.css`
- Test: `land_site/src/pages/About.test.jsx`, `land_site/src/pages/Contact.test.jsx`

**Interfaces:**
- Consumes: `OwnerPhoto`, `OWNER_NAME`, `RevealText`, `TransitionLink`, `TechStrip`, `ContactSection`.
- Produces: About (paper): photo + name + `<h1>` `about.title`, bio paragraphs (`intro, skills, approach, range`), CTA link to `/contact`, tech strip. Contact (paper): `<h1>` `contact.title`, lead `contact.body`, existing `ContactSection` (form, email, WhatsApp).

- [ ] **Step 1: Write the failing tests**

`land_site/src/pages/About.test.jsx`:

```jsx
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import About from './About'
import { translations } from '../i18n/translations'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('../motion/gsap', () => import('../test/gsapMock'))

describe('About', () => {
  it('shows the owner photo and name with the page heading', () => {
    renderWithProviders(<About />)
    expect(screen.getByRole('img', { name: 'Eugeny' })).toHaveClass('owner-photo')
    expect(screen.getByText('Eugeny')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(translations.en.about.title)
    expect(screen.getByRole('link', { name: translations.en.about.cta })).toHaveAttribute('href', '/contact')
  })

  it('uses the Hebrew name in Hebrew', () => {
    localStorage.setItem('bc_lang', 'he')
    renderWithProviders(<About />)
    expect(screen.getByRole('img', { name: 'יבגני' })).toBeInTheDocument()
  })
})
```

`land_site/src/pages/Contact.test.jsx`:

```jsx
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import Contact from './Contact'
import { translations } from '../i18n/translations'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('../motion/gsap', () => import('../test/gsapMock'))

describe('Contact', () => {
  it('shows a page heading, the lead and the contact form', () => {
    renderWithProviders(<Contact />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(translations.en.contact.title)
    expect(screen.getByText(translations.en.contact.body)).toBeInTheDocument()
    expect(screen.getByLabelText(translations.en.contact.form.name)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/pages/About.test.jsx src/pages/Contact.test.jsx`
Expected: FAIL — About has no photo; Contact has no `<h1>`.

- [ ] **Step 3: Rewrite `land_site/src/pages/About.jsx`**

```jsx
import OwnerPhoto from '../Components/OwnerPhoto/OwnerPhoto.comp';
import TechStrip from '../Components/TechStrip/TechStrip.comp';
import { OWNER_NAME } from '../config/owner';
import useI18n from '../i18n/useI18n';
import RevealText from '../motion/RevealText';
import TransitionLink from '../motion/TransitionLink';
import './About.css';

const BIO_KEYS = ['intro', 'skills', 'approach', 'range'];

/**
 * About page.
 *
 * Output:
 * - Owner photo and name, big heading, first-person bio, link to `/contact`, technology strip.
 */
const About = () => {
  const { t, lang } = useI18n();
  const name = OWNER_NAME[lang];

  return (
    <main className="about-route section-paper">
      <div className="page-content about-page">
        <div className="about-head">
          <OwnerPhoto alt={name} className="about-photo" />
          <div>
            <p className="about-name">{name}</p>
            <RevealText as="h1" className="display about-title">
              {t('about.title')}
            </RevealText>
          </div>
        </div>
        <div className="about-bio">
          {BIO_KEYS.map((key) => (
            <p key={key}>{t(`about.${key}`)}</p>
          ))}
        </div>
        <TransitionLink className="btn about-cta" to="/contact" label={t('nav.contact')}>
          {t('about.cta')}
        </TransitionLink>
        <TechStrip />
      </div>
    </main>
  );
};

export default About;
```

- [ ] **Step 4: Rewrite `land_site/src/pages/About.css`**

```css
.about-route {
  padding-block: clamp(7rem, 14vw, 10rem) clamp(4rem, 10vw, 8rem);
}

.about-page {
  display: grid;
  gap: clamp(2rem, 5vw, 3.5rem);
}

.about-head {
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 5vw, 4rem);
  flex-wrap: wrap;
}

.about-photo {
  width: clamp(9rem, 20vw, 16rem);
  height: clamp(9rem, 20vw, 16rem);
}

.about-name {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.6;
}

.about-title {
  margin: 0;
}

.about-bio {
  display: grid;
  gap: 1.25rem;
  max-width: 62ch;
}

.about-bio p {
  margin: 0;
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  line-height: 1.65;
}

.about-bio p:first-child {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  line-height: 1.3;
}

.about-cta {
  justify-self: start;
}
```

- [ ] **Step 5: Rewrite `land_site/src/pages/Contact.jsx`**

```jsx
import ContactSection from '../Components/ContactSection/ContactSection.comp';
import useI18n from '../i18n/useI18n';
import RevealText from '../motion/RevealText';
import './Contact.css';

/**
 * Contact page.
 *
 * Output:
 * - Big heading and lead, then the contact section (form, email, WhatsApp).
 */
const Contact = () => {
  const { t } = useI18n();

  return (
    <main className="contact-route section-paper">
      <div className="page-content contact-page">
        <RevealText as="h1" className="display contact-title">
          {t('contact.title')}
        </RevealText>
        <p className="contact-lead">{t('contact.body')}</p>
        <ContactSection />
      </div>
    </main>
  );
};

export default Contact;
```

- [ ] **Step 6: Create `land_site/src/pages/Contact.css`**

```css
.contact-route {
  padding-block: clamp(7rem, 14vw, 10rem) clamp(4rem, 10vw, 8rem);
}

.contact-title {
  margin: 0 0 1.25rem;
}

.contact-lead {
  max-width: 45ch;
  margin: 0 0 clamp(2rem, 5vw, 3.5rem);
  font-size: clamp(1.2rem, 2.5vw, 1.6rem);
}
```

- [ ] **Step 7: Run the tests**

Run: `npx vitest run src/pages src/test`
Expected: PASS.

- [ ] **Step 8: Verify and commit**

Run: `npm run lint && npm test && npm run build`

```bash
git add src/pages/About.jsx src/pages/About.css src/pages/About.test.jsx src/pages/Contact.jsx src/pages/Contact.css src/pages/Contact.test.jsx
git commit -m "feat: About with owner photo and big-type Contact page"
```

### Task 13: "I" voice in EN/RU/HE

**Files:**
- Test: `land_site/src/i18n/voice.test.js`
- Modify: `land_site/src/i18n/translations.js`

**Interfaces:**
- Consumes: `translations`.
- Produces: a voice test that fails on first-person-plural words in any language; copy rewritten in the singular. Removes unused keys `about.githubTitle`, `about.githubText`, `about.linkedinTitle`, `about.linkedinText` (no code references them).

- [ ] **Step 1: Write the failing test `land_site/src/i18n/voice.test.js`**

```js
import { describe, expect, it } from 'vitest'
import { translations } from './translations'

const FIRST_PERSON_PLURAL = {
  en: /\b(we|we're|we've|we'll|our|ours|us)\b/i,
  ru: /(^|[^а-яё])(мы|нас|нам|нами|наш[а-яё]*)(?=[^а-яё]|$)/i,
  he: /אנחנו|שלנו|(^|[\s״"(])אנו(?=[\s,.!?—]|$)/,
}

const strings = (node, prefix = '') =>
  Object.entries(node).flatMap(([key, value]) =>
    value && typeof value === 'object' ? strings(value, `${prefix}${key}.`) : [[`${prefix}${key}`, value]]
  )

describe('voice', () => {
  it.each(['en', 'ru', 'he'])('%s copy speaks as "I", not "we"', (code) => {
    const offenders = strings(translations[code])
      .filter(([, text]) => FIRST_PERSON_PLURAL[code].test(text))
      .map(([key]) => key)
    expect(offenders).toEqual([])
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/i18n/voice.test.js`
Expected: FAIL — EN offenders include `about.title`, `about.intro`, `about.skills`, `about.approach`, `about.range`, `works.title`, `works.body`, `works.projects.aispace.case.result`, `services.title`, `services.s2.desc`, `services.s3.desc`, `services.s4.desc`, `finalCta.aria`, `finalCta.title`; RU and HE have their equivalents.

- [ ] **Step 3: Rewrite the copy in `land_site/src/i18n/translations.js`**

Replace `en.about` with:

```js
    about: {
      title: 'About me',
      intro: 'I’m a full-stack developer and the person behind Blue Cat. I build modern websites and web applications for businesses.',
      skills: 'I work across the frontend and the backend: HTML, CSS, JavaScript, React, Node.js, Python and REST APIs — to deliver fast, responsive, easy-to-use products.',
      approach: 'I care about clean code, clear communication and predictable timelines. Beyond new builds, I support and redesign existing websites: better UX/UI, reconnected integrations, fresh content, and help filling a database when needed. A landing page, a full website or backend integrations — you get a result you can rely on.',
      range: 'My range runs from fast one-page sites to full-stack web apps and role-based CRM systems with their own database — and I can add AI on top: chat assistants for your visitors, or predictive analytics inside your dashboards.',
      cta: 'Let’s work together — get in touch.',
    },
```

Replace `ru.about` with:

```js
    about: {
      title: 'Обо мне',
      intro: 'Я full-stack разработчик и человек, который стоит за Blue Cat. Делаю современные сайты и веб-приложения для бизнеса.',
      skills: 'Работаю и с фронтендом, и с бэкендом: HTML, CSS, JavaScript, React, Node.js, Python и REST API — чтобы продукт был быстрым, адаптивным и удобным.',
      approach: 'Я ценю качественный код, понятную коммуникацию и соблюдение сроков. Помимо разработки с нуля беру в поддержку и редизайн существующие сайты: улучшаю UX/UI, переподключаю интеграции, обновляю контент и при необходимости помогаю с наполнением базы данных. Лендинг, полноценный сайт или интеграции с бэкендом — результат, на который можно положиться.',
      range: 'Мой диапазон — от быстрых лендингов до full-stack веб-приложений и CRM-систем с ролями и собственной базой данных. Поверх этого могу внедрить AI: чат-ассистента для посетителей сайта или прогнозную аналитику внутри дашбордов.',
      cta: 'Давайте работать вместе — напишите мне.',
    },
```

Replace `he.about` with:

```js
    about: {
      title: 'עליי',
      intro: 'אני מפתח Full-stack והאיש שמאחורי Blue Cat. אני בונה אתרים ואפליקציות ווב מודרניים לעסקים.',
      skills: 'אני עובד גם בפרונטאנד וגם בבקאנד: HTML, CSS, JavaScript, React, Node.js, Python ו-REST API — כדי לספק מוצרים מהירים, רספונסיביים וידידותיים למשתמש.',
      approach: 'חשובים לי קוד איכותי, תקשורת ברורה ועמידה בזמנים. מעבר לפיתוח מאפס, אני נותן תמיכה ומבצע רידיזיין לאתרים קיימים: שיפור UX/UI, חיבור מחדש של אינטגרציות, עדכון תוכן, ובמידת הצורך עזרה בהזנת נתונים. דף נחיתה, אתר מלא או אינטגרציות בקאנד — תקבלו פתרון שאפשר לסמוך עליו.',
      range: 'הטווח שלי נע מדפי נחיתה מהירים ועד אפליקציות ווב Full-stack ומערכות CRM עם הרשאות ומסד נתונים משלהן. מעבר לזה אני יכול להוסיף AI: צ׳אט-בוט לתמיכה במבקרי האתר, או ניתוח חיזוי בתוך הדשבורדים.',
      cta: 'בואו נעבוד יחד — כתבו לי.',
    },
```

Replace `en.services` with:

```js
    services: {
      title: 'Services',
      lead: 'Not just a site that looks good — a system that keeps working after handover.',
      s1: {
        title: 'Landing Page (One-page)',
        desc: 'Conversion-focused landing pages with clear structure, strong copy, and fast load time — built to turn visitors into leads and customers.',
      },
      s2: {
        title: 'Ongoing Support',
        desc: 'I keep your website stable and secure: monitoring, bug fixes, small improvements, and quick iterations when your business needs change.',
      },
      s3: {
        title: 'Website Updates & Upgrades',
        desc: 'Need new features or a refresh? I add new sections, improve UX, optimize performance and SEO, and update content without breaking what already works.',
      },
      s4: {
        title: 'Backend & API Integrations',
        desc: 'I connect forms, payments, CRM, and other services via APIs. From simple automations to custom backend logic — everything works end‑to‑end.',
      },
      s5: {
        title: 'AI Integrations',
        desc: 'AI where it earns its place: chat assistants that support your visitors on‑site, and predictive analytics inside CRMs and dashboards — deal scoring, revenue forecasts, LLM‑driven automation.',
      },
    },
```

Replace `ru.services` with:

```js
    services: {
      title: 'Услуги',
      lead: 'Не просто сайт, который красиво выглядит, а система, которая продолжает работать после сдачи проекта.',
      s1: {
        title: 'Лендинг (One-page)',
        desc: 'Конверсионные лендинги с понятной структурой, сильным оффером и высокой скоростью загрузки — чтобы посетители становились лидами и клиентами.',
      },
      s2: {
        title: 'Поддержка и сопровождение',
        desc: 'Держу сайт в форме: мониторинг, исправление багов, мелкие улучшения и быстрые правки, когда бизнесу нужно что‑то поменять.',
      },
      s3: {
        title: 'Обновление и доработка сайтов',
        desc: 'Добавлю новые фичи и секции, улучшу UX, оптимизирую скорость и SEO, обновлю контент и дизайн — без поломки существующей логики.',
      },
      s4: {
        title: 'Интеграции бэкенда и API',
        desc: 'Подключаю формы, оплаты, CRM и другие сервисы через API. От простых автоматизаций до кастомной серверной логики — всё под ключ.',
      },
      s5: {
        title: 'AI-интеграции',
        desc: 'Добавляю AI там, где он реально полезен: чат-ассистенты для поддержки посетителей на сайте и прогнозная аналитика внутри CRM и дашбордов — скоринг сделок, прогноз выручки, автоматизация на основе LLM.',
      },
    },
```

Replace `he.services` with:

```js
    services: {
      title: 'שירותים',
      lead: 'לא רק אתר שנראה טוב — מערכת שממשיכה לעבוד גם אחרי המסירה.',
      s1: {
        title: 'עמוד נחיתה (One-page)',
        desc: 'דפי נחיתה ממוקדי המרה עם מבנה ברור, מסרים חזקים וזמן טעינה מהיר — כדי להפוך מבקרים ללידים וללקוחות.',
      },
      s2: {
        title: 'תמיכה וליווי מתמשך',
        desc: 'אני שומר על האתר יציב ומאובטח: ניטור, תיקון תקלות, שיפורים קטנים ועדכונים מהירים כשצריך לשנות משהו בעסק.',
      },
      s3: {
        title: 'עדכון ושדרוג אתרים קיימים',
        desc: 'הוספת פיצ׳רים וסקשנים, שיפור UX, אופטימיזציה למהירות ו-SEO ועדכון תוכן ועיצוב — בלי לשבור מה שכבר עובד.',
      },
      s4: {
        title: 'אינטגרציות בקאנד ו-API',
        desc: 'אני מחבר טפסים, תשלומים, CRM ושירותים נוספים דרך APIs. מאוטומציות פשוטות ועד לוגיקה מותאמת אישית — מקצה לקצה.',
      },
      s5: {
        title: 'אינטגרציות AI',
        desc: 'אני מוסיף AI במקום שבו הוא באמת מועיל: צ׳אט-בוטים לתמיכה במבקרי האתר, וניתוח חיזוי בתוך CRM ודשבורדים — דירוג עסקאות, תחזיות הכנסות, אוטומציה מבוססת LLM.',
      },
    },
```

In `works` set `title` / `body`:
- `en`: `title: 'Works',` `body: 'A curated selection of projects I’ve delivered — from clean landing pages to full web systems.',`
- `ru`: `title: 'Работы',` `body: 'Подборка проектов, которые я реализовал, — от лендингов до полноценных веб-систем.',`
- `he`: `title: 'עבודות',` `body: 'מבחר פרויקטים שביצעתי — מדפי נחיתה נקיים ועד מערכות ווב מלאות.',`

In `works.projects.aispace.case` set `result`:
- `en`: `result: 'Shows the frontend side of AI‑product work: chat UX, layout systems for feature‑rich screens, and a demo shell ready to wire up to a live AI API — the same approach I use for AI‑integration work (see Services).',`
- `ru`: `result: 'Показывает фронтенд-сторону работы с AI-продуктами: UX чата, системы компоновки для насыщенных фичами экранов и готовую демо-оболочку для подключения к живому AI API — тот же подход, что я использую в услуге «AI-интеграции» (см. Услуги).',`
- `he`: `result: 'מציג את הצד הפרונטאלי של עבודה עם מוצרי AI: UX של צ׳אט, מערכות פריסה למסכים עתירי פיצ׳רים, ומעטפת דמו מוכנה לחיבור ל-AI API אמיתי — אותה גישה שבה אני משתמש בשירות ״אינטגרציות AI״ (ראו שירותים).',`

Replace `en.finalCta` with:

```js
    finalCta: {
      aria: 'Get in touch',
      title: 'Get in touch',
      subtitle: 'A modern website for your business. Order now and get 1 month of support for free.',
      lead: 'Have a question, need a quote, or want to discuss your project? Send a message — I’ll reply quickly and help you choose the best solution.',
      whatsapp: 'WhatsApp',
      email: 'Email',
      scroll: 'Or send a message below',
    },
```

Replace `ru.finalCta` with:

```js
    finalCta: {
      aria: 'Связаться со мной',
      title: 'Связаться со мной',
      subtitle: 'Сделаю современный сайт для вашего бизнеса. Закажите сейчас и получите 1 месяц поддержки бесплатно.',
      lead: 'Есть вопрос, нужен расчёт или хотите обсудить проект? Напишите — отвечу оперативно и помогу выбрать лучший вариант.',
      whatsapp: 'WhatsApp',
      email: 'Email',
      scroll: 'Или отправьте сообщение ниже',
    },
```

Replace `he.finalCta` with:

```js
    finalCta: {
      aria: 'יצירת קשר',
      title: 'צרו קשר',
      subtitle: 'אבנה עבורכם אתר מודרני לעסק. הזמינו עכשיו וקבלו חודש תמיכה חינם.',
      lead: 'יש שאלה, צריך הצעת מחיר או רוצה לדבר על הפרויקט? שלחו הודעה — אחזור אליכם במהירות ואעזור לבחור את הפתרון המתאים.',
      whatsapp: 'WhatsApp',
      email: 'אימייל',
      scroll: 'או שלחו הודעה כאן למטה',
    },
```

In `he.contact` set `title: 'צרו קשר',` and `body: 'שלחו הודעה ואחזור אליכם בהקדם.',` (EN/RU contact title/body already speak as "I").

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/i18n src/pages src/Components`
Expected: PASS — voice test green in all three languages, parity green (the four removed `about.*` keys are gone from every language), page tests green (they read copy from `translations`).

- [ ] **Step 5: Verify and commit**

Run: `npm run lint && npm test && npm run build`

```bash
git add src/i18n/voice.test.js src/i18n/translations.js
git commit -m "feat: first-person voice across EN, RU and HE"
```

### Task 14: Final verification and landing

**Files:** none (verification only).

- [ ] **Step 1: Full checks**

Run in `land_site/`: `npm ci && npm run lint && npm test && npm run build`. Expected: all green; note the test count and the gzipped JS size from the build output (budget: foundation libs ≈ 60 KB gzip; flag growth over 20 KB vs `main`).

- [ ] **Step 2: Manual matrix** (dev server, `npm run dev`)

For `/`, `/works`, one case study with `caseKeys`, one without, `/services`, `/about`, `/contact`, `/no-such-page`: EN and HE × desktop and 400px × motion on and "Reduce motion" on. Check: no broken layout in HE, curtain transitions and Back/Forward, collapsing nav, hover preview on desktop / card images on mobile, focus lands on `<h1>` after navigation, nothing is invisible with reduced motion.

- [ ] **Step 3: Lighthouse on Home (mobile)**

Run: `npm run build && npx vite preview --port 4173` then in another terminal `npx lighthouse http://localhost:4173 --only-categories=performance,accessibility --form-factor=mobile --quiet --chrome-flags="--headless"`. Expected: Performance ≥ 85, Accessibility ≥ 95. If below, record the top opportunities and fix them in a follow-up commit with a test where applicable.

- [ ] **Step 4: Owner proofreading**

Send the owner the RU and HE strings changed in Tasks 3, 4, 7, 8, 9, 10, 13 (`git diff origin/main -- land_site/src/i18n/translations.js`). Apply corrections before landing.

- [ ] **Step 5: Phase D landing** (controller)

reviewer-vesemir BRANCH REVIEW of `origin/main..feat/pages`. When APPROVED and the owner has proofread: `git push origin HEAD:main`; check the deploy run; then remove the worktree (`git worktree remove .worktrees/pages`) and delete the branch.
