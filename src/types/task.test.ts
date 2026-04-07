import { describe, expect, it } from 'vitest'

import { createTask } from './task'

describe('createTask', () => {
  it('creates a task with default MVP fields', () => {
    const task = createTask(
      {
        title: '발표 자료 만들기',
        startDate: '2026-04-06',
        dueDate: '2026-04-08',
        importance: 'high',
      },
      '2026-04-06T09:30:00.000Z',
    )

    expect(task.id).toBeTruthy()
    expect(task.title).toBe('발표 자료 만들기')
    expect(task.startDate).toBe('2026-04-06')
    expect(task.dueDate).toBe('2026-04-08')
    expect(task.importance).toBe('high')
    expect(task.memo).toBe('')
    expect(task.steps).toEqual([])
    expect(task.manualStatuses).toEqual({})
    expect(task.completedAt).toBeNull()
  })
})
