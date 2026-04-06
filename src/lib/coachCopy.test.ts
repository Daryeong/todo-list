import { describe, expect, it } from 'vitest'

import { getCoachCopy } from './coachCopy'

describe('getCoachCopy', () => {
  it('changes by date', () => {
    expect(getCoachCopy('encouraging', '2026-04-06')).not.toBe(getCoachCopy('encouraging', '2026-04-07'))
  })

  it('uses a different pool for plain tone', () => {
    expect(getCoachCopy('encouraging', '2026-04-06')).not.toBe(getCoachCopy('plain', '2026-04-06'))
  })
})
