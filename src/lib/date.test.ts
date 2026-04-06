import { describe, expect, it } from 'vitest'

import { addDays, daysFromTo, formatKoreanDate, formatShortKoreanDate, toDateOnly } from './date'

describe('date helpers', () => {
  it('converts an iso timestamp to date-only format', () => {
    expect(toDateOnly('2026-04-06T09:30:00.000Z')).toBe('2026-04-06')
  })

  it('calculates day distance between two date-only values', () => {
    expect(daysFromTo('2026-04-06', '2026-04-08')).toBe(2)
    expect(daysFromTo('2026-04-06', '2026-04-05')).toBe(-1)
  })

  it('adds days to a date-only value', () => {
    expect(addDays('2026-04-06', 1)).toBe('2026-04-07')
  })

  it('formats a date for the app header', () => {
    expect(formatKoreanDate('2026-04-06')).toContain('4월')
  })

  it('formats a short date for task cards', () => {
    expect(formatShortKoreanDate('2026-04-06')).toContain('4.')
  })

  it('returns a placeholder for invalid short dates', () => {
    expect(formatShortKoreanDate('')).toBe('-')
  })
})
