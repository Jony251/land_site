import { describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RevealText from './RevealText'
import useI18n from '../i18n/useI18n'
import { translations } from '../i18n/translations'
import { gsap, SplitText } from './gsap'
import { mockMatchMedia } from '../test/matchMedia'
import { renderWithProviders } from '../test/renderWithProviders'

vi.mock('./gsap', () => import('../test/gsapMock'))

/**
 * Mirrors the Home hero: RevealText children built from translations (new element
 * identities every render), a language switch, and an unrelated state bump that
 * re-renders the parent without changing the language.
 */
const Hero = () => {
  const { t, setLang } = useI18n()
  const [renders, setRenders] = useState(0)
  return (
    <>
      <RevealText as="h1">
        {t('home.titleStart')}
        <span className="home-title-accent">{t('home.titleAccent')}</span>
        {t('home.titleEnd')}
      </RevealText>
      <button type="button" onClick={() => setLang('ru')}>
        RU
      </button>
      <button type="button" onClick={() => setRenders((n) => n + 1)}>
        Re-render {renders}
      </button>
    </>
  )
}

describe('RevealText', () => {
  it('renders the requested tag with its text', () => {
    renderWithProviders(<RevealText as="h1" className="display">Hello</RevealText>)
    const heading = screen.getByRole('heading', { level: 1, name: 'Hello' })
    expect(heading).toHaveClass('display')
  })

  it('splits into masked lines and animates them when motion is allowed', () => {
    renderWithProviders(<RevealText as="h2">Hello</RevealText>)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(SplitText.create).toHaveBeenCalledWith(
      heading,
      expect.objectContaining({ type: 'lines', mask: 'lines', autoSplit: true })
    )
    expect(gsap.from).toHaveBeenCalledWith([heading], expect.objectContaining({ yPercent: 110 }))
  })

  it('does not split or animate with reduced motion', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true })
    renderWithProviders(<RevealText>Hello</RevealText>)
    expect(screen.getByText('Hello')).toBeVisible()
    expect(SplitText.create).not.toHaveBeenCalled()
  })

  it('re-splits on a language switch through LanguageProvider', async () => {
    localStorage.setItem('bc_lang', 'en')
    const user = userEvent.setup()
    renderWithProviders(<Hero />)
    expect(SplitText.create).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: 'RU' }))

    expect(SplitText.create).toHaveBeenCalledTimes(2)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(translations.ru.home.titleAccent)
  })

  it('does not re-split when the parent re-renders with the same language', async () => {
    localStorage.setItem('bc_lang', 'en')
    const user = userEvent.setup()
    renderWithProviders(<Hero />)
    expect(SplitText.create).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: /re-render/i }))
    await user.click(screen.getByRole('button', { name: /re-render/i }))

    expect(screen.getByRole('button', { name: /re-render/i })).toHaveTextContent('2')
    expect(SplitText.create).toHaveBeenCalledTimes(1)
    expect(gsap.from).toHaveBeenCalledTimes(1)
  })
})
