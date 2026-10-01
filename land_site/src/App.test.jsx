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
})
