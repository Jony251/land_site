import { describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Works from './Works'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('../motion/gsap', () => import('../test/gsapMock'))

// The real projectsData already lists projects in tier order, so Works.test.jsx cannot tell
// whether Works actually sorts by tier. This fixture is deliberately out of tier order and has
// a different count per tier, so counts taken from the wrong list are caught too.
vi.mock('./in_Work/projectsData', () => {
  const P = (id, tier) => ({
    id,
    tier,
    titleKey: `fixture.${id}.title`,
    descKey: `fixture.${id}.desc`,
    thumbnail: `/${id}.jpg`,
  })
  return {
    default: [
      P('c1', 'craft'),
      P('p1', 'product'),
      P('c2', 'craft'),
      P('f1', 'flagship'),
      P('c3', 'craft'),
      P('p2', 'product'),
    ],
  }
})

const listedHrefs = () =>
  within(screen.getByRole('list'))
    .getAllByRole('link')
    .map((a) => a.getAttribute('href'))

const countOf = (button) => Number(button.textContent.match(/\d+/)?.[0])

describe('Works (structure contracts)', () => {
  it('sorts the full list by tier, stable inside a tier', () => {
    renderWithProviders(<Works />)
    expect(listedHrefs()).toEqual([
      '/works/f1',
      '/works/p1',
      '/works/p2',
      '/works/c1',
      '/works/c2',
      '/works/c3',
    ])
  })

  it('keeps source order inside a filtered tier and counts every tier from all projects', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Works />)
    const filters = screen.getByRole('group', { name: 'Filter projects' })
    const button = (name) => within(filters).getByRole('button', { name })

    await user.click(button(/Quick builds/))
    expect(listedHrefs()).toEqual(['/works/c1', '/works/c2', '/works/c3'])
    expect([/All/, /Systems/, /Business sites/, /Quick builds/].map((n) => countOf(button(n)))).toEqual([
      6, 1, 2, 3,
    ])
  })
})
