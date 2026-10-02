import { describe, expect, it } from 'vitest'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { declFor, readRules } from '../../test/cssRules'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rules = readRules(`${__dirname}/ServiceRows.comp.css`)

// Long Russian words ("сопровождение") overflowed the row at 320px. The title must be
// allowed to break, and its grid cell must be allowed to shrink below its min-content.
describe('service row titles on narrow screens', () => {
  it('lets long title words break, on every screen size', () => {
    const opts = { topLevelOnly: true }
    expect(declFor(rules, '.service-rows-title', 'overflow-wrap', opts)).toBe('anywhere')
    expect(declFor(rules, '.service-rows-title', 'hyphens', opts)).toBe('auto')
  })

  it('lets the text column shrink inside the row grid', () => {
    expect(declFor(rules, '.service-rows-text', 'min-width', { topLevelOnly: true })).toBe('0')
  })
})
