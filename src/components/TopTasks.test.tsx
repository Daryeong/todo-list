import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { Task } from '../types/task'
import { TopTasks } from './TopTasks'

const task: Task = {
  id: 'task-1',
  title: '보고서 제출',
  startDate: '2026-04-10',
  dueDate: '2026-04-11',
  importance: 'high',
  memo: '메모',
  steps: [],
  manualStatuses: {},
  completedAt: null,
  createdAt: '2026-04-10T09:00:00.000Z',
}

describe('TopTasks', () => {
  it('shows the compact metadata row in due-soon, importance, start date, due date order', () => {
    render(
      <TopTasks
        dueSoonLabel="오늘 라벨"
        tasks={[task]}
        today="2026-04-10"
        onOpenDetail={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    const item = screen.getByText('보고서 제출').closest('article')

    expect(item).not.toBeNull()
    if (!item) {
      return
    }

    const text = within(item).getByLabelText('할 일 정보').textContent?.replace(/\s+/g, ' ')

    expect(text).toContain('오늘 라벨')
    expect(text).toContain('중요도')
    expect(text).toContain('높음')
    expect(text).toContain('시작일')
    expect(text).toContain('마감일')
    expect(text).toMatch(/오늘 라벨\s*중요도\s*높음\s*\|\s*시작일\s*4\.10\.\s*\|\s*마감일\s*4\.11\./)
    expect(within(item).getByLabelText('삭제')).toBeInTheDocument()
  })

  it('does not show the due-soon badge when the task is far from the due date', () => {
    render(
      <TopTasks
        dueSoonLabel="오늘 라벨"
        tasks={[
          {
            ...task,
            id: 'task-2',
            dueDate: '2026-04-20',
          },
        ]}
        today="2026-04-10"
        onOpenDetail={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    expect(screen.queryByText('오늘 라벨')).not.toBeInTheDocument()
  })
})
