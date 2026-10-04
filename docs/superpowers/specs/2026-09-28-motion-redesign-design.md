# Motion Redesign — bluecat.cc

Date: 2026-09-28. Status: awaiting owner review.
Reference: https://dennissnellenberg.com (GSAP + ScrollTrigger, Barba.js, Locomotive Scroll, jQuery).

## 1. Intent

**Owner said:** make bluecat.cc look modern and "cool" like dennissnellenberg.com; full
redesign (not just a motion layer); identity = "Blue Cat" brand plus the owner as a real
person; cartoon cat stays but only as small surprise moments; owner will provide a photo;
technical approach A (GSAP + Lenis inside the existing React app).

**Assumptions (correct me):**
- Content (projects, services, three languages EN/RU/HE) stays; only presentation and voice change.
- Voice moves from "we" to "I" in all three languages; owner proofreads RU/HE.
- Nothing reaches `main` without owner review — a push to `main` deploys to production.

**Success criteria:**
- Home, Works, case study, Services, About, Contact and a new 404 use the new visual system.
- Effects present: smooth scroll, line-by-line text reveals, magnetic buttons, hover image
  preview on the project list, scroll-velocity marquee, curtain page transitions, collapsing nav.
- Every effect works in RTL (Hebrew) and switches off completely with OS
  `prefers-reduced-motion` **or** the site's accessibility widget "reduce motion" toggle.
- Lighthouse on Home (mobile): Performance ≥ 85, Accessibility ≥ 95.
- `npm run lint`, `npm test`, `npm run build` all pass.

## 2. Visual system

- **Palette (tokens in `pages/colors.css`):** `--ink #141517` (dark sections),
  `--paper #F4F3F0` (light sections), `--accent #3D5AFE` (Blue Cat blue — buttons, links,
  highlighted words only), `--cat-gold #F5A623` (only next to the mascot). Existing token
  names (`--bg`, `--text`, `--accent`, …) are kept and re-pointed so untouched CSS still works.
  High-contrast override stays.
- **Type:** `Inter Variable` (Latin + Cyrillic) with `Heebo Variable` as fallback in the
  same stack, so Hebrew glyphs render in Heebo automatically. Self-hosted via
  `@fontsource-variable/*` (no Google Fonts request). Display sizes via
  `clamp(3rem, 9vw, 10rem)`.
- **Sections** alternate ink/paper while scrolling.
- **Mascot:** `logo_NO_font.png` appears on the page-transition curtain, the 404 page, and
  waving from the corner of the big contact footer. Header uses a text wordmark "Blue Cat".
- **Owner details:** new `src/config/owner.js` holding `OWNER_NAME` (per language) and
  `OWNER_PHOTO` (`/owner.jpg`). While the photo file is missing, the photo slot renders the
  mascot instead, so no layout ever shows a broken image.

## 3. Pages

**Home**
1. Hero — giant marquee "Blue Cat — Web Studio —", one-line offer (`home.title*`),
   round magnetic "Start a project" button.
2. Intro — 2–3 sentences in "I" voice + round owner photo.
3. Selected work — large text rows (title + tier label). Desktop with fine
   pointer: hovering a row shows the project thumbnail following the cursor. Touch / small
   screens: image cards.
4. What I build — the five service levels as big numbered rows (`services.s1…s5`).
5. Big contact footer (shared by all pages except `/contact`): "Let's work together",
   photo, email, WhatsApp, magnetic button, waving cat.

**Works** — the same hover-preview list, full width, with the existing
all/flagship/product/craft filters.
**Case study (`/works/:id`)** — full-bleed hero image, then problem / solution / stack /
result in large type, technologies and work types row, gallery, "next project" link.
**Services / About / Contact** — big-type layouts on the same tokens; About gets the photo.
**404** — new route `*`: mascot + "This page wandered off" + home link.

## 4. Motion

All motion code lives in `src/motion/`.

