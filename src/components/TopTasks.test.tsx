import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { Task } from '../types/task'
import { TopTasks } from './TopTasks'

const task: Task = {
  id: 'task-1',
  title: '보고서 제출',
  startDate: '2026-04-08',
  dueDate: '2026-04-10',
  importance: 'high',
  memo: '문서 정리',
  steps: [],
  manualStatuses: {},
  completedAt: null,
  createdAt: '2026-04-08T09:00:00.000Z',
}

describe('TopTasks', () => {
  it('shows only the task title in the list card', () => {
    render(<TopTasks tasks={[task]} onOpenDetail={vi.fn()} onDelete={vi.fn()} />)

    expect(screen.getByText('보고서 제출')).toBeInTheDocument()
    expect(screen.queryByText('문서 정리')).not.toBeInTheDocument()
    expect(screen.queryByText('마감일 임박 · D-2')).not.toBeInTheDocument()
    expect(screen.queryByText('[높음]')).not.toBeInTheDocument()
    expect(screen.queryByText('4.8 ~ 4.10')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('보고서 제출 완료')).not.toBeInTheDocument()
  })
})
