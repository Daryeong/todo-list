import { createDefaultSettings, type Settings } from '../types/settings'
import type { Task } from '../types/task'

export const STORAGE_KEY = 'todo-coach-app'

export interface StoredAppState {
  tasks: Task[]
  settings: Settings
}

export const createEmptyState = (): StoredAppState => ({
  tasks: [],
  settings: createDefaultSettings(),
})

export const loadStoredState = (): StoredAppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return createEmptyState()
    }

    const parsed = JSON.parse(raw) as Partial<StoredAppState>
    const defaultSettings = createDefaultSettings()

    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      settings: {
        ...defaultSettings,
        ...(parsed.settings ?? {}),
        labels: {
          ...defaultSettings.labels,
          ...(parsed.settings?.labels ?? {}),
        },
      },
    }
  } catch {
    return createEmptyState()
  }
}

export const saveStoredState = (state: StoredAppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    return
  }
}
