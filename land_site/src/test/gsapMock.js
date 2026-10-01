import { vi } from 'vitest'
import { useGSAP } from '@gsap/react'

/**
 * Test double for `src/motion/gsap.js`.
 * Usage: `vi.mock('../motion/gsap', () => import('../test/gsapMock'))` (adjust paths).
 */
export const gsap = {
  from: vi.fn(),
  to: vi.fn(),
  set: vi.fn(),
  fromTo: vi.fn(() => ({ timeScale: vi.fn(), isActive: vi.fn(() => false), kill: vi.fn() })),
  quickTo: vi.fn(() => vi.fn()),
  ticker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() },
  utils: { clamp: (min, max, value) => Math.min(max, Math.max(min, value)) },
}

export const ScrollTrigger = { update: vi.fn(), create: vi.fn() }

export const SplitText = {
  create: vi.fn((el, options) => options?.onSplit?.({ lines: [el] })),
}

export { useGSAP }
