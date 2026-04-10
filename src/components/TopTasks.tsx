import type { Task } from '../types/task'
import { TaskItem } from './TaskItem'

export const TopTasks = ({
  tasks,
  today,
  dueSoonLabel,
  onOpenDetail,
  onDelete,
}: {
  tasks: Task[]
  today: string
  dueSoonLabel: string
  onOpenDetail: (taskId: string) => void
  onDelete: (taskId: string) => void
}) => (
  <div>
    <div className="panel-title-row">
      <div>
        <h2>할 일 목록</h2>
        <p className="section-caption">시작일, 마감일, 중요도와 마감임박 상태를 함께 볼 수 있습니다.</p>
      </div>
    </div>

    <div className="task-stack">
      {tasks.length === 0 ? <p>아직 할 일이 없어요. 오른쪽 입력창에서 새 작업을 추가해보세요.</p> : null}

      {tasks.map((task) => (
        <TaskItem
          dueSoonLabel={dueSoonLabel}
          key={task.id}
          task={task}
          today={today}
          onDelete={onDelete}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  </div>
)
