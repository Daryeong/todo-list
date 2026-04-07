import { formatShortKoreanDate } from '../lib/date'
import type { Task } from '../types/task'

export const TopTasks = ({
  tasks,
  onOpenDetail,
  onComplete,
}: {
  tasks: Task[]
  onOpenDetail: (taskId: string) => void
  onComplete: (taskId: string) => void
}) => (
  <div>
    <div className="panel-title-row">
      <div>
        <h2>할 일 목록</h2>
        <p className="section-caption">지금 해야 할 일들을 한 번에 보고 체크할 수 있어요.</p>
      </div>
    </div>
    <div className="task-stack">
      {tasks.length === 0 ? <p>아직 할 일이 없어요. 할 일을 추가하면 여기 쌓여요.</p> : null}
      {tasks.map((task) => (
        <article className="task-card" key={task.id} onClick={() => onOpenDetail(task.id)} role="button" tabIndex={0}>
          <div className="task-card-main" onClick={(e) => e.stopPropagation()}>
            <div className="task-card-status">
              <input
                aria-label={`${task.title} 완료`}
                className="task-check"
                checked={Boolean(task.completedAt)}
                onChange={() => onComplete(task.id)}
                type="checkbox"
              />
            </div>
            <div className="task-card-copy" onClick={() => onOpenDetail(task.id)} role="button" tabIndex={0}>
              <strong>{task.title}</strong>
              {task.memo ? <p className="task-meta">{task.memo}</p> : null}
            </div>
            <div className="task-card-side" onClick={() => onOpenDetail(task.id)} role="button" tabIndex={0}>
              <span className="task-date">{formatShortKoreanDate(task.dueDate)}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
)
