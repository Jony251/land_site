import { StrictMode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { PageTransitionProvider } from './PageTransition'
import TransitionLink from './TransitionLink'
import { gsap } from './gsap'
import { mockMatchMedia } from '../test/matchMedia'
import { renderWithProviders } from '../test/renderWithProviders'
import { AccessibilityProvider } from '../a11y/AccessibilityProvider'
import { LanguageProvider } from '../i18n/LanguageProvider'

vi.mock('./gsap', () => import('../test/gsapMock'))

const REDUCE = '(prefers-reduced-motion: reduce)'

const BackButton = () => {
  const navigate = useNavigate()
  return (
    <button type="button" onClick={() => navigate(-1)}>
      Back
    </button>
  )
}

const Pages = () => (
  <Routes>
    <Route
      path="/"
      element={
        <main>
          <h1>Home page</h1>
          <TransitionLink to="/works" label="Works">
            Go to works
          </TransitionLink>
          <TransitionLink to="/">Stay home</TransitionLink>
        </main>
      }
    />
    <Route
      path="/works"
      element={
        <main>
          <h1>Works page</h1>
          <BackButton />
        </main>
      }
    />
  </Routes>
)

const renderApp = () => renderWithProviders(<PageTransitionProvider><Pages /></PageTransitionProvider>)
const curtain = () => document.querySelector('.curtain')
const goLink = () => screen.getByRole('link', { name: 'Go to works' })
const lastCall = (fn) => fn.mock.calls.at(-1)

describe('PageTransition + TransitionLink', () => {
  it('navigates immediately and focuses the new heading when motion is off', () => {
    mockMatchMedia({ [REDUCE]: true })
    renderApp()
    fireEvent.click(goLink())
    expect(screen.getByRole('heading', { name: 'Works page' })).toHaveFocus()
    expect(gsap.fromTo).not.toHaveBeenCalled()
  })

  it('covers the page with the curtain before navigating when motion is on', () => {
    renderApp()
    fireEvent.click(goLink())
    expect(screen.getByRole('heading', { name: 'Home page' })).toBeInTheDocument()
    expect(curtain()).toHaveTextContent('Works')

    const [target, from, to] = lastCall(gsap.fromTo)
    expect(target).toBe(curtain())
    expect(from).toEqual({ yPercent: 100, visibility: 'visible' })
    expect(to).toEqual(expect.objectContaining({ yPercent: 0 }))

    act(() => to.onComplete())
    expect(screen.getByRole('heading', { name: 'Works page' })).toHaveFocus()
    expect(gsap.to).toHaveBeenCalledWith(curtain(), expect.objectContaining({ yPercent: -100 }))
  })

  it('ignores a second click while a transition is running', () => {
    renderApp()
    fireEvent.click(goLink())
    fireEvent.click(goLink())
    expect(gsap.fromTo).toHaveBeenCalledTimes(1)
  })

  it('does nothing for a link to the current page', () => {
    renderApp()
    fireEvent.click(screen.getByRole('link', { name: 'Stay home' }))
    expect(gsap.fromTo).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: 'Home page' })).toBeInTheDocument()
  })

  it('leaves modified clicks to the browser', () => {
    renderApp()
    fireEvent.click(goLink(), { ctrlKey: true })
    expect(gsap.fromTo).not.toHaveBeenCalled()
  })

  it('hides the curtain instead of animating it if motion is switched off mid-transition', () => {
    const media = mockMatchMedia()
    renderApp()
    fireEvent.click(goLink())
    const [, , to] = lastCall(gsap.fromTo)

    act(() => media.set(REDUCE, true))
    act(() => to.onComplete())

    expect(screen.getByRole('heading', { name: 'Works page' })).toBeInTheDocument()
    expect(gsap.set).toHaveBeenCalledWith(curtain(), { visibility: 'hidden' })
    expect(gsap.to).not.toHaveBeenCalledWith(curtain(), expect.objectContaining({ yPercent: -100 }))
  })

  it('plays only the curtain-out on browser back', () => {
    const media = mockMatchMedia({ [REDUCE]: true })
    renderApp()
    fireEvent.click(goLink())
    act(() => media.set(REDUCE, false))

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(screen.getByRole('heading', { name: 'Home page' })).toHaveFocus()
    expect(gsap.fromTo).not.toHaveBeenCalled()
    expect(gsap.set).toHaveBeenCalledWith(curtain(), { yPercent: 0, visibility: 'visible' })
    expect(gsap.to).toHaveBeenCalledWith(curtain(), expect.objectContaining({ yPercent: -100 }))
  })

  it('works as a plain link without the provider', () => {
    renderWithProviders(<Pages />)
    fireEvent.click(goLink())
    expect(screen.getByRole('heading', { name: 'Works page' })).toBeInTheDocument()
  })

  // Added by QA: the first load must not steal focus or flash the curtain, even under
  // StrictMode's double-invoked effects (main.jsx renders the app in StrictMode).
  it('does not move focus or play the curtain on the first render (StrictMode)', () => {
    renderWithProviders(
      <StrictMode>
        <PageTransitionProvider>
          <Pages />
        </PageTransitionProvider>
      </StrictMode>
    )
    expect(screen.getByRole('heading', { name: 'Home page' })).not.toHaveFocus()
    expect(document.activeElement).toBe(document.body)
    expect(gsap.fromTo).not.toHaveBeenCalled()
    expect(gsap.set).not.toHaveBeenCalledWith(curtain(), expect.objectContaining({ visibility: 'visible' }))
    expect(gsap.to).not.toHaveBeenCalled()
  })

  // Added by QA: a finished transition must release the lock, or every later click is ignored.
  it('allows a new transition once the previous one has finished', () => {
    renderApp()
    fireEvent.click(goLink())
    act(() => lastCall(gsap.fromTo)[2].onComplete())
    act(() => lastCall(gsap.to)[1].onComplete())
    expect(gsap.set).toHaveBeenLastCalledWith(curtain(), { visibility: 'hidden' })

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    act(() => lastCall(gsap.to)[1].onComplete())
    expect(screen.getByRole('heading', { name: 'Home page' })).toBeInTheDocument()

    fireEvent.click(goLink())
    expect(gsap.fromTo).toHaveBeenCalledTimes(2)
  })

  // Added by QA: the curtain is decorative and must stay out of the accessibility tree.
  it('renders exactly one decorative curtain with the mascot and an empty label', () => {
    renderApp()
    const curtains = document.querySelectorAll('.curtain')
    expect(curtains).toHaveLength(1)
    expect(curtains[0]).toHaveAttribute('aria-hidden', 'true')
    expect(curtains[0].querySelector('img')).toHaveAttribute('alt', '')
    expect(curtains[0].querySelector('.curtain-label')).toHaveTextContent('')
  })

  // Fix round 1: a curtain-in that is still running when the location changes some other way
  // (here: Back pressed mid-transition) must be killed, and its late onComplete must not
  // send the user forward to the link's target.
  it('cancels a running curtain-in when Back is pressed mid-transition', () => {
    const tween = { timeScale: vi.fn(), isActive: vi.fn(() => true), kill: vi.fn() }
    gsap.fromTo.mockReturnValueOnce(tween)
    render(
      <AccessibilityProvider>
        <LanguageProvider>
          <MemoryRouter initialEntries={['/about', '/']} initialIndex={1}>
            <PageTransitionProvider>
              <Routes>
                <Route
                  path="/"
                  element={
                    <main>
                      <h1>Home page</h1>
                      <TransitionLink to="/works" label="Works">
                        Go to works
                      </TransitionLink>
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

    fireEvent.click(goLink())
    const [, , to] = lastCall(gsap.fromTo)
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(screen.getByRole('heading', { name: 'About page' })).toHaveFocus()
    expect(tween.kill).toHaveBeenCalled()

    act(() => to.onComplete())
    expect(screen.getByRole('heading', { name: 'About page' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Works page' })).not.toBeInTheDocument()
  })
})
