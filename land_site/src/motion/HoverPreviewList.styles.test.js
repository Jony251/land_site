import { describe, expect, it } from 'vitest'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { declFor, readRules, rulesFor } from '../test/cssRules'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rules = readRules(`${__dirname}/motion.css`)

// Russian titles contain long unbreakable words ("Кроссплатформенное" is ~292px at the
// phone font size). With `1fr` the title column cannot shrink below that word, so Home and
// /works scrolled sideways on phones (page 419px wide at 360/400px viewports).
describe('hover-preview rows on narrow screens', () => {
  it('lets the title column shrink below its longest word', () => {
    expect(declFor(rules, '.hpl-link', 'grid-template-columns', { topLevelOnly: true })).toMatch(
      /^minmax\(0,\s*1fr\)/
    )
  })

  it('never declares a title column that cannot shrink, at any breakpoint', () => {
    const values = rulesFor(rules, '.hpl-link')
      .map((r) => r.decls.get('grid-template-columns'))
      .filter(Boolean)
    expect(values.length).toBeGreaterThan(0)
    for (const value of values) expect(value).toMatch(/^minmax\(0,\s*1fr\)/)
  })

  it('breaks long title words instead of overflowing', () => {
    expect(declFor(rules, '.hpl-title', 'overflow-wrap', { topLevelOnly: true })).toBe('anywhere')
  })

  it('hyphenates titles (html lang is set per language)', () => {
    expect(declFor(rules, '.hpl-title', 'hyphens', { topLevelOnly: true })).toBe('auto')
  })
})

// Round 2: next to an `auto` meta column ("Web App / Система") the title column was only
// 93–226px on phones, so `overflow-wrap: anywhere` cut words mid-word ("Busine|ss").
// On phones the meta drops under the title: one full-width column.
describe('hover-preview rows on phones', () => {
  const PHONE = /^@media\s*\(\s*max-width:\s*480px\s*\)$/i

  it('stacks the meta under the title in a single column at max-width 480px', () => {
    const phoneRules = rules.filter(
      (r) => r.selectors.includes('.hpl-link') && r.media.length === 1 && PHONE.test(r.media[0])
    )
    const values = phoneRules.map((r) => r.decls.get('grid-template-columns')).filter(Boolean)
    expect(values.length).toBeGreaterThan(0)
    expect(values.at(-1)).toMatch(/^minmax\(0,\s*1fr\)$/)
  })
})
