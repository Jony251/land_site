import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import HoverPreviewList from './HoverPreviewList'
import { gsap } from './gsap'
import { mockMatchMedia } from '../test/matchMedia'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('./gsap', () => import('../test/gsapMock'))

const FINE = '(hover: hover) and (pointer: fine)'
const REDUCE = '(prefers-reduced-motion: reduce)'
const ITEMS = [
  { id: 'a', href: '/works/a', title: 'Alpha CRM', meta: 'System', image: '/a.jpg' },
  { id: 'b', href: '/works/b', title: 'Beta Site', meta: 'Landing', image: '/b.jpg' },
]
const thumbs = () => document.querySelectorAll('.hpl-thumb')
const preview = () => document.querySelector('.hpl-preview')
const previewImg = () => document.querySelector('.hpl-preview-img')

describe('HoverPreviewList', () => {
  it('renders one link per item with its href', () => {
    renderWithProviders(<HoverPreviewList items={ITEMS} />)
    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.getByRole('link', { name: /Alpha CRM/ })).toHaveAttribute('href', '/works/a')
    expect(screen.getByRole('link', { name: /Beta Site/ })).toHaveAttribute('href', '/works/b')
  })

  it('shows card thumbnails and no floating preview on a coarse pointer', () => {
    mockMatchMedia({ [FINE]: false })
    renderWithProviders(<HoverPreviewList items={ITEMS} />)
    expect(thumbs()).toHaveLength(2)
    expect(preview()).toBeNull()
    expect(gsap.quickTo).not.toHaveBeenCalled()
  })

  it('hides a card thumbnail that fails to load but keeps the link', () => {
    renderWithProviders(<HoverPreviewList items={ITEMS} />)
    fireEvent.error(thumbs()[0])
    expect(thumbs()).toHaveLength(1)
    expect(screen.getByRole('link', { name: /Alpha CRM/ })).toBeInTheDocument()
  })

  it('follows the pointer and swaps the image on row hover with a fine pointer', () => {
    mockMatchMedia({ [FINE]: true })
    renderWithProviders(<HoverPreviewList items={ITEMS} />)
    const [xTo, yTo] = gsap.quickTo.mock.results.map((r) => r.value)
    expect(thumbs()).toHaveLength(0)

    const rowB = screen.getByRole('link', { name: /Beta Site/ }).closest('li')
    fireEvent.mouseEnter(rowB)
    expect(previewImg()).toHaveAttribute('src', '/b.jpg')
    expect(preview()).toHaveClass('is-visible')

    fireEvent.mouseMove(rowB, { clientX: 120, clientY: 340 })
    expect(xTo).toHaveBeenLastCalledWith(120)
    expect(yTo).toHaveBeenLastCalledWith(340)

    fireEvent.mouseLeave(screen.getByRole('list'))
    expect(preview()).not.toHaveClass('is-visible')
  })

  it('keeps physical pointer coordinates in RTL', () => {
    localStorage.setItem('bc_lang', 'he')
    mockMatchMedia({ [FINE]: true })
    renderWithProviders(<HoverPreviewList items={ITEMS} />)
    const [xTo] = gsap.quickTo.mock.results.map((r) => r.value)
    fireEvent.mouseMove(screen.getByRole('list'), { clientX: 50, clientY: 10 })
    expect(xTo).toHaveBeenLastCalledWith(50)
  })

  it('hides the floating preview when its image fails', () => {
    mockMatchMedia({ [FINE]: true })
    renderWithProviders(<HoverPreviewList items={ITEMS} />)
    fireEvent.mouseEnter(screen.getByRole('link', { name: /Alpha CRM/ }).closest('li'))
    fireEvent.error(previewImg())
    expect(previewImg()).toBeNull()
    expect(preview()).not.toHaveClass('is-visible')
  })

  it('renders no floating preview with reduced motion', () => {
    mockMatchMedia({ [FINE]: true, [REDUCE]: true })
    renderWithProviders(<HoverPreviewList items={ITEMS} />)
    expect(preview()).toBeNull()
    expect(gsap.quickTo).not.toHaveBeenCalled()
    expect(thumbs()).toHaveLength(2)
  })

  it('stops following the pointer after unmount', () => {
    mockMatchMedia({ [FINE]: true })
    const { unmount } = renderWithProviders(<HoverPreviewList items={ITEMS} />)
    const [xTo, yTo] = gsap.quickTo.mock.results.map((r) => r.value)
    const list = screen.getByRole('list')
    fireEvent.mouseMove(list, { clientX: 1, clientY: 2 })
    expect(xTo).toHaveBeenCalledTimes(1)

    unmount()
    fireEvent.mouseMove(list, { clientX: 300, clientY: 400 })
    expect(xTo).toHaveBeenCalledTimes(1)
    expect(yTo).toHaveBeenCalledTimes(1)
  })

  it('applies base, preview and custom classes to the list with a fine pointer', () => {
    mockMatchMedia({ [FINE]: true })
    renderWithProviders(<HoverPreviewList items={ITEMS} className="works-list" />)
    expect(screen.getByRole('list')).toHaveClass('hpl', 'hpl--preview', 'works-list')
  })

  it('applies base and custom classes but no preview class on a coarse pointer', () => {
    mockMatchMedia({ [FINE]: false })
    renderWithProviders(<HoverPreviewList items={ITEMS} className="works-list" />)
    const list = screen.getByRole('list')
    expect(list).toHaveClass('hpl', 'works-list')
    expect(list).not.toHaveClass('hpl--preview')
  })
})
