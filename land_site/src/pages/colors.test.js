import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const css = readFileSync(`${__dirname}/colors.css`, 'utf8')

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
