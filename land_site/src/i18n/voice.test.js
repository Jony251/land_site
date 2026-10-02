import { describe, expect, it } from 'vitest'
import { translations } from './translations'

const FIRST_PERSON_PLURAL = {
  en: /\b(we|we're|we've|we'll|our|ours|us)\b/i,
  ru: /(^|[^а-яё])(мы|нас|нам|нами|наш[а-яё]*)(?=[^а-яё]|$)/i,
  he: /אנחנו|שלנו|(^|[\s״"(])אנו(?=[\s,.!?—]|$)/,
}

// Soft hyphen (U+00AD): a hyphenation hint inside a word (RU titles use it). Strip it so a hinted word
// is judged as one word: "на<SHY>ши" is still "наши", "сопро<SHY>вождение" does not start a new word.
const SHY = String.fromCharCode(0x00ad)
const plain = (text) => String(text).split(SHY).join('')
const speaksAsWe = (code, text) => FIRST_PERSON_PLURAL[code].test(plain(text))

const strings = (node, prefix = '') =>
  Object.entries(node).flatMap(([key, value]) =>
    value && typeof value === 'object' ? strings(value, `${prefix}${key}.`) : [[`${prefix}${key}`, value]]
  )

describe('voice', () => {
  it.each(['en', 'ru', 'he'])('%s copy speaks as "I", not "we"', (code) => {
    const offenders = strings(translations[code])
      .filter(([, text]) => speaksAsWe(code, text))
      .map(([key]) => key)
    expect(offenders).toEqual([])
  })

  // RU and HE conjugate "we" into the verb with no pronoun ("Держим сайт…", "שומרים על האתר…"), which
  // FIRST_PERSON_PLURAL cannot see. Deny the plural verb forms the old copy used (and close kin).
  const PLURAL_VERBS = {
    ru: /(^|[^а-яё])(держим|добавим|улучшим|оптимизируем|обновим|подключаем|добавляем|сделаем|делаем|работаем|поможем|создаём|создаем)(?=[^а-яё]|$)/i,
    he: /(^|[\s"״(])(שומרים|מחברים|מוסיפים|בונים|נבנה עבורך|נבנה עבורכם|נחזור|ניצור)(?=[\s,.!?—:]|$)/,
  }

  it.each(['ru', 'he'])('%s copy uses singular verbs, not "we"-conjugated ones', (code) => {
    const offenders = strings(translations[code])
      .filter(([, text]) => PLURAL_VERBS[code].test(plain(text)))
      .map(([key]) => key)
    expect(offenders).toEqual([])
  })
})

// The detector itself is a contract: if it stops catching "we", the voice test above passes vacuously.
describe('voice detector', () => {
  const caught = {
    en: ['Our Services', 'Contact us', 'We keep your website stable', 'the same approach we use', 'Ours.'],
    ru: ['Наши услуги', 'Связаться с нами', 'Сделаем? Нет — мы сделаем', `на${SHY}ши работы`, 'О нас'],
    he: ['השירותים שלנו', 'אנחנו משתמשים', 'כפי ש אנו עושים'],
  }
  const innocent = {
    en: ['Services', 'About me', 'Business', 'Status', 'Trust', 'Get in touch', 'Let’s work together'],
    ru: [
      `Поддержка и сопро${SHY}вождение`,
      `Образо${SHY}вательная платформа`,
      `Кросс${SHY}платфор${SHY}менное приложение II`,
      'Настройка',
      'Обо мне',
      'Связаться со мной',
    ],
    he: ['שירותים', 'עליי', 'צרו קשר', 'כתבו לי', 'אנונימי'],
  }

  it.each(['en', 'ru', 'he'])('%s: flags first-person plural', (code) => {
    for (const text of caught[code]) expect(speaksAsWe(code, text), text).toBe(true)
  })

  it.each(['en', 'ru', 'he'])('%s: leaves singular and neutral copy alone (incl. soft hyphens)', (code) => {
    for (const text of innocent[code]) expect(speaksAsWe(code, text), text).toBe(false)
  })

  it('the RU titles really carry soft hyphens (so the stripping above is exercised)', () => {
    const titles = strings(translations.ru).filter(([, text]) => String(text).includes(SHY))
    expect(titles.length).toBeGreaterThan(0)
  })
})
