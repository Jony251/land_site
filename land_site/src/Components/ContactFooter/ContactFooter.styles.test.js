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

// The cat is absolutely positioned at the bottom-right. In RTL the copyright line
// starts on the right, so the footer must reserve room for the whole cat below it:
// bottom padding = cat bottom offset + cat height (square image: height = width) + gap.
describe('footer leaves room for the cat', () => {
  // Split a CSS value on top-level spaces (not inside parentheses).
  const topLevelParts = (value) => {
    const parts = []
    let depth = 0
    let cur = ''
    for (const ch of value) {
      if (ch === '(') depth += 1
      if (ch === ')') depth -= 1
      if (ch === ' ' && depth === 0) {
        if (cur) parts.push(cur)
        cur = ''
      } else cur += ch
    }
    if (cur) parts.push(cur)
    return parts
  }

  it('bottom padding includes the cat offset and the cat size', () => {
    const catWidth = declFor(rules, CAT, 'width', { topLevelOnly: true })
    const catBottom = declFor(rules, CAT, 'inset-block-end', { topLevelOnly: true })
    expect(catWidth).toBeTruthy()
    expect(catBottom).toBeTruthy()

    const padding = declFor(rules, '.contact-footer', 'padding-block', { topLevelOnly: true })
    const parts = topLevelParts(String(padding))
    expect(parts).toHaveLength(2)
    const end = parts[1]
    expect(end).toMatch(/^calc\(/)
    expect(end).toContain(catWidth)
    expect(end).toContain(catBottom)
  })

  it('no other rule shrinks the footer bottom padding', () => {
    for (const r of rulesFor(rules, '.contact-footer')) {
      for (const prop of ['padding', 'padding-bottom', 'padding-block-end']) {
        expect(r.decls.has(prop)).toBe(false)
      }
    }
  })
})
