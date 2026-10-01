import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Nav from './Nav.comp'
import { renderWithProviders } from '../../test/renderWithProviders'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { declFor, readRules } from '../../test/cssRules'

const __dirname = dirname(fileURLToPath(import.meta.url))

const setScroll = (y) => {
  Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true })
  act(() => {
    fireEvent.scroll(window)
  })
}

afterEach(() => {
  Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true })
  document.documentElement.classList.remove('menu-open')
  vi.restoreAllMocks()
})

describe('Nav', () => {
  it('shows the wordmark and the four main links', () => {
    renderWithProviders(<Nav />)
    expect(screen.getByRole('link', { name: 'Blue Cat' })).toHaveAttribute('href', '/')
    const main = screen.getByRole('navigation', { name: 'Main' })
    expect(within(main).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual([
      '/works',
      '/services',
      '/about',
      '/contact',
    ])
  })

  it('collapses after one viewport of scrolling and expands back at the top', () => {
    renderWithProviders(<Nav />)
    const header = screen.getByRole('banner')
    expect(header).not.toHaveClass('navbar--collapsed')
    setScroll(1200)
    expect(header).toHaveClass('navbar--collapsed')
    setScroll(0)
    expect(header).not.toHaveClass('navbar--collapsed')
  })

  it('opens a full-screen menu and moves focus into it', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Nav />)
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    const dialog = screen.getByRole('dialog', { name: 'Menu' })
    const links = within(dialog).getAllByRole('link')
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/', '/works', '/services', '/about', '/contact'])
    expect(links[0]).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes on Escape and returns focus to the button', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Nav />)
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveFocus()
    expect(document.documentElement).not.toHaveClass('menu-open')
  })

  it('closes when a menu link is chosen', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Nav />)
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    expect(document.documentElement).toHaveClass('menu-open')
    await user.click(within(screen.getByRole('dialog')).getByRole('link', { name: 'Works' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  // Added by QA (Task 7 RED): boundary, wiring and teardown guarantees not covered above.

  it('stays expanded up to exactly one viewport and collapses just past it', () => {
    renderWithProviders(<Nav />)
    const header = screen.getByRole('banner')
    setScroll(400)
    expect(header).not.toHaveClass('navbar--collapsed')
    setScroll(800)
    expect(header).not.toHaveClass('navbar--collapsed')
    setScroll(801)
    expect(header).toHaveClass('navbar--collapsed')
  })

  it('starts collapsed when mounted below the first viewport', () => {
    setScroll(2000)
    renderWithProviders(<Nav />)
    expect(screen.getByRole('banner')).toHaveClass('navbar--collapsed')
  })

  it('wires the button to a modal dialog and toggles it closed again', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Nav />)
    const button = screen.getByRole('button', { name: 'Menu' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls', 'site-menu')

    await user.click(button)
    const dialog = screen.getByRole('dialog', { name: 'Menu' })
    expect(dialog).toHaveAttribute('id', 'site-menu')
    expect(dialog).toHaveAttribute('aria-modal', 'true')

    await user.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')
    expect(document.documentElement).not.toHaveClass('menu-open')
  })

  it('releases the page scroll lock when unmounted with the menu open', async () => {
    const user = userEvent.setup()
    const { unmount } = renderWithProviders(<Nav />)
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    expect(document.documentElement).toHaveClass('menu-open')
    unmount()
    expect(document.documentElement).not.toHaveClass('menu-open')
  })

  it('removes its scroll listener on unmount', () => {
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderWithProviders(<Nav />)
    const added = add.mock.calls.filter(([type]) => type === 'scroll').map(([, fn]) => fn)
    expect(added.length).toBeGreaterThan(0)
    unmount()
    const removed = remove.mock.calls.filter(([type]) => type === 'scroll').map(([, fn]) => fn)
    added.forEach((fn) => expect(removed).toContain(fn))
  })

  it('labels the navigation, button and menu in the current language', async () => {
    localStorage.setItem('bc_lang', 'he')
    const user = userEvent.setup()
    renderWithProviders(<Nav />)
    expect(screen.getByRole('navigation', { name: 'ניווט ראשי' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'תפריט' }))
    expect(screen.getByRole('dialog', { name: 'תפריט' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'סגירת התפריט' })).toHaveAttribute('aria-expanded', 'true')
  })

  // Controller ruling (Task 7): focus trap, hidden collapsed shell, single "Menu" landmark.

  it('keeps keyboard focus cycling between the menu button and the open menu', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <>
        <Nav />
        <main>
          <a href="/behind">Behind the overlay</a>
        </main>
      </>,
    )
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    const dialog = screen.getByRole('dialog', { name: 'Menu' })
    const button = screen.getByRole('button', { name: 'Close menu' })
    const focusables = [...dialog.querySelectorAll('a[href], button')]
    const last = focusables[focusables.length - 1]

    act(() => last.focus())
    await user.tab()
    expect(button).toHaveFocus()

    await user.tab({ shift: true })
    expect(last).toHaveFocus()

    const inside = (el) => el === button || dialog.contains(el)
    for (let i = 0; i < focusables.length * 2 + 2; i += 1) {
      await user.tab()
      expect(inside(document.activeElement)).toBe(true)
    }
    for (let i = 0; i < focusables.length * 2 + 2; i += 1) {
      await user.tab({ shift: true })
      expect(inside(document.activeElement)).toBe(true)
    }
  })

  it('hides the collapsed header bar from the tab order', () => {
    const rules = readRules(`${__dirname}/Nav.comp.css`)
    expect(declFor(rules, '.navbar--collapsed .nav-shell', 'visibility')).toBe('hidden')
    expect(declFor(rules, '.navbar--collapsed .nav-shell', 'transition')).toMatch(/visibility/)
  })

  it('exposes a single "Menu" landmark when the menu is open', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Nav />)
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    const dialog = screen.getByRole('dialog', { name: 'Menu' })
    expect(screen.queryAllByRole('navigation', { name: 'Menu' })).toHaveLength(0)
    expect(within(dialog).getByRole('navigation')).toHaveAccessibleName('')
  })
})
