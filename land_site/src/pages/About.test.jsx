import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import About from './About'
import { OWNER_NAME } from '../config/owner'
import { translations } from '../i18n/translations'
import { renderWithProviders } from '../test/renderWithProviders'
import { declFor, readRules } from '../test/cssRules'

vi.mock('../motion/gsap', () => import('../test/gsapMock'))

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('About', () => {
  it('shows the owner photo and name with the page heading', () => {
    renderWithProviders(<About />)
    expect(screen.getByRole('img', { name: 'Eugeny' })).toHaveClass('owner-photo')
    expect(screen.getByText('Eugeny')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(translations.en.about.title)
    expect(screen.getByRole('link', { name: translations.en.about.cta })).toHaveAttribute('href', '/contact')
  })

  it('uses the Hebrew name in Hebrew', () => {
    localStorage.setItem('bc_lang', 'he')
    renderWithProviders(<About />)
    expect(screen.getByRole('img', { name: 'יבגני' })).toBeInTheDocument()
  })

  it.each(['en', 'ru', 'he'])('names the photo and the caption with the %s owner name', (lang) => {
    localStorage.setItem('bc_lang', lang)
    renderWithProviders(<About />)
    const name = OWNER_NAME[lang]
    expect(screen.getByRole('img', { name })).toHaveClass('owner-photo')
    expect(screen.getByText(name)).toBeInTheDocument()
  })

  it('is a paper page with exactly one h1, inside <main> (focus target after navigation)', () => {
    const { container } = renderWithProviders(<About />)
    const main = container.querySelector('main')
    expect(main).not.toBeNull()
    expect(main).toHaveClass('section-paper')
    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(main.querySelector('h1')).not.toBeNull()
  })

  it('shows all four bio paragraphs and the technology strip', () => {
    renderWithProviders(<About />)
    const a = translations.en.about
    ;['intro', 'skills', 'approach', 'range'].forEach((key) => {
      expect(screen.getByText(a[key])).toBeInTheDocument()
    })
    expect(screen.getByLabelText('Technologies used')).toBeInTheDocument()
  })

  it('speaks Hebrew: heading, bio and contact link', () => {
    localStorage.setItem('bc_lang', 'he')
    renderWithProviders(<About />)
    const he = translations.he.about
    expect(he.title).not.toBe(translations.en.about.title)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(he.title)
    expect(screen.getByText(he.intro)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: he.cta })).toHaveAttribute('href', '/contact')
  })
})

describe('About fitness', () => {
  // `.about-title` also carries `.display` (App.css, same specificity, loaded later),
  // so a font-size on the bare class would be dead code.
  it('declares no dead font-size on bare .about-title', () => {
    const rules = readRules(join(__dirname, 'About.css'))
    expect(declFor(rules, '.about-title', 'font-size')).toBeUndefined()
  })

  it('owns its top/bottom spacing on .about-route', () => {
    const rules = readRules(join(__dirname, 'About.css'))
    expect(declFor(rules, '.about-route', 'padding-block', { topLevelOnly: true })).toBeDefined()
  })
})
