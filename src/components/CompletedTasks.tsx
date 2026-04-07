import { formatShortKoreanDate } from '../lib/date'
import type { Task } from '../types/task'

export const CompletedTasks = ({ tasks, onDelete }: { tasks: Task[]; onDelete: (taskId: string) => void }) => (
  <div>
    <div className="panel-title-row">
      <div>
        <h2>오늘 완료한 일</h2>
        <p className="section-caption">오늘 끝낸 일들이 여기에 쌓여요.</p>
      </div>
    </div>
    <div className="task-stack">
      {tasks.length === 0 ? <p>오늘 완료한 일이 아직 없어요.</p> : null}
      {tasks.map((task) => (
        <article className="task-card task-card--completed" key={task.id}>
          <div className="task-card-row">
            <div className="task-card-status">
              <span className="completed-mark" aria-hidden="true">완료</span>
            </div>
          </div>
          <div className="task-card-content">
            <span className="completed-title">{task.title}</span>
            <span className="task-date">{formatShortKoreanDate(task.dueDate)}</span>
            <button className="tiny-delete-btn" onClick={() => onDelete(task.id)} type="button">×</button>
          </div>
        </article>
      ))}
    </div>
  </div>
)
