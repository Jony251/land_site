import { describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import Home from './Home'
import projects from './in_Work/projectsData'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('../motion/gsap', () => import('../test/gsapMock'))

describe('Home', () => {
  it('opens with the marquee, the offer as the page heading and a start button', () => {
    renderWithProviders(<Home />)
    expect(screen.getAllByText('Blue Cat — Web Studio —').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'I build sites people trust — and systems businesses run on.'
    )
    expect(screen.getByRole('link', { name: 'Start a project' })).toHaveAttribute('href', '/contact')
  })

  it('introduces the owner with photo and name', () => {
    renderWithProviders(<Home />)
    expect(screen.getByRole('img', { name: 'Eugeny' })).toBeInTheDocument()
    expect(screen.getByText('Eugeny')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'More about me' })).toHaveAttribute('href', '/about')
  })

  it('lists selected work, flagship projects first, linking to their case studies', () => {
    renderWithProviders(<Home />)
    const work = screen.getByRole('region', { name: 'Selected work' })
    const rows = within(work)
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href').startsWith('/works/'))
    expect(rows).toHaveLength(5)
    const flagship = projects.filter((p) => p.tier === 'flagship').map((p) => `/works/${p.id}`)
    expect(rows.slice(0, flagship.length).map((a) => a.getAttribute('href'))).toEqual(flagship)
    expect(within(work).getByRole('link', { name: 'All works' })).toHaveAttribute('href', '/works')
  })

  it('shows the five service levels linking to Services', () => {
    renderWithProviders(<Home />)
    const build = screen.getByRole('region', { name: 'What I build' })
    expect(within(build).getAllByRole('link')).toHaveLength(5)
  })

  it('speaks Hebrew', () => {
    localStorage.setItem('bc_lang', 'he')
    renderWithProviders(<Home />)
    expect(screen.getByRole('img', { name: 'יבגני' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'מה אני בונה' })).toBeInTheDocument()
  })
})
