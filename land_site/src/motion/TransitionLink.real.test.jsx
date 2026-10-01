import '../test/realGsapEnv'
import { describe, expect, it } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { PageTransitionProvider } from './PageTransition'
import TransitionLink from './TransitionLink'
import { renderWithProviders } from '../test/renderWithProviders'

// Real GSAP (no mock): proves onComplete really navigates and the curtain really ends hidden.
describe('TransitionLink with real GSAP', () => {
  it('runs the curtain in, navigates, then hides the curtain', async () => {
    renderWithProviders(
      <PageTransitionProvider>
        <Routes>
          <Route path="/" element={<main><h1>Home page</h1><TransitionLink to="/works" label="Works">Go</TransitionLink></main>} />
          <Route path="/works" element={<main><h1>Works page</h1></main>} />
        </Routes>
      </PageTransitionProvider>
    )
    fireEvent.click(screen.getByRole('link', { name: 'Go' }))
    expect(screen.getByRole('heading', { name: 'Home page' })).toBeInTheDocument()

    await screen.findByRole('heading', { name: 'Works page' }, { timeout: 3000 })
    const curtain = document.querySelector('.curtain')
    await waitFor(() => expect(curtain.style.visibility).toBe('hidden'), { timeout: 3000 })
    expect(curtain.style.transform).toContain('-100%')
  })
})
