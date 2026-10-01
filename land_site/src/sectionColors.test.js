import { describe, expect, it } from 'vitest'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { declFor, readRules } from './test/cssRules'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rules = readRules(`${__dirname}/App.css`)

// .page-content sets color: var(--text) (ink). Inside a themed section that would
// paint ink text on the ink background, so themed sections must win back the colour.
describe('section themes and .page-content', () => {
  it('still gives plain .page-content the theme text colour', () => {
    expect(declFor(rules, '.page-content', 'color', { topLevelOnly: true })).toBe('var(--text)')
  })

  it.each(['.section-ink', '.section-paper'])(
    'lets %s colour its .page-content (color: inherit)',
    (section) => {
      expect(
        declFor(rules, `${section} .page-content`, 'color', { topLevelOnly: true }),
      ).toBe('inherit')
    },
  )

  it('keeps the section colours themselves', () => {
    expect(declFor(rules, '.section-ink', 'color', { topLevelOnly: true })).toBe('var(--paper)')
    expect(declFor(rules, '.section-ink', 'background', { topLevelOnly: true })).toBe('var(--ink)')
  })
})

// High contrast re-points --accent to a light blue (#7aa2ff); white text on it is ~2.5:1.
describe('.btn-round in high-contrast mode', () => {
  it('uses black text on the light accent', () => {
    const color = declFor(rules, 'html[data-high-contrast="true"] .btn-round', 'color', {
      topLevelOnly: true,
    })
    expect(['#000', '#000000', 'black']).toContain(color)
  })
})
