import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import RevealText from './RevealText'
import { gsap, SplitText } from './gsap'
import { mockMatchMedia } from '../test/matchMedia'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('./gsap', () => import('../test/gsapMock'))

describe('RevealText', () => {
  it('renders the requested tag with its text', () => {
    renderWithProviders(<RevealText as="h1" className="display">Hello</RevealText>)
    const heading = screen.getByRole('heading', { level: 1, name: 'Hello' })
    expect(heading).toHaveClass('display')
  })

  it('splits into masked lines and animates them when motion is allowed', () => {
    renderWithProviders(<RevealText as="h2">Hello</RevealText>)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(SplitText.create).toHaveBeenCalledWith(
      heading,
      expect.objectContaining({ type: 'lines', mask: 'lines', autoSplit: true })
    )
    expect(gsap.from).toHaveBeenCalledWith([heading], expect.objectContaining({ yPercent: 110 }))
  })

  it('does not split or animate with reduced motion', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true })
    renderWithProviders(<RevealText>Hello</RevealText>)
    expect(screen.getByText('Hello')).toBeVisible()
    expect(SplitText.create).not.toHaveBeenCalled()
  })

  it('re-splits when children change (language switch)', () => {
    const { rerender } = renderWithProviders(<RevealText>Hello</RevealText>)
    rerender(<RevealText>Привет</RevealText>)
    expect(SplitText.create).toHaveBeenCalledTimes(2)
    expect(screen.getByText('Привет')).toBeInTheDocument()
  })
})
