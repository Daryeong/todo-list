import { useEffect, useState } from 'react'

import type { Task } from '../types/task'
import { TaskStepsEditor, getSuggestedSteps } from './TaskStepsEditor'

export const TaskDetailPanel = ({
  task,
  onClose,
  onSave,
  onDelete,
  onMoveToTomorrow,
}: {
  task: Task
  onClose: () => void
  onSave: (taskId: string, patch: Partial<Task>) => void
  onDelete: (taskId: string) => void
  onMoveToTomorrow: (taskId: string) => void
}) => {
  const [draft, setDraft] = useState(task)

  useEffect(() => {
    setDraft(task)
  }, [task])

  const handleSave = () => {
    const nextTitle = draft.title.trim()
    const nextStartDate = draft.startDate.trim()
    const nextDueDate = draft.dueDate.trim()

    if (!nextTitle || !nextStartDate || !nextDueDate) {
      return
    }

    onSave(task.id, {
      title: nextTitle,
      startDate: nextStartDate,
      dueDate: nextDueDate,
      importance: draft.importance,
      memo: draft.memo,
      steps: draft.steps,
      manualStatuses: draft.manualStatuses,
    })
    onClose()
  }

  return (
    <div className="overlay">
      <section className="side-panel">
        <div className="panel-title-row">
          <h2>할 일 상세</h2>
          <button className="ghost-button" onClick={onClose} type="button">
            닫기
          </button>
        </div>
        <div className="detail-grid">
          <label>
            <span>제목</span>
            <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
          </label>
          <label>
            <span>시작일</span>
            <input type="date" value={draft.startDate} onChange={(event) => setDraft({ ...draft, startDate: event.target.value })} />
          </label>
          <label>
            <span>마감일</span>
            <input type="date" value={draft.dueDate} onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })} />
          </label>
          <label>
            <span>중요도</span>
            <select value={draft.importance} onChange={(event) => setDraft({ ...draft, importance: event.target.value as Task['importance'] })}>
              <option value="low">낮음</option>
              <option value="medium">보통</option>
              <option value="high">높음</option>
            </select>
          </label>
          <label>
            <span>메모</span>
            <textarea aria-label="메모" value={draft.memo} onChange={(event) => setDraft({ ...draft, memo: event.target.value })} rows={4} />
          </label>
          <div className="toggle-grid">
            <label><input checked={draft.manualStatuses.today ?? false} onChange={(event) => setDraft({ ...draft, manualStatuses: { ...draft.manualStatuses, today: event.target.checked } })} type="checkbox" />오늘 마감 직접 표시</label>
            <label><input checked={draft.manualStatuses.late ?? false} onChange={(event) => setDraft({ ...draft, manualStatuses: { ...draft.manualStatuses, late: event.target.checked } })} type="checkbox" />늦은 일 직접 표시</label>
            <label><input checked={draft.manualStatuses.flexible ?? false} onChange={(event) => setDraft({ ...draft, manualStatuses: { ...draft.manualStatuses, flexible: event.target.checked } })} type="checkbox" />여유 직접 표시</label>
          </div>
          <button
            className="secondary-button"
            onClick={() => setDraft({ ...draft, steps: getSuggestedSteps(draft.title) })}
            type="button"
          >
            단계 템플릿 추천
          </button>
          <TaskStepsEditor steps={draft.steps} />
          <div className="detail-actions">
            <button className="danger-button" onClick={() => onDelete(task.id)} type="button">
              삭제하기
            </button>
            <button className="ghost-button" onClick={() => onMoveToTomorrow(task.id)} type="button">
              내일로 넘기기
            </button>
            <button
              className="primary-button"
              onClick={handleSave}
              type="button"
            >
              저장
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
