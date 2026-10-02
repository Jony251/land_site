import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { declFor, readRules, rulesFor } from './test/cssRules'

const __dirname = dirname(fileURLToPath(import.meta.url))
const HC = 'html[data-high-contrast="true"]'

// ── Every stylesheet in src, so a rule counts wherever the implementer puts it ──
const cssFiles = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return cssFiles(path)
    return name.endsWith('.css') ? [path] : []
  })
const allRules = cssFiles(__dirname).flatMap((file) =>
  readRules(file).map((rule) => ({ ...rule, file: file.slice(__dirname.length + 1) })),
)
const fileRules = (relative) => readRules(join(__dirname, relative))

// ── Minimal cascade: selector specificity, then "winning" declaration for an element ──
// Supports what this codebase uses: ids, classes, attributes, pseudo-classes, :not()/:is()
// (argument specificity), :where() (zero), pseudo-elements and type selectors.
const specificity = (selector) => {
  let s = selector
  const total = [0, 0, 0]
  const add = (v) => v.forEach((n, i) => (total[i] += n))
  s = s.replace(/:where\((?:[^()]|\([^()]*\))*\)/g, ' ')
  s = s.replace(/:(?:not|is|has)\(((?:[^()]|\([^()]*\))*)\)/g, (_, inner) => {
    const max = inner
      .split(',')
      .map(specificity)
      .sort((a, b) => b[0] - a[0] || b[1] - a[1] || b[2] - a[2])[0]
    add(max)
    return ' '
  })
  s = s.replace(/:lang\([^)]*\)/g, () => (add([0, 1, 0]), ' '))
  total[0] += (s.match(/#[\w-]+/g) || []).length
  total[1] += (s.match(/\.[\w-]+/g) || []).length
  total[1] += (s.match(/\[[^\]]*\]/g) || []).length
  s = s.replace(/\[[^\]]*\]/g, ' ')
  total[2] += (s.match(/::[\w-]+/g) || []).length
  s = s.replace(/::[\w-]+/g, ' ')
  total[1] += (s.match(/:[\w-]+/g) || []).length
  s = s.replace(/[#.:][\w-]+/g, ' ')
  total[2] += (s.match(/(^|[\s>+~])[a-z][\w-]*/gi) || []).length
  return total
}
const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]

const safeMatches = (el, selector) => {
  if (/:(hover|focus|focus-visible|focus-within|active|visited)\b|::/.test(selector)) return false
  try {
    return el.matches(selector)
  } catch {
    return false
  }
}

// Top-level declaration of `prop` that wins for `el`. Equal-specificity rules with different
// values are reported as ambiguous: the result would depend on stylesheet load order.
const winning = (el, prop) => {
  const candidates = []
  for (const rule of allRules) {
    if (rule.media.length || !rule.decls.has(prop)) continue
    for (const selector of rule.selectors) {
      if (safeMatches(el, selector)) {
        candidates.push({ spec: specificity(selector), value: rule.decls.get(prop), selector, file: rule.file })
      }
    }
  }
  if (!candidates.length) return undefined
  candidates.sort((a, b) => cmp(b.spec, a.spec))
  const top = candidates.filter((c) => cmp(c.spec, candidates[0].spec) === 0)
  const values = new Set(top.map((c) => c.value))
  if (values.size > 1) {
    throw new Error(`ambiguous ${prop}: ${top.map((c) => `${c.file} "${c.selector}" → ${c.value}`).join(' | ')}`)
  }
  return candidates[0]
}

// Custom property as seen by `el` (inherited from the nearest ancestor that sets it), var()-resolved.
const token = (el, name) => {
  for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
    const hit = winning(node, name)
    if (hit) return resolve(node, hit.value)
  }
  return undefined
}
const resolve = (el, value) =>
  value.replace(/var\((--[\w-]+)\)/g, (_, name) => {
    const v = token(el, name)
    if (v === undefined) throw new Error(`unresolved ${name}`)
    return v
  })

// ── Colour maths (WCAG 2.x) ──
const parseColor = (value) => {
  const v = value.trim().toLowerCase()
  if (v === 'black') return [0, 0, 0, 1]
  if (v === 'white') return [255, 255, 255, 1]
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/)
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1]
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).concat(1)
  }
  const rgb = v.match(/^rgba?\(([^)]+)\)$/)
  if (rgb) {
    const [r, g, b, a = '1'] = rgb[1].split(/[\s,/]+/).filter(Boolean)
    return [Number(r), Number(g), Number(b), Number(a)]
  }
  throw new Error(`unsupported colour: ${value}`)
}
const over = (fg, bg) => {
  const a = fg[3]
  return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a)).concat(1)
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
const withOpacity = (fg, opacity) => [fg[0], fg[1], fg[2], fg[3] * opacity]

