import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import ContactFooter from './ContactFooter.comp'
import { renderWithProviders } from '../../test/renderWithProviders'

vi.mock('../../motion/gsap', () => import('../../test/gsapMock'))
vi.mock('../../config/contact', () => ({
  CONTACT_EMAIL: '',
  WHATSAPP_URL: '',
}))

describe('ContactFooter without contact env', () => {
  it('renders no empty email or WhatsApp links, but keeps the contact page link', () => {
    renderWithProviders(<ContactFooter />)
    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'))
    expect(hrefs).toEqual(['/contact'])
    // an <a href=""> is not exposed as a link role, so check the text itself
    expect(screen.queryByText('WhatsApp')).toBeNull()
  })
})
