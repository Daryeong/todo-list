import type { Task } from '../types/task'

export const TopTasks = ({
  tasks,
  onOpenDetail,
  onDelete,
}: {
  tasks: Task[]
  onOpenDetail: (taskId: string) => void
  onDelete: (taskId: string) => void
}) => (
  <div>
    <div className="panel-title-row">
      <div>
        <h2>할 일 목록</h2>
        <p className="section-caption">목록에서는 제목만 보여서 더 빠르게 훑을 수 있습니다.</p>
      </div>
    </div>

    <div className="task-stack">
      {tasks.length === 0 ? <p>아직 할 일이 없습니다. 새 할 일을 추가해 보세요.</p> : null}

      {tasks.map((task) => (
        <article
          className="task-card task-card--minimal"
          key={task.id}
          onClick={() => onOpenDetail(task.id)}
          role="button"
          tabIndex={0}
        >
          <div className="task-card-minimal-row">
            <strong>{task.title}</strong>
            <button
              className="tiny-delete-btn"
              onClick={(event) => {
                event.stopPropagation()
                onDelete(task.id)
              }}
              type="button"
            >
              삭제
            </button>
          </div>
        </article>
      ))}
    </div>
  </div>
)
