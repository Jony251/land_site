import '../test/realGsapEnv'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { PageTransitionProvider } from './PageTransition'
import TransitionLink from './TransitionLink'
import { renderWithProviders } from '../test/renderWithProviders'
import { AccessibilityProvider } from '../a11y/AccessibilityProvider'
import { LanguageProvider } from '../i18n/LanguageProvider'

const BackButton = () => {
  const navigate = useNavigate()
  return (
    <button type="button" onClick={() => navigate(-1)}>
      Back
    </button>
  )
}

/** Renders the provider with a router history of `entries`, starting on the last one. */
const renderWithHistory = (entries) =>
  render(
    <AccessibilityProvider>
      <LanguageProvider>
        <MemoryRouter initialEntries={entries} initialIndex={entries.length - 1}>
          <PageTransitionProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <main>
                    <h1>Home page</h1>
                    <TransitionLink to="/works" label="Works">Go</TransitionLink>
                    <BackButton />
                  </main>
                }
              />
              <Route path="/about" element={<main><h1>About page</h1></main>} />
              <Route path="/works" element={<main><h1>Works page</h1></main>} />
            </Routes>
          </PageTransitionProvider>
        </MemoryRouter>
      </LanguageProvider>
    </AccessibilityProvider>
  )

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

  // Fix round 1: the browser-back cover (`gsap.set` visible at yPercent 0) must belong to the
  // provider's GSAP context, so unmount / Fast Refresh (ctx.revert) does not leave the
  // curtain covering the app.
  it('reverts the browser-back cover when the provider unmounts', () => {
    const { unmount } = renderWithHistory(['/about', '/'])
    const curtain = document.querySelector('.curtain')

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('heading', { name: 'About page' })).toBeInTheDocument()
    expect(curtain.style.visibility).toBe('visible')

    unmount()
    expect(curtain.style.visibility).not.toBe('visible')
    expect(curtain.style.transform).not.toMatch(/translate\(0(%|px)?, 0(%|px)?\)/)
  })

  // Fix round 1: Back pressed while the curtain-in is still running must cancel the pending
  // navigation; the user must stay where Back took them.
  it('stays on the Back target when Back is pressed during the curtain-in', async () => {
    renderWithHistory(['/about', '/'])
    const curtain = document.querySelector('.curtain')

    fireEvent.click(screen.getByRole('link', { name: 'Go' }))
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('heading', { name: 'About page' })).toBeInTheDocument()

    // The curtain-out ends after the 0.45 s curtain-in would have completed.
    await waitFor(() => expect(curtain.style.visibility).toBe('hidden'), { timeout: 3000 })
    expect(screen.getByRole('heading', { name: 'About page' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Works page' })).not.toBeInTheDocument()
  })
})
