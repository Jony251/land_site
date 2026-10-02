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

// Hebrew copy addresses the visitor in the plural ("צרו", "שלחו", "נסו"), never the masculine singular.
describe('Hebrew addresses the visitor in the plural', () => {
  const he = translations.he
  const strings = (node, prefix = '') =>
    Object.entries(node).flatMap(([key, value]) =>
      value && typeof value === 'object' ? strings(value, `${prefix}${key}.`) : [[`${prefix}${key}`, value]],
    )
  const SINGULAR_IMPERATIVE = /(^|[\s"״(])(שלח|נסה|הוסף|הזמן|קבל|צור|כתוב|ספר|בחר|השאר|לחץ)(?=[\s,.!?—:]|$)/

  it('no masculine-singular imperatives anywhere in he', () => {
    const offenders = strings(he)
      .filter(([, text]) => SINGULAR_IMPERATIVE.test(String(text)))
      .map(([key]) => key)
    expect(offenders).toEqual([])
  })

  it('nav.contact matches the page title: "צרו קשר"', () => {
    expect(he.nav.contact).toBe('צרו קשר')
    expect(he.nav.contact).toBe(he.contact.title)
  })

  it('contact form: "שליחה", "נסו שוב", "הוסיפו"', () => {
    expect(he.contact.form.send).toBe('שליחה')
    expect(he.contact.form.error).toBe('שליחת ההודעה נכשלה. נסו שוב.')
    expect(he.contact.form.notConfigured).toBe('שירות המייל לא מוגדר עדיין. הוסיפו מפתחות EmailJS לקובץ .env.')
    expect(he.contact.form.hint).toBe('כדי להפעיל שליחת מייל, הוסיפו מפתחות EmailJS לקובץ .env.')
  })

  it('finalCta.lead speaks in the plural throughout', () => {
    expect(he.finalCta.lead).toBe(
      'יש שאלה, צריכים הצעת מחיר או רוצים לדבר על הפרויקט? שלחו הודעה — אחזור אליכם במהירות ואעזור לבחור את הפתרון המתאים.',
    )
  })
})
