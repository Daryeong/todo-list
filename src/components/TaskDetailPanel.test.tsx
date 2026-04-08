import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import type { Task } from '../types/task'
import { TaskDetailPanel } from './TaskDetailPanel'

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'task-1',
  title: '보고서 제출',
  startDate: '2026-04-05',
  dueDate: '2026-04-06',
  importance: 'medium',
  memo: '',
  steps: [],
  manualStatuses: {},
  completedAt: null,
  createdAt: '2026-04-06T09:00:00.000Z',
  ...overrides,
})

describe('TaskDetailPanel', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses calendar chips for dates and circle buttons for importance', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onDelete = vi.fn()
    const onMoveToTomorrow = vi.fn()
    const onSave = vi.fn()

    render(
      <TaskDetailPanel
        task={createTask()}
        onClose={onClose}
        onDelete={onDelete}
        onMoveToTomorrow={onMoveToTomorrow}
        onSave={onSave}
      />,
    )

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /시작일/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /마감일/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '중요도 낮음' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '중요도 보통' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '중요도 높음' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /시작일/ }))
    const calendar = screen.getByRole('dialog', { name: '시작일 선택 달력' })
    await user.click(within(calendar).getByRole('button', { name: '7' }))

    await user.click(screen.getByRole('button', { name: '중요도 높음' }))
    await user.click(screen.getByRole('button', { name: '저장' }))

    expect(onSave).toHaveBeenCalledWith(
      'task-1',
      expect.objectContaining({
        startDate: '2026-04-07',
        importance: 'high',
      }),
    )
  })

  it('fetches AI step templates and fills the step list', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onDelete = vi.fn()
    const onMoveToTomorrow = vi.fn()
    const onSave = vi.fn()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ steps: ['준비하기', '실행하기', '마무리하기'] }),
    })

    vi.stubGlobal('fetch', fetchMock)

    render(
      <TaskDetailPanel
        task={createTask({ title: '운동' })}
        onClose={onClose}
        onDelete={onDelete}
        onMoveToTomorrow={onMoveToTomorrow}
        onSave={onSave}
      />,
    )

    await user.click(screen.getByRole('button', { name: '단계 템플릿 추천' }))

    await waitFor(() => {
      expect(screen.getByText('준비하기')).toBeInTheDocument()
      expect(screen.getByText('실행하기')).toBeInTheDocument()
      expect(screen.getByText('마무리하기')).toBeInTheDocument()
    })

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/step-templates',
      expect.objectContaining({
        method: 'POST',
      }),
    )
  })

  it('deletes the task from the detail panel', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    render(
      <TaskDetailPanel
        task={createTask()}
        onClose={vi.fn()}
        onDelete={onDelete}
        onMoveToTomorrow={vi.fn()}
        onSave={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: '삭제하기' }))

    expect(onDelete).toHaveBeenCalledWith('task-1')
  })
})
