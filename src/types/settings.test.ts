import { describe, expect, it } from 'vitest'

import { createDefaultSettings } from './settings'

describe('createDefaultSettings', () => {
  it('returns the simplified classification defaults', () => {
    const settings = createDefaultSettings()

    expect(settings).toEqual({
      todayLabel: '오늘 라벨',
      tone: 'encouraging',
    })
  })
})
