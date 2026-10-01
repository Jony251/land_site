import { readFileSync } from 'node:fs'

const squash = (s) => s.replace(/\s+/g, ' ').trim()

// Minimal CSS rule reader for stylesheet contract tests.
// Returns [{ selectors: string[], decls: Map<prop, value>, media: string[] }]
// where `media` is the stack of enclosing at-rule preludes ([] = top level).
export function parseRules(css) {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const rules = []
  const stack = []
  let buf = ''
  for (const ch of src) {
    if (ch === '{') {
      const prelude = squash(buf)
      buf = ''
      if (prelude.startsWith('@')) {
        stack.push({ atRule: prelude })
      } else {
        stack.push({ selector: prelude })
      }
    } else if (ch === '}') {
      const top = stack.pop()
      if (top && top.selector !== undefined) {
        const decls = new Map()
        for (const part of buf.split(';')) {
          const i = part.indexOf(':')
          if (i === -1) continue
          decls.set(squash(part.slice(0, i)).toLowerCase(), squash(part.slice(i + 1)).toLowerCase())
        }
        rules.push({
          selectors: top.selector.split(',').map(squash),
          decls,
          media: stack.filter((s) => s.atRule).map((s) => s.atRule),
        })
      }
      buf = ''
    } else {
      buf += ch
    }
  }
  return rules
}

export function readRules(path) {
  return parseRules(readFileSync(path, 'utf8'))
}

// All rules whose selector list contains exactly `selector` (whitespace-normalized).
export function rulesFor(rules, selector, { topLevelOnly = false } = {}) {
  const wanted = squash(selector)
  return rules.filter(
    (r) => r.selectors.includes(wanted) && (!topLevelOnly || r.media.length === 0),
  )
}

// Value of `prop` for `selector` across matching rules (last declaration wins), or undefined.
export function declFor(rules, selector, prop, opts) {
  let value
  for (const r of rulesFor(rules, selector, opts)) {
    if (r.decls.has(prop)) value = r.decls.get(prop)
  }
  return value
}
