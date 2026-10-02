import { describe, expect, it } from 'vitest'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readRules, rulesFor } from '../../test/cssRules'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sectionRules = readRules(join(__dirname, 'ContactSection.comp.css'))
const formRules = readRules(join(__dirname, '../ContactForm/ContactForm.comp.css'))
const indexRules = readRules(join(__dirname, '../../index.css'))

const isNarrow = (media) => media.some((m) => /max-width:\s*920px/.test(m))

// /contact scrolled sideways on phones (RU: 381px wide at 320). A `1fr` track is
// `minmax(auto, 1fr)`, so it cannot shrink below the form card's min-content.
describe('contact section narrow layout', () => {
  it('lets the single narrow column shrink (track starts with minmax(0,)', () => {
    const narrow = rulesFor(sectionRules, '.contact-section-inner').filter((r) => isNarrow(r.media))
    const values = narrow
      .map((r) => r.decls.get('grid-template-columns'))
      .filter((v) => v !== undefined)
    expect(values.length).toBeGreaterThan(0)
    for (const v of values) expect(v.replace(/\s+/g, '')).toMatch(/^minmax\(0,/)
  })

  it('lets the form buttons wrap instead of widening the card', () => {
    const values = rulesFor(formRules, '.form-buttons', { topLevelOnly: true })
      .map((r) => r.decls.get('flex-wrap'))
      .filter((v) => v !== undefined)
    expect(values.at(-1)).toBe('wrap')
  })

  it('keeps the form buttons centred', () => {
    const values = rulesFor(formRules, '.form-buttons', { topLevelOnly: true })
      .map((r) => r.decls.get('justify-content'))
      .filter((v) => v !== undefined)
    expect(values.at(-1)).toBe('center')
  })
})

// `body { min-width: 320px }` adds sideways scroll whenever the viewport (minus a
// classic scrollbar) is narrower than 320px.
describe('body width', () => {
  it('sets no positive min-width on body', () => {
    for (const r of rulesFor(indexRules, 'body')) {
      const v = r.decls.get('min-width')
      if (v === undefined) continue
      expect(parseFloat(v) || 0).toBe(0)
    }
  })
})
