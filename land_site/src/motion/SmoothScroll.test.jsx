import { describe, expect, it, vi } from 'vitest'
import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useNavigate } from 'react-router-dom'
import Lenis from 'lenis'
import SmoothScroll from './SmoothScroll'
import useA11y from '../a11y/useA11y'
import { gsap } from './gsap'
import { mockMatchMedia } from '../test/matchMedia'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('./gsap', () => import('../test/gsapMock'))
vi.mock('lenis', () => ({
  default: vi.fn(function Lenis() {
    this.on = vi.fn()
    this.raf = vi.fn()
    this.scrollTo = vi.fn()
    this.destroy = vi.fn()
  }),
}))

let a11y
const Probe = () => {
  const navigate = useNavigate()
  a11y = useA11y()
  return <button onClick={() => navigate('/works')}>go</button>
}

const renderScroll = () =>
  renderWithProviders(
    <SmoothScroll>
      <Probe />
    </SmoothScroll>
  )

describe('SmoothScroll', () => {
  it('creates one Lenis instance driven by the GSAP ticker', () => {
    renderScroll()
    expect(Lenis).toHaveBeenCalledTimes(1)
    expect(gsap.ticker.add).toHaveBeenCalledTimes(1)
  })

  it('does not create Lenis when the OS asks for reduced motion', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true })
    renderScroll()
    expect(Lenis).not.toHaveBeenCalled()
  })

  it('destroys Lenis when reduce-motion is toggled on', () => {
    renderScroll()
    const lenis = Lenis.mock.instances[0]
    act(() => a11y.toggleReduceMotion())
    expect(lenis.destroy).toHaveBeenCalled()
    expect(gsap.ticker.remove).toHaveBeenCalled()
  })

  it('destroys Lenis on unmount', () => {
    const { unmount } = renderScroll()
    const lenis = Lenis.mock.instances[0]
    unmount()
    expect(lenis.destroy).toHaveBeenCalled()
  })

  it('jumps to top on route change with Lenis', async () => {
    renderScroll()
    const lenis = Lenis.mock.instances[0]
    await userEvent.click(screen.getByText('go'))
    expect(lenis.scrollTo).toHaveBeenLastCalledWith(0, { immediate: true })
  })

  it('jumps to top on route change without Lenis', async () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true })
    renderScroll()
    window.scrollTo.mockClear()
    await userEvent.click(screen.getByText('go'))
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })
})
