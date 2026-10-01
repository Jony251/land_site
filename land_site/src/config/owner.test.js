import { describe, expect, it } from 'vitest'
import { SUPPORTED_LANGUAGES } from '../i18n/translations'
import { OWNER_NAME } from './owner'

describe('OWNER_NAME', () => {
  it.each(SUPPORTED_LANGUAGES.map((l) => l.code))('has a name for %s', (code) => {
    expect(OWNER_NAME[code]).toMatch(/\S/)
  })

  it('uses the owner-approved spellings', () => {
    expect(OWNER_NAME).toEqual({ en: 'Eugeny', ru: 'Евгений', he: 'יבגני' })
  })
})
