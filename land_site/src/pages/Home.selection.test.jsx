import { describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import Home from './Home'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('../motion/gsap', () => import('../test/gsapMock'))

// The real projectsData already lists flagship projects first, so Home.test.jsx cannot tell
// whether Home actually sorts by tier. This fixture is deliberately out of tier order.
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
      P('p2', 'product'),
      P('f2', 'flagship'),
      P('c3', 'craft'),
    ],
  }
})

describe('Home (structure contracts)', () => {
  it('sorts all projects by tier before taking the top five', () => {
    renderWithProviders(<Home />)
    const work = screen.getByRole('region', { name: 'Selected work' })
    const hrefs = within(work)
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'))
      .filter((href) => href.startsWith('/works/'))
    expect(hrefs).toEqual(['/works/f1', '/works/f2', '/works/p1', '/works/p2', '/works/c1'])
  })

  it('alternates section tones ink, paper, ink, paper so the ink footer follows a paper section', () => {
    const { container } = renderWithProviders(<Home />)
    const sections = [...container.firstElementChild.children].filter((el) => el.tagName === 'SECTION')
    const tones = sections.map((s) =>
      s.classList.contains('section-ink') ? 'ink' : s.classList.contains('section-paper') ? 'paper' : 'none'
    )
    expect(tones).toEqual(['ink', 'paper', 'ink', 'paper'])
  })
})
