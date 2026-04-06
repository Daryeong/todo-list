import { describe, expect, it } from 'vitest'

import { createDefaultSettings } from './settings'

describe('createDefaultSettings', () => {
  it('returns the agreed MVP defaults', () => {
    const settings = createDefaultSettings()

    expect(settings.todayThresholdDays).toBe(0)
    expect(settings.lateThresholdDays).toBe(0)
    expect(settings.flexibleThresholdDays).toBe(7)
    expect(settings.labels.today).toBe('마감 임박')
    expect(settings.labels.late).toBe('늦은 일')
    expect(settings.labels.flexible).toBe('여유')
    expect(settings.tone).toBe('encouraging')
  })
})
