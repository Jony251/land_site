import { afterEach, describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguageSwitcher from './LanguageSwitcher.comp'
import { renderWithProviders } from '../../test/renderWithProviders'

afterEach(() => {
  localStorage.clear()
})

describe('LanguageSwitcher', () => {
  it.each([
    ['en', 'Language'],
    ['ru', 'Язык'],
    ['he', 'שפה'],
  ])('%s: the button group is named in the current language (%s)', (code, name) => {
    localStorage.setItem('bc_lang', code)
    renderWithProviders(<LanguageSwitcher />)
    const group = screen.getByRole('group', { name })
    expect(within(group).getAllByRole('button')).toHaveLength(3)
  })

  it('renames the group when the language changes', async () => {
    localStorage.setItem('bc_lang', 'en')
    const user = userEvent.setup()
    renderWithProviders(<LanguageSwitcher />)
    const group = screen.getByRole('group', { name: 'Language' })
    await user.click(within(group).getByRole('button', { name: 'HE' }))
    expect(screen.getByRole('group', { name: 'שפה' })).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Language selector' })).not.toBeInTheDocument()
  })
})
