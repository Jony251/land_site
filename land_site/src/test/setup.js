import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { mockMatchMedia } from './matchMedia'

beforeEach(() => {
  mockMatchMedia()
  window.scrollTo = vi.fn()
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  document.documentElement.removeAttribute('dir')
  vi.clearAllMocks()
})
