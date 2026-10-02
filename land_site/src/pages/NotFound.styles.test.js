import { describe, expect, it } from 'vitest'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { declFor, readRules } from '../test/cssRules'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rules = readRules(`${__dirname}/NotFound.css`)
const appRules = readRules(`${__dirname}/../App.css`)

// `.notfound-title` also carries `.display` (App.css, same specificity, loaded later), so a
// font-size on the bare class never applied. The size must sit on a more specific selector.
describe('404 title size', () => {
  it('App.css .display still sets a font-size (why the bare class selector loses)', () => {
    expect(declFor(appRules, '.display', 'font-size')).toBeDefined()
  })

  it('sets the title size on .notfound-route .notfound-title, keeping its clamp values', () => {
    const value = declFor(rules, '.notfound-route .notfound-title', 'font-size', { topLevelOnly: true })
    expect(value?.replace(/\s+/g, '')).toBe('clamp(2.75rem,8vw,7rem)')
  })

  it('declares no dead font-size on bare .notfound-title', () => {
    expect(declFor(rules, '.notfound-title', 'font-size')).toBeUndefined()
  })
})
