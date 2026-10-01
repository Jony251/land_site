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
  const TEXT = 'Blue Cat — Web Studio —'
  const isHidden = (el) => el.closest('[aria-hidden="true"]') !== null

  it('renders two copies, hiding the second from screen readers', () => {
    renderMarquee()
    const items = document.querySelectorAll('.marquee-item')
    expect(items).toHaveLength(2)
    items.forEach((item) => expect(item.querySelectorAll('.marquee-segment')).toHaveLength(2))
    const segments = [...document.querySelectorAll('.marquee-segment')]
    expect(segments).toHaveLength(4)
    segments.forEach((segment) => expect(segment).toHaveTextContent(TEXT))
    expect(screen.getAllByText(TEXT)).toHaveLength(4)
    const exposed = segments.filter((segment) => !isHidden(segment))
    expect(exposed).toHaveLength(1)
    expect(exposed[0]).toBe(segments[0])
  })

  it('repeats the content inside each copy, still exposing it only once', () => {
    renderWithProviders(<Marquee repeat={3}>{TEXT}</Marquee>)
    const items = document.querySelectorAll('.marquee-item')
    expect(items).toHaveLength(2)
    items.forEach((item) => expect(item.querySelectorAll('.marquee-segment')).toHaveLength(3))
    const segments = [...document.querySelectorAll('.marquee-segment')]
    expect(segments).toHaveLength(6)
    const exposed = segments.filter((segment) => !isHidden(segment))
    expect(exposed).toHaveLength(1)
    expect(exposed[0]).toBe(segments[0])
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

  it('boosts speed with scroll velocity and eases back in the scroll direction', () => {
    renderMarquee()
    const loop = gsap.fromTo.mock.results[0].value
    const { onUpdate } = ScrollTrigger.create.mock.calls[0][0]

    onUpdate({ direction: -1, getVelocity: () => 800 })
    expect(loop.timeScale).toHaveBeenLastCalledWith(-3)
    expect(gsap.to).toHaveBeenLastCalledWith(
      loop,
      expect.objectContaining({ timeScale: -1, overwrite: true })
    )

    onUpdate({ direction: 1, getVelocity: () => 0 })
    expect(loop.timeScale).toHaveBeenLastCalledWith(1)
    expect(gsap.to).toHaveBeenLastCalledWith(
      loop,
      expect.objectContaining({ timeScale: 1, overwrite: true })
    )
  })

  it('keeps looping after being reversed back to the start', () => {
    renderMarquee()
    const { onReverseComplete } = gsap.fromTo.mock.calls[0][2]
    expect(onReverseComplete).toEqual(expect.any(Function))
    const fakeTween = { totalTime: vi.fn(), rawTime: () => 0, duration: () => 30 }
    onReverseComplete.call(fakeTween)
    expect(fakeTween.totalTime).toHaveBeenCalledWith(3000)
  })

  it('stays still with reduced motion', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true })
    renderMarquee()
    expect(gsap.fromTo).not.toHaveBeenCalled()
    expect(ScrollTrigger.create).not.toHaveBeenCalled()
  })
})
