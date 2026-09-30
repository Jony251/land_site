import '../test/realGsapEnv'
import { describe, expect, it } from 'vitest'
import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RevealText from './RevealText'
import useI18n from '../i18n/useI18n'
import { translations } from '../i18n/translations'
import { renderWithProviders } from '../test/renderWithProviders'

// Uses the REAL gsap + SplitText (no vi.mock) so that SplitText actually rewrites
// the DOM React owns. The mocked RevealText.test.jsx cannot catch reconciliation bugs.

/** Mirrors the Home hero: a RevealText heading built from translations, plus a language switch. */
const Hero = () => {
  const { t, setLang } = useI18n()
  return (
    <>
      <RevealText as="h1">
        {t('home.titleStart')}
        <span className="home-title-accent">{t('home.titleAccent')}</span>
        {t('home.titleEnd')}
      </RevealText>
      <button type="button" onClick={() => setLang('he')}>
        HE
      </button>
      <button type="button" onClick={() => setLang('ru')}>
        RU
      </button>
    </>
  )
}

const fullTitle = (lang) => {
  const { titleStart, titleAccent, titleEnd } = translations[lang].home
  return `${titleStart}${titleAccent}${titleEnd}`
}

const count = (haystack, needle) => haystack.split(needle).length - 1

describe('RevealText with real gsap SplitText', () => {
  it('actually splits the heading when motion is allowed (sanity: real SplitText is in play)', () => {
    localStorage.setItem('bc_lang', 'en')
    renderWithProviders(<Hero />)
    const heading = screen.getByRole('heading', { level: 1 })
    // React renders no <div> inside the <h1>; a line/mask wrapper div proves SplitText rewrote it.
    expect(heading.querySelector('div')).not.toBeNull()
    expect(heading.textContent).toBe(fullTitle('en'))
  })

  it.each(['he', 'ru'])(
    'switching EN -> %s through LanguageProvider shows only the new title, exactly once',
    async (target) => {
      localStorage.setItem('bc_lang', 'en')
      const user = userEvent.setup()
      renderWithProviders(<Hero />)
      expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(fullTitle('en'))

      let error
      try {
        await user.click(screen.getByRole('button', { name: target.toUpperCase() }))
        await act(async () => {})
      } catch (e) {
        error = e
      }
      expect(error).toBeUndefined()

      const text = screen.getByRole('heading', { level: 1 }).textContent
      expect(text).not.toContain(translations.en.home.titleStart.trim())
      expect(text).not.toContain(translations.en.home.titleAccent)
      expect(count(text, translations[target].home.titleAccent)).toBe(1)
      expect(count(text, translations[target].home.titleStart.trim())).toBe(1)
      expect(text).toBe(fullTitle(target))
    }
  )
})
