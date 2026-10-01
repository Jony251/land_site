import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// jsdom replaces the global URL, so resolve the path from the import.meta.url string
const SRC = join(dirname(fileURLToPath(import.meta.url)), '..')
const ROUTER_LINK = /import\s*\{[^}]*\b(Link|NavLink)\b[^}]*\}\s*from\s*['"]react-router-dom['"]/
const ALLOWED = new Set([join('motion', 'TransitionLink.jsx')])

const sourceFiles = readdirSync(SRC, { recursive: true }).filter(
  (file) => /\.jsx?$/.test(file) && !/\.test\.jsx?$/.test(file) && !ALLOWED.has(file)
)

describe('internal links', () => {
  it.each(sourceFiles)('%s uses TransitionLink, not the router Link', (file) => {
    expect(readFileSync(join(SRC, file), 'utf8')).not.toMatch(ROUTER_LINK)
  })
})
