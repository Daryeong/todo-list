import type { KeyboardEvent } from 'react'

import type { Task } from '../types/task'
import { TaskMeta } from './TaskMeta'

export const TaskItem = ({
  task,
  today,
  dueSoonLabel,
  onDelete,
  onOpenDetail,
  completed = false,
}: {
  task: Task
  today: string
  dueSoonLabel: string
  onDelete: (taskId: string) => void
  onOpenDetail?: (taskId: string) => void
  completed?: boolean
}) => {
  const openDetail = () => onOpenDetail?.(task.id)

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onOpenDetail) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openDetail()
    }
  }

  return (
    <article
      className={`task-card task-item ${completed ? 'task-item--completed' : ''}`}
      onClick={onOpenDetail ? openDetail : undefined}
      onKeyDown={onOpenDetail ? handleKeyDown : undefined}
      role={onOpenDetail ? 'button' : undefined}
      tabIndex={onOpenDetail ? 0 : undefined}
    >
      <div className="task-item__content">
        <div className="task-item__header">
          <strong className="task-item__title">{task.title}</strong>
        </div>
        <TaskMeta dueSoonLabel={dueSoonLabel} onDelete={onDelete} task={task} today={today} />
      </div>
    </article>
  )
}
