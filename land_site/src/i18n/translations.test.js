import { describe, expect, it } from 'vitest'
import { SUPPORTED_LANGUAGES, translations } from './translations'

const keysOf = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? keysOf(value, `${prefix}${key}.`)
      : [`${prefix}${key}`]
  )

describe('translations', () => {
  const enKeys = keysOf(translations.en).sort()

  it('has a dictionary for every supported language', () => {
    for (const { code } of SUPPORTED_LANGUAGES) {
      expect(translations[code], code).toBeDefined()
    }
  })

  it.each(['ru', 'he'])('%s has exactly the same keys as en', (code) => {
    expect(keysOf(translations[code]).sort()).toEqual(enKeys)
  })
})

describe('copy contracts', () => {
  // ServiceRows titles must break inside long RU words at 320px; the hint is a soft hyphen.
  it('ru services.s2.title hyphenates "сопровождение" with a soft hyphen', () => {
    expect(translations.ru.services.s2.title).toBe('Поддержка и сопро\u00ADвождение')
    expect(translations.ru.services.s2.title).toContain('сопро\u00ADвождение')
  })

  // /contact renders contact.title as h1 and finalCta.title as h2 — two identical headings read twice.
  it.each(['en', 'ru', 'he'])('%s contact page h1 (contact.title) differs from its h2 (finalCta.title)', (code) => {
    const { contact, finalCta } = translations[code]
    expect(contact.title).toBeTruthy()
    expect(finalCta.title).toBeTruthy()
    expect(contact.title).not.toBe(finalCta.title)
  })

  it('he finalCta speaks to the visitor in first person: "כתבו לי"', () => {
    expect(translations.he.finalCta.title).toBe('כתבו לי')
    expect(translations.he.finalCta.aria).toBe('כתבו לי')
  })
})
