import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import useMotionAllowed from './useMotionAllowed'
import useA11y from '../a11y/useA11y'
import { mockMatchMedia } from '../test/matchMedia'
import { createWrapper } from '../test/renderWithProviders'

const REDUCE = '(prefers-reduced-motion: reduce)'
const useBoth = () => ({ allowed: useMotionAllowed(), a11y: useA11y() })

describe('useMotionAllowed', () => {
  it('allows motion by default', () => {
    const { result } = renderHook(useBoth, { wrapper: createWrapper() })
    expect(result.current.allowed).toBe(true)
  })

  it('blocks motion when the OS asks for reduced motion', () => {
    mockMatchMedia({ [REDUCE]: true })
    const { result } = renderHook(useBoth, { wrapper: createWrapper() })
    expect(result.current.allowed).toBe(false)
  })

  it('reacts when the OS setting changes', () => {
    const media = mockMatchMedia()
    const { result } = renderHook(useBoth, { wrapper: createWrapper() })
    act(() => media.set(REDUCE, true))
    expect(result.current.allowed).toBe(false)
  })

  it('blocks motion when the accessibility widget toggle is on', () => {
    const { result } = renderHook(useBoth, { wrapper: createWrapper() })
    act(() => result.current.a11y.toggleReduceMotion())
    expect(result.current.allowed).toBe(false)
  })
})
