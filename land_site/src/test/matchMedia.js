/**
 * Replaces `window.matchMedia` with a controllable fake.
 *
 * Input:
 * - `initial` (object): media query string -> boolean. Unknown queries are `false`.
 *
 * Output:
 * - `{ set(query, matches) }` — changes a query result and fires its `change` listeners.
 */
export const mockMatchMedia = (initial = {}) => {
  const state = { ...initial }
  const listeners = new Map()

  window.matchMedia = (query) => ({
    get matches() {
      return Boolean(state[query])
    },
    media: query,
    addEventListener: (_type, cb) => {
      if (!listeners.has(query)) listeners.set(query, new Set())
      listeners.get(query).add(cb)
    },
    removeEventListener: (_type, cb) => listeners.get(query)?.delete(cb),
  })

  return {
    set(query, matches) {
      state[query] = matches
      listeners.get(query)?.forEach((cb) => cb({ matches, media: query }))
    },
  }
}
