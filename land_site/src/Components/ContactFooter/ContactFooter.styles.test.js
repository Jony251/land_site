import { describe, expect, it } from 'vitest'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { declFor, readRules, rulesFor } from '../../test/cssRules'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rules = readRules(`${__dirname}/ContactFooter.comp.css`)
const CAT = '.contact-footer-cat'

describe('waving cat placement', () => {
  // The accessibility widget button is fixed at physical left/bottom in every
  // language, so the cat must stay physically on the right, also in Hebrew (RTL).
  it('sits on the physical right', () => {
    expect(declFor(rules, CAT, 'right')).toBe('1.5rem')
  })

  it('does not use logical inline insets or left (would flip under the a11y widget in RTL)', () => {
    for (const rule of rulesFor(rules, CAT)) {
      for (const prop of rule.decls.keys()) {
        expect(prop).not.toMatch(/^inset-inline/)
        expect(prop).not.toBe('left')
        expect(prop).not.toBe('inset')
      }
    }
  })
})

describe('waving cat motion', () => {
  it('stops waving when the in-site reduce-motion toggle is on', () => {
    expect(
      declFor(rules, `html[data-reduce-motion="true"] ${CAT}`, 'animation', { topLevelOnly: true }),
    ).toBe('none')
  })

  it('stops waving for the OS prefers-reduced-motion setting', () => {
    const reduced = rulesFor(rules, CAT).filter((r) =>
      r.media.some((m) => /prefers-reduced-motion:\s*reduce/.test(m)),
    )
    expect(reduced.some((r) => r.decls.get('animation') === 'none')).toBe(true)
  })
})
