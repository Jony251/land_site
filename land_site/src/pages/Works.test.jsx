import { describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import Works from './Works'
import projects from './in_Work/projectsData'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('../motion/gsap', () => import('../test/gsapMock'))

const listedHrefs = () =>
  within(screen.getByRole('list'))
    .getAllByRole('link')
    .map((a) => a.getAttribute('href'))

// The number shown on a filter button, e.g. "Systems 2" -> 2.
const countOf = (button) => Number(button.textContent.match(/\d+/)?.[0])

const tierCount = (tier) => projects.filter((p) => p.tier === tier).length

describe('Works', () => {
  it('lists every project as a link to its case study, flagship first', () => {
    renderWithProviders(<Works />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    const hrefs = listedHrefs()
    expect(hrefs).toHaveLength(projects.length)
    const firstFlagship = projects.find((p) => p.tier === 'flagship')
    expect(hrefs[0]).toBe(`/works/${firstFlagship.id}`)
  })

  it('filters by tier and marks the active filter', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Works />)
    const filters = screen.getByRole('group', { name: 'Filter projects' })
    const systems = within(filters).getByRole('button', { name: /Systems/ })
    await user.click(systems)
    expect(systems).toHaveAttribute('aria-pressed', 'true')
    expect(within(filters).getByRole('button', { name: /All/ })).toHaveAttribute('aria-pressed', 'false')
    const flagship = projects.filter((p) => p.tier === 'flagship').map((p) => `/works/${p.id}`)
    expect(listedHrefs()).toEqual(flagship)
  })

  it('shows a count on every filter', () => {
    renderWithProviders(<Works />)
    const filters = screen.getByRole('group', { name: 'Filter projects' })
    expect(within(filters).getByRole('button', { name: /All/ })).toHaveTextContent(String(projects.length))
    const craft = projects.filter((p) => p.tier === 'craft').length
    expect(within(filters).getByRole('button', { name: /Quick builds/ })).toHaveTextContent(String(craft))
  })

  it('starts on "All" with exactly one pressed filter among four', () => {
    renderWithProviders(<Works />)
    const filters = screen.getByRole('group', { name: 'Filter projects' })
    const buttons = within(filters).getAllByRole('button')
    expect(buttons).toHaveLength(4)
    expect(buttons.map((b) => b.getAttribute('aria-pressed'))).toEqual(['true', 'false', 'false', 'false'])
    expect(buttons[0]).toHaveAccessibleName(/All/)
  })

  it('shows the exact per-tier counts, and they do not change when a filter is applied', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Works />)
    const filters = screen.getByRole('group', { name: 'Filter projects' })
    const button = (name) => within(filters).getByRole('button', { name })
    const expected = {
      all: projects.length,
      flagship: tierCount('flagship'),
      product: tierCount('product'),
      craft: tierCount('craft'),
    }
    const counts = () => ({
      all: countOf(button(/All/)),
      flagship: countOf(button(/Systems/)),
      product: countOf(button(/Business sites/)),
      craft: countOf(button(/Quick builds/)),
    })
    expect(counts()).toEqual(expected)
    await user.click(button(/Quick builds/))
    expect(counts()).toEqual(expected)
  })

  it('switches between filters and back to the full list', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Works />)
    const filters = screen.getByRole('group', { name: 'Filter projects' })
    const business = within(filters).getByRole('button', { name: /Business sites/ })
    const all = within(filters).getByRole('button', { name: /All/ })

    await user.click(business)
    expect(listedHrefs()).toEqual(projects.filter((p) => p.tier === 'product').map((p) => `/works/${p.id}`))
    expect(business).toHaveAttribute('aria-pressed', 'true')

    await user.click(all)
    expect(listedHrefs()).toHaveLength(projects.length)
    expect(all).toHaveAttribute('aria-pressed', 'true')
    expect(business).toHaveAttribute('aria-pressed', 'false')
  })

  it('speaks Hebrew: filter group and filter labels', () => {
    localStorage.setItem('bc_lang', 'he')
    renderWithProviders(<Works />)
    const filters = screen.getByRole('group', { name: 'סינון פרויקטים' })
    expect(within(filters).getByRole('button', { name: /הכל/ })).toHaveAttribute('aria-pressed', 'true')
    expect(within(filters).getByRole('button', { name: /מערכות/ })).toBeInTheDocument()
    expect(within(filters).getByRole('button', { name: /אתרים לעסקים/ })).toBeInTheDocument()
    expect(within(filters).getByRole('button', { name: /פרויקטים מהירים/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('העבודות שלנו')
  })
})

// Fitness: navigation must go through TransitionLink (curtain), never an imperative navigate().
describe('Works (navigation fitness)', () => {
  it('does not use useNavigate, which would bypass the page transition', () => {
    const file = join(dirname(fileURLToPath(import.meta.url)), 'Works.jsx')
    expect(readFileSync(file, 'utf8')).not.toMatch(/\buseNavigate\b/)
  })
})
