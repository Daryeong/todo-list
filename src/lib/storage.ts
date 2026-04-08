import { createDefaultSettings, type Settings } from '../types/settings'
import type { Task } from '../types/task'
import { toDateOnly } from './date'

export const STORAGE_KEY = 'todo-list-app'

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
    const storedSettings = parsed.settings as Partial<Settings> & {
      labels?: {
        today?: string
      }
    }

    const todayLabel =
      typeof storedSettings?.todayLabel === 'string'
        ? storedSettings.todayLabel
        : typeof storedSettings?.labels?.today === 'string'
          ? storedSettings.labels.today
          : defaultSettings.todayLabel

    const tone =
      storedSettings?.tone && ['encouraging', 'plain', 'funny', 'strict'].includes(storedSettings.tone)
        ? storedSettings.tone
        : defaultSettings.tone

    return {
      tasks: Array.isArray(parsed.tasks)
        ? (parsed.tasks.map((task) => {
            const candidate = task as Partial<Task>

            return {
              ...candidate,
              startDate: candidate.startDate ?? candidate.dueDate ?? toDateOnly(candidate.createdAt ?? new Date().toISOString()),
            }
          }) as Task[])
        : [],
      settings: {
        ...defaultSettings,
        todayLabel,
        tone,
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
