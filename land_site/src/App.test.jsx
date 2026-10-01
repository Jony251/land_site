import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import App from './App'
import { renderWithProviders } from './test/renderWithProviders'

vi.mock('./motion/gsap', () => import('./test/gsapMock'))

describe('App layout', () => {
  it('shows the contact footer on regular pages', () => {
    renderWithProviders(<App />, { route: '/' })
    expect(screen.getByRole('heading', { level: 2, name: "Let's work together" })).toBeInTheDocument()
  })

  it('hides the contact footer on /contact', () => {
    renderWithProviders(<App />, { route: '/contact' })
    expect(screen.queryByRole('heading', { name: "Let's work together" })).toBeNull()
  })

  it('renders the 404 page for an unknown path', () => {
    renderWithProviders(<App />, { route: '/no-such-page' })
    expect(screen.getByRole('heading', { level: 1, name: 'This page wandered off' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back home' })).toHaveAttribute('href', '/')
  })

  it('renders the 404 page for an unknown project', () => {
    renderWithProviders(<App />, { route: '/works/no-such-project' })
    expect(screen.getByRole('heading', { level: 1, name: 'This page wandered off' })).toBeInTheDocument()
  })

  // PageTransition's focusHeading() targets `main h1`; the 404 heading must live in a <main>.
  it('puts the 404 heading inside <main> so focus lands on it after a transition', () => {
    renderWithProviders(<App />, { route: '/no-such-page' })
    const main = screen.getByRole('main')
    expect(main.querySelector('h1')).toHaveTextContent('This page wandered off')
  })

  it('translates the 404 page (Hebrew)', () => {
    localStorage.setItem('bc_lang', 'he')
    renderWithProviders(<App />, { route: '/works/no-such-project' })
    expect(screen.getByRole('heading', { level: 1, name: 'הדף הזה הלך לאיבוד' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'חזרה לדף הבית' })).toHaveAttribute('href', '/')
  })
})
