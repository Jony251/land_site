import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import Magnetic from './Magnetic'
import { gsap } from './gsap'
import { mockMatchMedia } from '../test/matchMedia'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('./gsap', () => import('../test/gsapMock'))

const FINE = '(pointer: fine)'

const renderMagnetic = () => {
  renderWithProviders(
    <Magnetic>
      <a href="/contact">Start</a>
    </Magnetic>
  )
  const wrapper = screen.getByText('Start').parentElement
  wrapper.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 40 })
  return wrapper
}

describe('Magnetic', () => {
  it('wraps its child in a magnetic span', () => {
    const wrapper = renderMagnetic()
    expect(wrapper).toHaveClass('magnetic')
    expect(screen.getByRole('link', { name: 'Start' })).toBeInTheDocument()
  })

  it('moves toward the pointer and springs back on leave', () => {
    mockMatchMedia({ [FINE]: true })
    const wrapper = renderMagnetic()
    const [xTo, yTo] = gsap.quickTo.mock.results.map((r) => r.value)

    fireEvent.mouseMove(wrapper, { clientX: 150, clientY: 30 })
    expect(xTo).toHaveBeenLastCalledWith(35)
    expect(yTo).toHaveBeenLastCalledWith(3.5)

    fireEvent.mouseLeave(wrapper)
    expect(xTo).toHaveBeenLastCalledWith(0)
    expect(yTo).toHaveBeenLastCalledWith(0)
  })

  it('does nothing on a coarse pointer', () => {
    mockMatchMedia({ [FINE]: false })
    renderMagnetic()
    expect(gsap.quickTo).not.toHaveBeenCalled()
  })

  it('does nothing with reduced motion', () => {
    mockMatchMedia({ [FINE]: true, '(prefers-reduced-motion: reduce)': true })
    renderMagnetic()
    expect(gsap.quickTo).not.toHaveBeenCalled()
  })
})
