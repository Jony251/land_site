import { describe, expect, it } from 'vitest'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { declFor, readRules } from '../../test/cssRules'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rules = readRules(`${__dirname}/Nav.comp.css`)
const appRules = readRules(`${__dirname}/../../App.css`)

// The full-screen menu is an ink section; the shared LanguageSwitcher paints a white
// (--surface) pill with inherited paper text there (~1.1:1) and stretches to full width.
// On mobile it is the only language switcher, so it must read on ink.
describe('language switcher inside the menu', () => {
  const SWITCH = '.site-menu .lang-switch'
  const ACTIVE = '.site-menu .lang-btn.active'

  it('sits at its natural width instead of stretching across the grid', () => {
    expect(declFor(rules, SWITCH, 'justify-self', { topLevelOnly: true })).toBe('start')
  })

  it('drops the white surface so paper text reads on ink', () => {
    expect(declFor(rules, SWITCH, 'background', { topLevelOnly: true })).toBe('transparent')
  })

  it('draws its border from the paper colour', () => {
    expect(String(declFor(rules, SWITCH, 'border-color', { topLevelOnly: true }))).toContain(
      'var(--paper)',
    )
  })

  it('marks the active language as an inverted paper chip', () => {
    expect(declFor(rules, ACTIVE, 'background', { topLevelOnly: true })).toBe('var(--paper)')
    expect(declFor(rules, ACTIVE, 'color', { topLevelOnly: true })).toBe('var(--ink)')
  })
})

// The floating menu button sits over ink and paper sections; a paper outline vanishes
// on paper. Same double-ring contract as .btn-round (see src/sectionColors.test.js).
describe('.nav-menu-button focus ring', () => {
  const FOCUS = '.nav-menu-button:focus-visible'
  const focusRules = rules.filter((r) => r.selectors.some((s) => s.endsWith(FOCUS)))

  it('never derives the ring from currentColor or the paper colour (any theme or override)', () => {
    expect(focusRules.length).toBeGreaterThan(0)
    for (const r of focusRules) {
      for (const [prop, value] of r.decls) {
        if (/^(outline|box-shadow)/.test(prop)) {
          expect(value).not.toContain('currentcolor')
          expect(value).not.toContain('var(--paper)')
        }
      }
    }
  })

  it('draws a light outline', () => {
    const outline = declFor(rules, FOCUS, 'outline', { topLevelOnly: true })
    expect(String(outline)).toMatch(/^3px solid (#fff|#ffffff|white)$/)
  })

  it('adds a dark box-shadow ring around the outline', () => {
    const shadow = declFor(rules, FOCUS, 'box-shadow', { topLevelOnly: true })
    expect(String(shadow)).toMatch(/^0 0 0 \d+(\.\d+)?px (#000|#000000|black)$/)
  })
})

// High contrast re-points --accent to #7aa2ff; white bars on it are ~2.5:1.
describe('.nav-menu-button in high-contrast mode', () => {
  it('draws black hamburger bars on the light accent', () => {
    const bars = declFor(rules, 'html[data-high-contrast="true"] .nav-menu-button span', 'background', {
      topLevelOnly: true,
    })
    expect(['#000', '#000000', 'black']).toContain(bars)
  })
})

// html.menu-open { overflow: hidden } removes the scrollbar; without a reserved gutter the
// fixed menu button (inset-inline-end) jumps sideways by the scrollbar width.
describe('scroll lock without layout shift', () => {
  it('reserves the scrollbar gutter on the root', () => {
    expect(declFor(appRules, 'html', 'scrollbar-gutter', { topLevelOnly: true })).toBe('stable')
  })
})

// scrollbar-gutter: stable keeps a ~15px strip beside the open full-screen menu; it shows the
// root background, so the root must paint ink while the menu is open (not a paper strip).
describe('open menu root', () => {
  it('locks scrolling on the root', () => {
    expect(declFor(appRules, 'html.menu-open', 'overflow', { topLevelOnly: true })).toBe('hidden')
  })

  it('paints the root ink so the reserved gutter matches the menu', () => {
    expect(declFor(appRules, 'html.menu-open', 'background', { topLevelOnly: true })).toBe('var(--ink)')
  })
})
