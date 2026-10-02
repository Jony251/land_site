import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import projects from '../pages/in_Work/projectsData'
import * as owner from '../config/owner'

// Asset budget fitness functions (Task 14b). Lighthouse mobile scored 73 because ~4.65 MB of
// images loaded on Home; these guards keep heavy, unused or broken assets from creeping back.

// jsdom replaces the global URL, so resolve the path from the import.meta.url string
const SRC = join(dirname(fileURLToPath(import.meta.url)), '..')
const APP = join(SRC, '..')
const PUBLIC = join(APP, 'public')
const ASSETS = join(SRC, 'assets')

const KB = 1024
const MAX_FILE = 400 * KB
const MAX_MASCOT = 100 * KB
const MASCOT_WIDTH = 512
const MAX_SCREENSHOT_WIDTH = 1200

const filesUnder = (dir) =>
  readdirSync(dir, { recursive: true })
    .map((rel) => String(rel).replaceAll('\\', '/'))
    .filter((rel) => statSync(join(dir, rel)).isFile())

const isLocal = (path) => typeof path === 'string' && path.startsWith('/')
const toPublicFile = (path) => join(PUBLIC, ...path.split('?')[0].split('/').filter(Boolean))

const projectPaths = [
  ...new Set(projects.flatMap((p) => [p.thumbnail, ...(p.images ?? [])]).filter(isLocal)),
]
const ownerPaths = Object.values(owner).filter(isLocal)

/** Reads PNG IHDR: width, height and whether pixels can carry alpha. */
const pngInfo = (buf) => {
  const signature = buf.subarray(0, 8).toString('hex')
  if (signature !== '89504e470d0a1a0a' || buf.toString('ascii', 12, 16) !== 'IHDR') return null
  const colorType = buf[25]
  // walk the chunk list (tRNS must precede IDAT) instead of scanning compressed bytes
  let hasTrns = false
  for (let at = 8; at + 8 <= buf.length; at += 12 + buf.readUInt32BE(at)) {
    const type = buf.toString('ascii', at + 4, at + 8)
    if (type === 'tRNS') hasTrns = true
    if (type === 'IDAT' || type === 'IEND') break
  }
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
    alpha: colorType === 4 || colorType === 6 || hasTrns,
  }
}

/** Reads a WebP container header and returns the canvas width, or null if it is not WebP. */
const webpWidth = (buf) => {
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null
  const chunk = buf.toString('ascii', 12, 16)
  if (chunk === 'VP8X') return 1 + buf.readUIntLE(24, 3)
  if (chunk === 'VP8L') return 1 + (buf.readUInt32LE(21) & 0x3fff)
  if (chunk === 'VP8 ') return buf.readUInt16LE(26) & 0x3fff
  return null
}

describe('public/ asset budget', () => {
  it.each(filesUnder(PUBLIC))('public/%s is at most 400 KB', (rel) => {
    const kb = Math.round(statSync(join(PUBLIC, rel)).size / KB)
    expect(kb, `public/${rel} weighs ${kb} KB`).toBeLessThanOrEqual(MAX_FILE / KB)
  })

  it('src/assets holds no image heavier than 400 KB (bundled images ship too)', () => {
    const heavy = filesUnder(ASSETS)
      .filter((rel) => statSync(join(ASSETS, rel)).size > MAX_FILE)
      .map((rel) => `src/assets/${rel}`)
    expect(heavy).toEqual([])
  })
})

describe('mascot image (curtain, footer cat, 404, photo fallback, favicon)', () => {
  const file = toPublicFile(owner.MASCOT_IMAGE)

  it('is at most 100 KB', () => {
    expect(statSync(file).size).toBeLessThanOrEqual(MAX_MASCOT)
  })

  it('is a real PNG, 512px wide, with an alpha channel', () => {
    expect(owner.MASCOT_IMAGE).toMatch(/\.png$/)
    const info = pngInfo(readFileSync(file))
    expect(info).not.toBeNull()
    expect(info.width).toBe(MASCOT_WIDTH)
    expect(info.alpha).toBe(true)
  })
})

describe('local image references resolve under public/', () => {
  it('projectsData lists local screenshots (guards against an empty check)', () => {
    expect(projectPaths.length).toBeGreaterThan(0)
  })

  it.each(projectPaths)('projectsData path %s exists', (path) => {
    expect(existsSync(toPublicFile(path)), `${path} is missing from public/`).toBe(true)
  })

  it.each(ownerPaths)('owner.js path %s exists', (path) => {
    expect(existsSync(toPublicFile(path)), `${path} is missing from public/`).toBe(true)
  })

  it('index.html points the favicon at an existing file', () => {
    const html = readFileSync(join(APP, 'index.html'), 'utf8')
    const icons = [...html.matchAll(/<link\b[^>]*\brel=["'][^"']*\bicon\b[^"']*["'][^>]*>/gi)]
    expect(icons.length).toBeGreaterThan(0)
    icons.forEach(([tag]) => {
      const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1]
      expect(href, tag).toMatch(/^\//)
      expect(existsSync(toPublicFile(href)), `${href} is missing from public/`).toBe(true)
    })
  })
})

describe('project screenshots are WebP', () => {
  it('no local projectsData path is a PNG', () => {
    expect(projectPaths.filter((path) => /\.png$/i.test(path))).toEqual([])
  })

  it.each(projectPaths.filter((path) => /\.webp$/i.test(path)))(
    '%s is a real WebP at most 1200px wide',
    (path) => {
      const width = webpWidth(readFileSync(toPublicFile(path)))
      expect(width, `${path} is not a WebP file`).not.toBeNull()
      expect(width).toBeGreaterThan(0)
      expect(width).toBeLessThanOrEqual(MAX_SCREENSHOT_WIDTH)
    }
  )

  it('public/ended_proj holds only WebP files (old PNGs deleted)', () => {
    expect(filesUnder(join(PUBLIC, 'ended_proj')).filter((rel) => !/\.webp$/i.test(rel))).toEqual([])
  })
})
