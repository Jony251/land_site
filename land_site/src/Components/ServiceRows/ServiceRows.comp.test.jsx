import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import ServiceRows, { SERVICE_KEYS } from './ServiceRows.comp'
import { translations } from '../../i18n/translations'
import { renderWithProviders } from '../../test/renderWithProviders'

const numbers = (items) => items.map((li) => li.querySelector('.service-rows-num').textContent)

describe('ServiceRows', () => {
  it('lists the five service levels numbered 01–05 without links by default', () => {
    renderWithProviders(<ServiceRows />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(5)
    expect(numbers(items)).toEqual(['01', '02', '03', '04', '05'])
    expect(items[0]).toHaveTextContent(translations.en.services.s1.title)
    expect(items[4]).toHaveTextContent(translations.en.services.s5.desc)
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })

  it('links every row to /services when asked', () => {
    renderWithProviders(<ServiceRows withLinks />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(5)
    links.forEach((link) => expect(link).toHaveAttribute('href', '/services'))
  })

  it('keeps numbering order in Hebrew', () => {
    localStorage.setItem('bc_lang', 'he')
    renderWithProviders(<ServiceRows />)
    const items = screen.getAllByRole('listitem')
    expect(numbers(items)).toEqual(['01', '02', '03', '04', '05'])
    expect(items[4]).toHaveTextContent(translations.he.services.s5.title)
  })

  it('renders every service in order as an ordered list', () => {
    expect(SERVICE_KEYS).toEqual(['s1', 's2', 's3', 's4', 's5'])
    renderWithProviders(<ServiceRows />)
    expect(screen.getByRole('list').tagName).toBe('OL')
    const items = screen.getAllByRole('listitem')
    SERVICE_KEYS.forEach((key, index) => {
      const { title, desc } = translations.en.services[key]
      expect(items[index].querySelector('.service-rows-title')).toHaveTextContent(title)
      expect(items[index].querySelector('.service-rows-desc')).toHaveTextContent(desc)
    })
  })

  it('hides the decorative numbers from assistive tech so link names start with the title', () => {
    renderWithProviders(<ServiceRows withLinks />)
    const links = screen.getAllByRole('link')
    links.forEach((link, index) => {
      expect(link.querySelector('.service-rows-num')).toHaveAttribute('aria-hidden', 'true')
      const name = link.textContent.replace(link.querySelector('.service-rows-num').textContent, '')
      expect(link).toHaveAccessibleName(name)
      expect(name.startsWith(translations.en.services[SERVICE_KEYS[index]].title)).toBe(true)
    })
  })
})
