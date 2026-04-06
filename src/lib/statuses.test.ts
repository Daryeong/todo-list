import { describe, expect, it } from 'vitest'

import type { Task } from '../types/task'
import { createDefaultSettings } from '../types/settings'
import { getTaskStatuses } from './statuses'

const baseTask: Task = {
  id: 'task-1',
  title: '운동하기',
  dueDate: '2026-04-06',
  importance: 'medium',
  memo: '',
  steps: [],
  manualStatuses: {},
  completedAt: null,
  createdAt: '2026-04-05T09:00:00.000Z',
}

describe('getTaskStatuses', () => {
  it('marks a task due today', () => {
    const statuses = getTaskStatuses(baseTask, createDefaultSettings(), '2026-04-06')
    expect(statuses.today).toBe(true)
    expect(statuses.late).toBe(false)
    expect(statuses.flexible).toBe(false)
  })

  it('marks a task late after the due date', () => {
    const statuses = getTaskStatuses(baseTask, createDefaultSettings(), '2026-04-07')
    expect(statuses.late).toBe(true)
  })

  it('marks a task flexible when enough time remains', () => {
    const statuses = getTaskStatuses(
      { ...baseTask, dueDate: '2026-04-15' },
      createDefaultSettings(),
      '2026-04-06',
    )
    expect(statuses.flexible).toBe(true)
  })

  it('prefers manual overrides over automatic status values', () => {
    const statuses = getTaskStatuses(
      {
        ...baseTask,
        dueDate: '2026-04-15',
        manualStatuses: { today: true, flexible: false },
      },
      createDefaultSettings(),
      '2026-04-06',
    )

    expect(statuses.today).toBe(true)
    expect(statuses.flexible).toBe(false)
  })
})
