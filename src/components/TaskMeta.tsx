import { daysFromTo } from '../lib/date'
import type { Importance, Task } from '../types/task'
import { DeleteButton } from './DeleteButton'

const importanceLabel: Record<Importance, string> = {
  low: '낮음',
  medium: '보통',
  high: '높음',
}

const formatMonthDay = (value: string) => {
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return `${date.getMonth() + 1}.${date.getDate()}.`
}

export const isDueSoon = (task: Task, today: string) => {
  const remainingDays = daysFromTo(today, task.dueDate)
  return remainingDays >= 0 && remainingDays <= 1
}

export const TaskMeta = ({
  task,
  today,
  dueSoonLabel,
  onDelete,
}: {
  task: Task
  today: string
  dueSoonLabel: string
  onDelete: (taskId: string) => void
}) => {
  const dueSoon = isDueSoon(task, today)

  return (
    <div className="task-meta" aria-label="할 일 정보">
      {dueSoon ? <span className="task-urgency-badge">{dueSoonLabel}</span> : null}
      <span className="task-meta__item">
        <span className="task-meta__label">중요도</span>
        <span className={`task-importance task-importance--${task.importance}`}>{importanceLabel[task.importance]}</span>
      </span>
      <span className="task-meta__separator" aria-hidden="true">
        |
      </span>
      <span className="task-meta__item">
        <span className="task-meta__label">시작일</span>
        <span className="task-meta__value">{formatMonthDay(task.startDate)}</span>
      </span>
      <span className="task-meta__separator" aria-hidden="true">
        |
      </span>
      <span className="task-meta__item">
        <span className="task-meta__label">마감일</span>
        <span className="task-meta__value">{formatMonthDay(task.dueDate)}</span>
      </span>
      <DeleteButton className="delete-button--inline" onDelete={onDelete} taskId={task.id} />
    </div>
  )
}
