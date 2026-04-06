export type Importance = 'low' | 'medium' | 'high'

export type ManualStatuses = Partial<Record<'today' | 'late' | 'flexible', boolean>>

export interface Task {
  id: string
  title: string
  dueDate: string
  importance: Importance
  memo: string
  steps: string[]
  manualStatuses: ManualStatuses
  completedAt: string | null
  createdAt: string
}

export interface TaskInput {
  title: string
  dueDate: string
  importance: Importance
}

export const createTask = (input: TaskInput, now: string) => ({
  id: crypto.randomUUID(),
  title: input.title.trim(),
  dueDate: input.dueDate,
  importance: input.importance,
  memo: '',
  steps: [],
  manualStatuses: {},
  completedAt: null,
  createdAt: now,
}) satisfies Task
