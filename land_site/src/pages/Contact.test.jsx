import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import Contact from './Contact'
import { translations } from '../i18n/translations'
import { renderWithProviders } from '../test/renderWithProviders'
import { declFor, readRules } from '../test/cssRules'

vi.mock('../motion/gsap', () => import('../test/gsapMock'))

const __dirname = dirname(fileURLToPath(import.meta.url))
const CSS = join(__dirname, 'Contact.css')

describe('Contact', () => {
  it('shows a page heading, the lead and the contact form', () => {
    renderWithProviders(<Contact />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(translations.en.contact.title)
    expect(screen.getByText(translations.en.contact.body)).toBeInTheDocument()
    expect(screen.getByLabelText(translations.en.contact.form.name)).toBeInTheDocument()
  })

  it('is a paper page with exactly one h1, inside <main> (focus target after navigation)', () => {
    const { container } = renderWithProviders(<Contact />)
    const main = container.querySelector('main')
    expect(main).not.toBeNull()
    expect(main).toHaveClass('section-paper')
    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(main.querySelector('h1')).not.toBeNull()
  })

  it('keeps the existing contact section (form, email, WhatsApp) inside <main>', () => {
    const { container } = renderWithProviders(<Contact />)
    const region = screen.getByRole('region', { name: translations.en.finalCta.aria })
    expect(container.querySelector('main')).toContainElement(region)
    expect(screen.getByLabelText(translations.en.contact.form.email)).toBeInTheDocument()
    expect(screen.getByText(translations.en.finalCta.whatsapp)).toBeInTheDocument()
    expect(screen.getAllByText(translations.en.finalCta.email).length).toBeGreaterThan(0)
  })

  it('speaks Hebrew: heading and lead', () => {
    localStorage.setItem('bc_lang', 'he')
    renderWithProviders(<Contact />)
    const he = translations.he.contact
    expect(he.title).not.toBe(translations.en.contact.title)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(he.title)
    expect(screen.getByText(he.body)).toBeInTheDocument()
  })
})

describe('Contact fitness', () => {
  it('has its own stylesheet', () => {
    expect(existsSync(CSS)).toBe(true)
  })

  // `.contact-title` also carries `.display` (App.css, same specificity, loaded later),
  // so a font-size on the bare class would be dead code.
  it('declares no dead font-size on bare .contact-title', () => {
    expect(existsSync(CSS)).toBe(true)
    expect(declFor(readRules(CSS), '.contact-title', 'font-size')).toBeUndefined()
  })

  it('owns its top/bottom spacing on .contact-route', () => {
    expect(existsSync(CSS)).toBe(true)
    expect(declFor(readRules(CSS), '.contact-route', 'padding-block', { topLevelOnly: true })).toBeDefined()
  })
})
