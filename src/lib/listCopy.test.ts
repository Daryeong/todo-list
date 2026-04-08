import { describe, expect, it } from 'vitest'

import { getListCopy } from './listCopy'

describe('getListCopy', () => {
  it('changes by date', () => {
    expect(getListCopy('encouraging', '2026-04-06')).not.toBe(getListCopy('encouraging', '2026-04-07'))
  })

  it('uses a different pool for plain tone', () => {
    expect(getListCopy('encouraging', '2026-04-06')).not.toBe(getListCopy('plain', '2026-04-06'))
  })
})
