import { describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import Services from './Services'
import { translations } from '../i18n/translations'
import { renderWithProviders } from '../test/renderWithProviders'
import { declFor, readRules } from '../test/cssRules'

vi.mock('../motion/gsap', () => import('../test/gsapMock'))

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('Services', () => {
  it('shows the heading, the five service rows and a start-a-project button', () => {
    renderWithProviders(<Services />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(translations.en.services.title)
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    expect(screen.getByRole('link', { name: 'Start a project' })).toHaveAttribute('href', '/contact')
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })

  it('is a paper page with exactly one h1, inside <main> (focus target after navigation)', () => {
    const { container } = renderWithProviders(<Services />)
    const main = container.querySelector('main')
    expect(main).not.toBeNull()
    expect(main).toHaveClass('section-paper')
    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(main.querySelector('h1')).not.toBeNull()
  })

  it('shows the lead and the service titles in order, without the old card headings', () => {
    renderWithProviders(<Services />)
    const s = translations.en.services
    expect(screen.getByText(s.lead)).toBeInTheDocument()
    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    ;['s1', 's2', 's3', 's4', 's5'].forEach((key, i) => {
      expect(items[i]).toHaveTextContent(s[key].title)
    })
    // Row titles are not headings: the page has one heading level only.
    expect(screen.getAllByRole('heading')).toHaveLength(1)
  })

  it('speaks Hebrew: heading and start button', () => {
    localStorage.setItem('bc_lang', 'he')
    renderWithProviders(<Services />)
    const he = translations.he
    expect(he.services.title).not.toBe(translations.en.services.title)
    expect(he.home.ctaContact).not.toBe(translations.en.home.ctaContact)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(he.services.title)
    expect(screen.getByRole('link', { name: he.home.ctaContact })).toHaveAttribute('href', '/contact')
  })
})

describe('Services fitness', () => {
  it('has removed the old Info component', () => {
    expect(existsSync(join(__dirname, '../Components/Info'))).toBe(false)
  })

  // `.services-title` also carries `.display` (App.css, same specificity, loaded later),
  // so a font-size on the bare class would be dead code.
  it('declares no dead font-size on bare .services-title', () => {
    const rules = readRules(join(__dirname, 'Services.css'))
    expect(declFor(rules, '.services-title', 'font-size')).toBeUndefined()
  })
})
