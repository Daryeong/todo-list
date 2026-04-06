import { describe, expect, it, vi } from 'vitest'

import { createDefaultSettings } from '../types/settings'
import { createEmptyState, loadStoredState, saveStoredState, STORAGE_KEY } from './storage'

describe('storage', () => {
  it('returns an empty state when localStorage read fails', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('offline storage unavailable')
    })

    expect(loadStoredState()).toEqual(createEmptyState())

    getItemSpy.mockRestore()
  })

  it('does not throw when localStorage write fails', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('offline storage unavailable')
    })

    expect(() =>
      saveStoredState({
        tasks: [],
        settings: createDefaultSettings(),
      }),
    ).not.toThrow()

    expect(setItemSpy).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify({
        tasks: [],
        settings: createDefaultSettings(),
      }),
    )

    setItemSpy.mockRestore()
  })

  it('ignores unknown fields from storage', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        tasks: [],
        settings: createDefaultSettings(),
        pinnedTopTaskIds: ['task-1', 42, null, 'task-2'],
      }),
    )

    expect(loadStoredState()).toEqual(createEmptyState())
  })
})
