import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { declFor, parseRules, readRules, rulesFor } from '../../test/cssRules'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rules = readRules(`${__dirname}/InWork.css`)
const appRules = readRules(`${__dirname}/../../App.css`)
const colorRules = parseRules(readFileSync(`${__dirname}/../colors.css`, 'utf8'))

const HC = 'html[data-high-contrast="true"]'
const noSpaces = (value) => value?.replace(/\s+/g, '')
const top = (selector, prop) => declFor(rules, selector, prop, { topLevelOnly: true })

// ── WCAG contrast helpers ──
const hexToRgb = (hex) => {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
}
const luminance = ([r, g, b]) => {
  const lin = (c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
// Text drawn with `opacity` over a solid background.
const blend = (fg, bg, opacity) => fg.map((c, i) => Math.round(c * opacity + bg[i] * (1 - opacity)))

const accentFor = (selector) => hexToRgb(declFor(colorRules, selector, '--accent'))
const colorOf = (value) => {
  if (value === '#fff' || value === '#ffffff' || value === '#000' || value === '#000000') return hexToRgb(value)
  throw new Error(`unexpected .case-next color: ${value}`)
}

// Reviewer measurement on fdf575f: RU titles ("Образовательная платформа", cross_II) made the
// page 407–423px wide at 320–400px viewports. The size declared on `.case-title` /
// `.case-next-title` never applied: App.css `.display` sets font-size at equal specificity
// and loads later. The size must sit on a more specific selector, and long words must break.
describe('case study titles on narrow screens', () => {
  it('App.css .display still sets a font-size (why the bare class selectors lose)', () => {
    expect(declFor(appRules, '.display', 'font-size')).toBeDefined()
  })

  it.each([
    ['.case-route .case-title', 'clamp(2.25rem,8vw,8rem)'],
    ['.case-route .case-next-title', 'clamp(2rem,7vw,7rem)'],
  ])('%s: font-size %s, breaks long words, hyphenates', (selector, size) => {
    expect(noSpaces(top(selector, 'font-size'))).toBe(size)
    expect(top(selector, 'overflow-wrap')).toBe('anywhere')
    expect(top(selector, 'hyphens')).toBe('auto')
  })

  it.each(['.case-title', '.case-next-title'])('declares no dead font-size on bare %s', (selector) => {
    expect(declFor(rules, selector, 'font-size')).toBeUndefined()
  })

  it.each(['.case-content > *', '.case-next > *'])('lets %s grid children shrink (min-width: 0)', (selector) => {
    expect(top(selector, 'min-width')).toMatch(/^0(px)?$/)
  })
})

describe('case hero height', () => {
  it('scales with the viewport width so phones do not get a mostly-empty tall hero', () => {
    expect(noSpaces(top('.case-hero', 'height'))).toBe('clamp(220px,min(70vh,62vw),760px)')
  })
})

describe('"next project" band contrast (WCAG AA, 4.5:1)', () => {
  const normalAccent = accentFor(':root')
  const hcAccent = accentFor(HC)

  it('shows the label at full opacity', () => {
    expect(top('.case-next-label', 'opacity')).toBe('1')
  })

  it('normal mode: label and title text meet 4.5:1 on the accent', () => {
    const fg = colorOf(top('.case-next', 'color'))
    const opacity = Number(top('.case-next-label', 'opacity') ?? 1)
    expect(contrast(fg, normalAccent)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(blend(fg, normalAccent, opacity), normalAccent)).toBeGreaterThanOrEqual(4.5)
  })

  it('high contrast: switches the band text to black', () => {
    expect(top(`${HC} .case-next`, 'color')).toMatch(/^#000(000)?$/)
  })

  it('high contrast: label and title text meet 4.5:1 on the high-contrast accent', () => {
    const value = top(`${HC} .case-next`, 'color') ?? top('.case-next', 'color')
    const fg = colorOf(value)
    const opacity = Number(top('.case-next-label', 'opacity') ?? 1)
    expect(contrast(fg, hcAccent)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(blend(fg, hcAccent, opacity), hcAccent)).toBeGreaterThanOrEqual(4.5)
  })
})

describe('Hebrew has no letter-case, so no tracking on the uppercase labels', () => {
  it.each([':lang(he) .case-label', ':lang(he) .case-next-label'])('%s: letter-spacing 0', (selector) => {
    expect(rulesFor(rules, selector, { topLevelOnly: true }).length).toBeGreaterThan(0)
    expect(top(selector, 'letter-spacing')).toMatch(/^0(px|em|rem)?$/)
  })
})
