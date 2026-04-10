import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { Task } from '../types/task'
import { CompletedTasks } from './CompletedTasks'

const task: Task = {
  id: 'task-1',
  title: '정리 완료',
  startDate: '2026-04-08',
  dueDate: '2026-04-09',
  importance: 'medium',
  memo: '',
  steps: [],
  manualStatuses: {},
  completedAt: '2026-04-10T18:00:00.000Z',
  createdAt: '2026-04-08T09:00:00.000Z',
}

describe('CompletedTasks', () => {
  it('keeps the same compact layout for completed tasks', () => {
    render(<CompletedTasks dueSoonLabel="오늘 라벨" tasks={[task]} today="2026-04-10" onDelete={vi.fn()} />)

    const item = screen.getByText('정리 완료').closest('article')

    expect(item).not.toBeNull()
    if (!item) {
      return
    }

    const text = within(item).getByLabelText('할 일 정보').textContent?.replace(/\s+/g, ' ')

    expect(text).toContain('중요도')
    expect(text).toContain('시작일')
    expect(text).toContain('마감일')
    expect(within(item).getByLabelText('삭제')).toBeInTheDocument()
  })
})