// ── DOM fixture: a paper section and an ink section, as the pages render them ──
const mount = (highContrast) => {
  if (highContrast) document.documentElement.setAttribute('data-high-contrast', 'true')
  else document.documentElement.removeAttribute('data-high-contrast')
  document.body.innerHTML = `
    <main class="contact-route section-paper" id="paper">
      <p id="paper-text">text</p>
      <section class="home-intro section-paper"><a class="home-intro-link" id="intro-link" href="/about">More</a></section>
      <div class="case-links"><a id="case-link" href="https://example.com">Live</a></div>
      <a class="btn-round" id="round" href="/contact">Start</a>
    </main>
    <section class="home-work section-ink" id="ink"><p id="ink-text">text</p></section>
    <div class="a11y-widget"><button class="a11y-fab" id="fab" type="button">A</button></div>
  `
}
const $ = (id) => document.getElementById(id)

afterEach(() => {
  document.documentElement.removeAttribute('data-high-contrast')
  document.body.innerHTML = ''
})

describe('cascade helper sanity (so the contracts below cannot pass vacuously)', () => {
  it('computes specificity like the spec', () => {
    expect(specificity('.a')).toEqual([0, 1, 0])
    expect(specificity('html[data-high-contrast="true"] .section-paper')).toEqual([0, 2, 1])
    expect(specificity('.case-links a')).toEqual([0, 1, 1])
    expect(specificity('.section-paper a:not(.btn):not(.btn-round)')).toEqual([0, 3, 1])
    expect(specificity(':lang(he) .about-name')).toEqual([0, 2, 0])
  })

  it('normal mode: paper text is ink, links are the brand accent', () => {
    mount(false)
    expect(token($('paper-text'), '--text')).toBe('#141517')
    expect(token($('paper-text'), '--accent')).toBe('#3d5afe')
    expect(resolve($('intro-link'), winning($('intro-link'), 'color').value)).toBe('#3d5afe')
  })

  it('high contrast on ink sections keeps the white-on-black theme', () => {
    mount(true)
    expect(token($('ink-text'), '--text')).toBe('#ffffff')
    expect(token($('ink-text'), '--bg')).toBe('#000000')
  })
})