| Unit | Does | Depends on |
|---|---|---|
| `useMotionAllowed()` | `false` if OS reduced-motion **or** `data-reduce-motion="true"`; re-renders on change | `useA11y`, `matchMedia` |
| `SmoothScroll` provider | creates Lenis, drives it from the GSAP ticker, syncs ScrollTrigger; not created when motion is off; scrolls to top on route change | `lenis`, `gsap` |
| `RevealText` | splits a heading into lines (GSAP SplitText, `autoSplit` so it re-splits on resize/font load/language change) and slides lines up on enter | `@gsap/react` |
| `Magnetic` | wraps a child; pulls it toward the pointer within its box, springs back on leave; no-op on touch | `gsap.quickTo` |
| `Marquee` | infinite horizontal loop; speed and direction react to scroll velocity; base direction flips in RTL | `useI18n().dir` |
| `HoverPreviewList` | accessible list of links; one floating image follows the pointer and swaps on row hover | `gsap.quickTo` |
| `PageTransition` + `TransitionLink` | `TransitionLink` replaces internal `Link`: plays curtain in (with page name + cat), navigates, curtain out. Motion off → plain navigation. Browser back/forward → curtain out only | `react-router`, `gsap` |
| `Nav` (updated) | after 1 viewport of scroll collapses into a round floating menu button that opens a full-screen menu | `ScrollTrigger` |

Every GSAP call runs inside `useGSAP()` (automatic cleanup on unmount/route change).
When motion is off, components render their final state with no animation.

## 5. Technical changes

- **Add:** `gsap`, `@gsap/react`, `lenis`, `@fontsource-variable/inter`,
  `@fontsource-variable/heebo`; dev: `vitest`, `jsdom`, `@testing-library/react`,
  `@testing-library/jest-dom`, `@testing-library/user-event`.
- **Remove (unused, verified by grep):** `expo`, `lottie-react`, `land_site/.expo/`,
  `Components/Cat_anime/`.
- **Scripts:** `"test": "vitest run"`. The deploy workflow runs `npm test` before `npm run build`.
- JS budget: GSAP core + ScrollTrigger + SplitText + Lenis ≈ 60 KB gzip.
- Routing, i18n provider, accessibility provider, EmailJS form and deployment are unchanged.

## 6. Error handling and edge cases

- Missing owner photo → mascot fallback (see §2).
- Project thumbnails hosted on GitHub fail to load → row still works as a text link;
  preview image hidden via `onError`.
- Language switch mid-page → `RevealText` re-splits; `Marquee` recomputes direction.
- Reduced motion toggled while on a page → Lenis destroyed/created, animations killed,
  content left fully visible.
- Keyboard users: all hover-only effects have focus equivalents (focus shows the row
  highlight, no floating image needed); curtain transition does not trap focus and
  moves focus to the new page's `<h1>`.

## 7. Testing

TDD with Vitest + Testing Library (jsdom; GSAP/Lenis mocked where timing matters).

- `useMotionAllowed`: OS-reduced → false; widget-reduced → false; both off → true; reacts to toggle.
- `TransitionLink`: motion off → navigates immediately; motion on → navigates after curtain.
- `Marquee`: base direction left in LTR, right in RTL.
- `HoverPreviewList`: renders one link per project with correct href; image hidden on error.
- Owner photo slot: falls back to mascot when `OWNER_PHOTO` fails.
- Routing: unknown path renders 404.
- i18n parity: every key in `en` exists in `ru` and `he` (catches missing new copy).
- Manual/visual: run the dev server, check each page in EN and HE, desktop and 400px
  width, motion on and off; Lighthouse on Home.

## 8. Delivery (one concern per PR, from `origin/main`, in `.worktrees/`)

1. Tooling + cleanup: Vitest setup, i18n parity test, remove unused deps, CI runs tests.
2. Visual foundation: tokens, fonts, owner config, section styles.
3. Motion foundation: `useMotionAllowed`, `SmoothScroll`, `RevealText`, `Magnetic`, `Marquee`.
4. Home redesign + big contact footer + `HoverPreviewList`.
5. Page transitions, collapsing nav, 404.
6. Works + case study.
7. Services / About / Contact + "I" voice copy in EN/RU/HE.

Each PR stays open for owner review; merging deploys to bluecat.cc.

## 9. Out of scope

WebGL/3D effects, a CMS, blog, new projects' content, a new logo. Owner photo is supplied by the owner.
