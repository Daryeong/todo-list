import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { Task } from '../types/task'
import { TaskDetailPanel } from './TaskDetailPanel'

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'task-1',
  title: '초안 정리',
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
  it('keeps the moved due date when props refresh before save', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onSave = vi.fn()
    const onMoveToTomorrow = vi.fn()
    const initialTask = createTask()

    const { rerender } = render(
      <TaskDetailPanel task={initialTask} onClose={onClose} onMoveToTomorrow={onMoveToTomorrow} onSave={onSave} />,
    )

    await user.click(screen.getByRole('button', { name: '내일로 넘기기' }))
    expect(onMoveToTomorrow).toHaveBeenCalledWith(initialTask.id)

    rerender(
      <TaskDetailPanel
        task={createTask({ dueDate: '2026-04-07' })}
        onClose={onClose}
        onMoveToTomorrow={onMoveToTomorrow}
        onSave={onSave}
      />,
    )

    await user.click(screen.getByRole('button', { name: '저장' }))

    expect(onSave).toHaveBeenCalledWith(initialTask.id, expect.objectContaining({ dueDate: '2026-04-07' }))
  })

  it('trims title and blocks save when title or due date is empty', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onSave = vi.fn()

    render(
      <TaskDetailPanel task={createTask()} onClose={onClose} onMoveToTomorrow={vi.fn()} onSave={onSave} />,
    )

    const titleInput = screen.getByLabelText('제목')
    await user.clear(titleInput)
    await user.type(titleInput, '  다듬은 제목  ')

    const dueDateInput = screen.getByLabelText('마감일')
    await user.clear(dueDateInput)
    await user.click(screen.getByRole('button', { name: '저장' }))

    expect(onSave).not.toHaveBeenCalled()

    await user.type(dueDateInput, '2026-04-08')
    await user.click(screen.getByRole('button', { name: '저장' }))

    expect(onSave).toHaveBeenCalledWith(
      'task-1',
      expect.objectContaining({ title: '다듬은 제목', dueDate: '2026-04-08', startDate: '2026-04-05' }),
    )
    expect(onClose).toHaveBeenCalled()
  })

  it('saves edited start date', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(<TaskDetailPanel task={createTask()} onClose={vi.fn()} onMoveToTomorrow={vi.fn()} onSave={onSave} />)

    const startDateInput = screen.getByLabelText('시작일')
    await user.clear(startDateInput)
    await user.type(startDateInput, '2026-04-07')
    await user.click(screen.getByRole('button', { name: '저장' }))

    expect(onSave).toHaveBeenCalledWith('task-1', expect.objectContaining({ startDate: '2026-04-07' }))
  })
})
