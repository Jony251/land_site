import { describe, expect, it } from 'vitest'
import { sortByTier, toPreviewItems, TIER_ORDER } from './projectItems'

const P = (id, tier) => ({ id, tier, titleKey: `t.${id}`, thumbnail: `/${id}.jpg` })

describe('projectItems', () => {
  it('orders projects flagship → product → craft, keeping order inside a tier', () => {
    const sorted = sortByTier([P('c1', 'craft'), P('p1', 'product'), P('f1', 'flagship'), P('c2', 'craft'), P('f2', 'flagship')])
    expect(sorted.map((p) => p.id)).toEqual(['f1', 'f2', 'p1', 'c1', 'c2'])
    expect(TIER_ORDER).toEqual(['flagship', 'product', 'craft'])
  })

  it('does not mutate its input', () => {
    const input = [P('c1', 'craft'), P('f1', 'flagship')]
    sortByTier(input)
    expect(input.map((p) => p.id)).toEqual(['c1', 'f1'])
  })

  it('maps projects to HoverPreviewList items', () => {
    const t = (key) => `«${key}»`
    expect(toPreviewItems([P('x', 'product')], t)).toEqual([
      { id: 'x', href: '/works/x', title: '«t.x»', meta: '«works.tier.product»', image: '/x.jpg' },
    ])
  })
})
