import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTodoApp } from './useTodoApp'

describe('useTodoApp', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds tasks and keeps active tasks available in order', () => {
    const { result } = renderHook(() => useTodoApp('2026-04-06'))

    act(() => {
      result.current.addTask({ title: '늦은 일', startDate: '2026-04-04', dueDate: '2026-04-05', importance: 'medium' })
      result.current.addTask({ title: '오늘 일', startDate: '2026-04-06', dueDate: '2026-04-06', importance: 'medium' })
      result.current.addTask({ title: '중요한 일', startDate: '2026-04-07', dueDate: '2026-04-08', importance: 'high' })
      result.current.addTask({ title: '여유 일', startDate: '2026-04-10', dueDate: '2026-04-20', importance: 'low' })
    })

    expect(result.current.openTasks).toHaveLength(4)
    expect(result.current.openTasks[0]?.title).toBe('늦은 일')
  })

  it('completes tasks and moves them to the completed list', () => {
    const { result } = renderHook(() => useTodoApp('2026-04-06'))

    act(() => {
      result.current.addTask({ title: '완료할 일', startDate: '2026-04-06', dueDate: '2026-04-06', importance: 'medium' })
    })

    act(() => {
      result.current.completeTask(result.current.tasks[0]!.id)
    })

    expect(result.current.completedTasks).toHaveLength(1)
    expect(result.current.openTasks).toHaveLength(0)
    expect(result.current.todayCompletedCount).toBe(1)
  })

  it('shows only today completed tasks in the today-completed list', () => {
    localStorage.setItem(
      'todo-coach-app',
      JSON.stringify({
        tasks: [
          {
            id: 'old-done',
            title: '어제 끝낸 일',
            startDate: '2026-04-04',
            dueDate: '2026-04-05',
            importance: 'medium',
            memo: '',
            steps: [],
            manualStatuses: {},
            completedAt: '2026-04-05T18:00:00.000Z',
            createdAt: '2026-04-05T09:00:00.000Z',
          },
          {
            id: 'today-done',
            title: '오늘 끝낸 일',
            startDate: '2026-04-06',
            dueDate: '2026-04-06',
            importance: 'medium',
            memo: '',
            steps: [],
            manualStatuses: {},
            completedAt: '2026-04-06T18:00:00.000Z',
            createdAt: '2026-04-06T09:00:00.000Z',
          },
        ],
        settings: {
          todayThresholdDays: 0,
          lateThresholdDays: 0,
          flexibleThresholdDays: 7,
          labels: { today: '마감 임박', late: '늦은 일', flexible: '여유' },
          tone: 'encouraging',
        },
      }),
    )

    const { result } = renderHook(() => useTodoApp('2026-04-06'))

    expect(result.current.todayCompletedTasks).toHaveLength(1)
    expect(result.current.todayCompletedTasks[0]?.title).toBe('오늘 끝낸 일')
  })

  it('moves a task to tomorrow', () => {
    const { result } = renderHook(() => useTodoApp('2026-04-06'))

    act(() => {
      result.current.addTask({ title: '내일로', startDate: '2026-04-06', dueDate: '2026-04-06', importance: 'medium' })
    })

    act(() => {
      result.current.moveTaskToTomorrow(result.current.tasks[0]!.id)
    })

    expect(result.current.tasks[0]?.dueDate).toBe('2026-04-07')
  })

  it('updates settings and persists them', () => {
    const { result } = renderHook(() => useTodoApp('2026-04-06'))

    act(() => {
      result.current.updateSettings({
        flexibleThresholdDays: 10,
        labels: {
          today: '오늘 꼭',
          late: '밀린 일',
          flexible: '천천히',
        },
      })
    })

    expect(result.current.settings.flexibleThresholdDays).toBe(10)
    expect(result.current.settings.labels.today).toBe('오늘 꼭')
    expect(JSON.parse(localStorage.getItem('todo-coach-app') ?? '{}').settings.labels.today).toBe('오늘 꼭')
  })

  it('edits memo and status overrides', () => {
    const { result } = renderHook(() => useTodoApp('2026-04-06'))

    act(() => {
      result.current.addTask({ title: '상세 편집', startDate: '2026-04-06', dueDate: '2026-04-15', importance: 'low' })
    })

    act(() => {
      result.current.updateTask(result.current.tasks[0]!.id, {
        memo: '체크할 메모',
        manualStatuses: { today: true, flexible: false },
        importance: 'high',
      })
    })

    expect(result.current.tasks[0]?.memo).toBe('체크할 메모')
    expect(result.current.tasks[0]?.manualStatuses.today).toBe(true)
    expect(result.current.tasks[0]?.importance).toBe('high')
  })

  it('keeps start date when editing a task', () => {
    const { result } = renderHook(() => useTodoApp('2026-04-06'))

    act(() => {
      result.current.addTask({ title: '시작일 테스트', startDate: '2026-04-06', dueDate: '2026-04-10', importance: 'medium' })
    })

    act(() => {
      result.current.updateTask(result.current.tasks[0]!.id, { startDate: '2026-04-08' })
    })

    expect(result.current.tasks[0]?.startDate).toBe('2026-04-08')
  })

  it('hydrates from localStorage once', () => {
    vi.spyOn(Storage.prototype, 'getItem')
    localStorage.setItem(
      'todo-coach-app',
      JSON.stringify({
        tasks: [],
        settings: {
          todayThresholdDays: 1,
          lateThresholdDays: 0,
          flexibleThresholdDays: 7,
          labels: { today: '오늘', late: '늦음', flexible: '여유' },
          tone: 'plain',
        },
      }),
    )

    const { result } = renderHook(() => useTodoApp('2026-04-06'))

    expect(result.current.settings.tone).toBe('plain')
  })
})