// Reviewer (Phase D, browser-measured): in high contrast the global tokens turn white, but paper
// pages stay paper, so legacy components painting with var(--text)/--muted/--border/--surface
// render white on paper (1.06–1.11:1).
describe('high contrast on paper sections: dark tokens', () => {
  beforeEach(() => mount(true))

  const paper = () => parseColor(token($('paper-text'), '--paper'))

  it('re-points the text tokens on .section-paper (ruled values)', () => {
    const el = $('paper-text')
    expect(token(el, '--text')).toMatch(/^(#000|#000000|black)$/)
    expect(parseColor(token(el, '--muted'))).toEqual([0, 0, 0, 0.84])
    expect(parseColor(token(el, '--border'))).toEqual([0, 0, 0, 0.4])
    expect(parseColor(token(el, '--surface'))).toEqual([0, 0, 0, 0.06])
    expect(parseColor(token(el, '--surface-2'))).toEqual([0, 0, 0, 0.1])
  })

  it('declares them on a high-contrast-scoped .section-paper selector', () => {
    const hit = winning($('paper'), '--text')
    expect(hit, 'a rule declaring --text that matches the paper section').toBeDefined()
    expect(hit.selector).toContain(HC)
    expect(hit.selector).toContain('.section-paper')
  })

  it('--text and --muted reach 4.5:1 on paper, also on --surface and --surface-2 fills', () => {
    const el = $('paper-text')
    const text = parseColor(token(el, '--text'))
    const muted = parseColor(token(el, '--muted'))
    for (const fillName of [null, '--surface', '--surface-2']) {
      const bg = fillName ? over(parseColor(token(el, fillName)), paper()) : paper()
      expect(contrast(over(text, bg), bg), `--text on ${fillName ?? 'paper'}`).toBeGreaterThanOrEqual(4.5)
      expect(contrast(over(muted, bg), bg), `--muted on ${fillName ?? 'paper'}`).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('does not redefine --accent on paper (btn-round / case-next put #000 text on it)', () => {
    expect(token($('paper-text'), '--accent')).toBe('#7aa2ff')
    const rounds = allRules.filter((r) => r.selectors.some((s) => s.includes(HC) && s.includes('.section-paper')))
    expect(rounds.length).toBeGreaterThan(0)
    for (const r of rounds) expect(r.decls.has('--accent'), r.selectors.join(', ')).toBe(false)
  })

  it('leaves paper sections alone outside high contrast', () => {
    mount(false)
    expect(token($('paper-text'), '--text')).toBe('#141517')
    expect(token($('paper-text'), '--surface')).toBe('#ffffff')
  })
})

describe('high contrast on paper sections: accent links', () => {
  beforeEach(() => mount(true))

  it.each([
    ['.home-intro-link', 'intro-link'],
    ['.case-links a', 'case-link'],
  ])('%s is black and underlined', (_, id) => {
    const el = $(id)
    const color = winning(el, 'color')
    expect(color, 'a winning color rule').toBeDefined()
    expect(resolve(el, color.value)).toMatch(/^(#000|#000000|black)$/)
    const decoration = winning(el, 'text-decoration') ?? winning(el, 'text-decoration-line')
    expect(decoration?.value ?? '').toContain('underline')
  })

  it.each([
    ['.home-intro-link', 'intro-link'],
    ['.case-links a', 'case-link'],
  ])('%s reaches 4.5:1 on paper', (_, id) => {
    const el = $(id)
    const fg = parseColor(resolve(el, winning(el, 'color').value))
    const bg = parseColor(token(el, '--paper'))
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps .btn-round as black text on the high-contrast accent (not re-coloured by the link rule)', () => {
    const el = $('round')
    expect(resolve(el, winning(el, 'color').value)).toMatch(/^(#000|#000000|black)$/)
    expect(resolve(el, winning(el, 'background').value)).toBe('#7aa2ff')
  })
})

describe('high contrast: the accessibility toggle stays visible on paper and on ink', () => {
  beforeEach(() => mount(true))

  const fab = () => $('fab')
  const value = (prop) => {
    const hit = winning(fab(), prop)
    return hit && resolve(fab(), hit.value)
  }

  it('is a black disc with white text and a 2px white border', () => {
    expect(value('background') ?? value('background-color')).toMatch(/^(#000|#000000|black)$/)
    expect(value('color')).toMatch(/^(#fff|#ffffff|white)$/)
    expect(value('border')).toMatch(/^2px solid (#fff|#ffffff|white)$/)
  })

  it('meets 4.5:1 for its label and 3:1 against paper (fill) and ink (border)', () => {
    const bg = parseColor(value('background') ?? value('background-color'))
    const fg = parseColor(value('color'))
    expect(value('border')).toMatch(/^2px solid /)
    const border = parseColor(value('border').replace(/^2px solid /, ''))
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(bg, parseColor('#F4F3F0'))).toBeGreaterThanOrEqual(3)
    expect(contrast(border, parseColor('#141517'))).toBeGreaterThanOrEqual(3)
    expect(contrast(border, parseColor('#000000'))).toBeGreaterThanOrEqual(3)
  })
})

// Lighthouse color-contrast failure: the row numbers sat at opacity .5 (ink on paper ≈ 3.4:1).
describe('ServiceRows numbers contrast (they sit on paper on Home and Services)', () => {
  const rules = fileRules('Components/ServiceRows/ServiceRows.comp.css')
  const opacity = () => Number(declFor(rules, '.service-rows-num', 'opacity', { topLevelOnly: true }) ?? 1)

  it('uses the ruled opacity 0.7', () => {
    expect(opacity()).toBeCloseTo(0.7, 5)
  })

  it('normal mode: ink at that opacity reaches 4.5:1 on paper', () => {
    const paper = parseColor('#F4F3F0')
    const fg = over(withOpacity(parseColor('#141517'), opacity()), paper)
    expect(contrast(fg, paper)).toBeGreaterThanOrEqual(4.5)
  })

  it('high contrast: the paper --text at that opacity reaches 4.5:1 on paper', () => {
    mount(true)
    const paper = parseColor(token($('paper-text'), '--paper'))
    const text = parseColor(token($('paper-text'), '--text'))
    const fg = over(withOpacity(text, opacity()), paper)
    expect(contrast(fg, paper)).toBeGreaterThanOrEqual(4.5)
  })
})

// Phones (About): `.tech-strip-inner { flex-shrink: 0 }` kept the wrapping row at its max-content
// width inside the overflow-hidden strip, clipping 6 of 8 pills.
describe('TechStrip wraps inside narrow screens', () => {
  const rules = fileRules('Components/TechStrip/TechStrip.comp.css')
  const top = (prop) => declFor(rules, '.tech-strip-inner', prop, { topLevelOnly: true })

  it('lets the pill row shrink to the strip width', () => {
    expect(top('flex-shrink')).toBe('1')
    expect(top('min-width')).toMatch(/^0(px)?$/)
    expect(top('flex-wrap')).toBe('wrap')
  })

  it('no media query puts flex-shrink: 0 back', () => {
    for (const r of rulesFor(rules, '.tech-strip-inner')) {
      expect(r.decls.get('flex-shrink'), r.media.join(' ')).not.toBe('0')
    }
  })
})

describe('Hebrew has no letter-case, so no tracking on the About name label', () => {
  const rules = fileRules('pages/About.css')

  it(':lang(he) .about-name: letter-spacing 0', () => {
    expect(rulesFor(rules, ':lang(he) .about-name', { topLevelOnly: true }).length).toBeGreaterThan(0)
    expect(declFor(rules, ':lang(he) .about-name', 'letter-spacing', { topLevelOnly: true })).toMatch(
      /^0(px|em|rem)?$/,
    )
  })

  it('beats the base .about-name tracking for a Hebrew document', () => {
    document.documentElement.setAttribute('lang', 'he')
    document.body.innerHTML = '<p class="about-name" id="name">יבגני</p>'
    try {
      expect(winning($('name'), 'letter-spacing').value).toMatch(/^0(px|em|rem)?$/)
    } finally {
      document.documentElement.removeAttribute('lang')
    }
  })
})
