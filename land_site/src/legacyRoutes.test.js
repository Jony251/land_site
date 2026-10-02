import { describe, expect, it } from 'vitest'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { declFor, readRules } from './test/cssRules'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rules = readRules(`${__dirname}/App.css`)

// App.jsx imports the pages before ./App.css, so App.css loads last. Legacy route blocks
// there (padding-top: 80px, background-color: var(--bg)) override each page's own
// padding-block at equal specificity. The page stylesheets own that spacing now.
const LEGACY = ['contact-route', 'works-route', 'about-route', 'services-route']

describe('App.css legacy route blocks', () => {
  it.each(LEGACY)('declares no rule mentioning .%s (the page stylesheet owns it)', (cls) => {
    const token = new RegExp(`\\.${cls}(?![\\w-])`)
    const offenders = rules.filter((r) => r.selectors.some((s) => token.test(s)))
    expect(offenders.map((r) => r.selectors.join(', '))).toEqual([])
  })

  it('keeps the shared main and .landing-route spacing', () => {
    expect(declFor(rules, 'main', 'padding-top', { topLevelOnly: true })).toBe('80px')
    expect(declFor(rules, '.landing-route', 'padding-top', { topLevelOnly: true })).toBe('80px')
  })

  // Contact loses `.contact-route { min-height }`. It still fills the viewport because
  // .app is a 100vh flex column and main grows (flex: 1 0 auto).
  it('still lets main fill the viewport without a per-route min-height', () => {
    expect(declFor(rules, '.app', 'min-height', { topLevelOnly: true })).toBe('100vh')
    expect(declFor(rules, '.app', 'flex-direction', { topLevelOnly: true })).toBe('column')
    expect(declFor(rules, 'main', 'flex', { topLevelOnly: true })).toBe('1 0 auto')
  })

  it.each(['Works', 'Services'])('%s.css owns its route padding-block', (page) => {
    const pageRules = readRules(`${__dirname}/pages/${page}.css`)
    expect(
      declFor(pageRules, `.${page.toLowerCase()}-route`, 'padding-block', { topLevelOnly: true }),
    ).toBeDefined()
  })
})
