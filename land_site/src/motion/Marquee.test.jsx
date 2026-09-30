import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import Marquee from './Marquee'
import { gsap, ScrollTrigger } from './gsap'
import { mockMatchMedia } from '../test/matchMedia'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('./gsap', () => import('../test/gsapMock'))

const renderMarquee = () => renderWithProviders(<Marquee>Blue Cat — Web Studio —</Marquee>)
const track = () => document.querySelector('.marquee-track')

describe('Marquee', () => {
  it('renders two copies, hiding the second from screen readers', () => {
    renderMarquee()
    const copies = screen.getAllByText('Blue Cat — Web Studio —')
    expect(copies).toHaveLength(2)
    expect(copies[0]).not.toHaveAttribute('aria-hidden')
    expect(copies[1]).toHaveAttribute('aria-hidden', 'true')
  })

  it('moves left in LTR', () => {
    renderMarquee()
    expect(document.querySelector('.marquee')).toHaveAttribute('data-direction', 'left')
    expect(gsap.fromTo).toHaveBeenCalledWith(
      track(),
      { xPercent: 0 },
      expect.objectContaining({ xPercent: -50, repeat: -1, ease: 'none' })
    )
  })

  it('moves right in RTL', () => {
    localStorage.setItem('bc_lang', 'he')
    renderMarquee()
    expect(document.querySelector('.marquee')).toHaveAttribute('data-direction', 'right')
    expect(gsap.fromTo).toHaveBeenCalledWith(
      track(),
      { xPercent: -50 },
      expect.objectContaining({ xPercent: 0 })
    )
  })

  it('reacts to scroll velocity', () => {
    renderMarquee()
    expect(ScrollTrigger.create).toHaveBeenCalledWith(
      expect.objectContaining({ onUpdate: expect.any(Function) })
    )
  })

  it('stays still with reduced motion', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true })
    renderMarquee()
    expect(gsap.fromTo).not.toHaveBeenCalled()
    expect(ScrollTrigger.create).not.toHaveBeenCalled()
  })
})
