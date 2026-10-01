import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import ContactFooter from './ContactFooter.comp'
import { renderWithProviders } from '../../test/renderWithProviders'

vi.mock('../../motion/gsap', () => import('../../test/gsapMock'))
vi.mock('../../config/contact', () => ({
  CONTACT_EMAIL: 'hello@example.com',
  WHATSAPP_URL: 'https://wa.me/972500000000',
}))

describe('ContactFooter', () => {
  it('invites to work together and links to the contact page', () => {
    renderWithProviders(<ContactFooter />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: "Let's work together" })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Write to me' })).toHaveAttribute('href', '/contact')
  })

  it('shows email and WhatsApp when configured', () => {
    renderWithProviders(<ContactFooter />)
    expect(screen.getByRole('link', { name: 'hello@example.com' })).toHaveAttribute(
      'href',
      'mailto:hello@example.com'
    )
    const whatsapp = screen.getByRole('link', { name: 'WhatsApp' })
    expect(whatsapp).toHaveAttribute('href', 'https://wa.me/972500000000')
    expect(whatsapp).toHaveAttribute('target', '_blank')
    expect(whatsapp.getAttribute('rel')).toContain('noreferrer')
  })

  it('names the owner in the photo alt per language', () => {
    localStorage.setItem('bc_lang', 'he')
    renderWithProviders(<ContactFooter />)
    expect(screen.getByRole('img', { name: 'יבגני' })).toHaveClass('owner-photo')
  })
})

describe('ContactFooter i18n and a11y', () => {
  it.each([
    ['ru', 'Давайте работать вместе', 'Написать мне'],
    ['he', 'בואו נעבוד יחד', 'כתבו לי'],
  ])('translates the heading and the call to action in %s', (code, title, cta) => {
    localStorage.setItem('bc_lang', code)
    renderWithProviders(<ContactFooter />)
    expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: cta })).toHaveAttribute('href', '/contact')
  })

  it('keeps the waving mascot decorative (only the owner photo is announced)', () => {
    renderWithProviders(<ContactFooter />)
    expect(screen.getAllByRole('img')).toHaveLength(1)
    expect(screen.getByRole('img', { name: 'Eugeny' })).toHaveClass('owner-photo')
  })
})
