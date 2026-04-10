import type { Task } from '../types/task'
import { TaskItem } from './TaskItem'

export const CompletedTasks = ({
  tasks,
  today,
  dueSoonLabel,
  onDelete,
}: {
  tasks: Task[]
  today: string
  dueSoonLabel: string
  onDelete: (taskId: string) => void
}) => (
  <div>
    <div className="panel-title-row">
      <div>
        <h2>오늘 완료한 일</h2>
        <p className="section-caption">오늘 끝낸 작업이 여기에 쌓입니다.</p>
      </div>
    </div>
    <div className="task-stack">
      {tasks.length === 0 ? <p>오늘 완료한 일이 아직 없어요.</p> : null}
      {tasks.map((task) => (
        <TaskItem dueSoonLabel={dueSoonLabel} key={task.id} task={task} today={today} onDelete={onDelete} completed />
      ))}
    </div>
  </div>
)
