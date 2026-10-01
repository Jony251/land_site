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
