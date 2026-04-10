import { useEffect, useMemo, useRef, useState } from 'react'

import { formatShortKoreanDate } from '../lib/date'
import { getSuggestedSteps, requestTaskStepTemplates } from '../lib/stepRecommendations'
import type { Importance, Task } from '../types/task'
import { TaskStepsEditor } from './TaskStepsEditor'

const importanceOptions: { value: Importance; label: string; dot: string }[] = [
  { value: 'low', label: '낮음', dot: 'importance-dot--low' },
  { value: 'medium', label: '보통', dot: 'importance-dot--medium' },
  { value: 'high', label: '높음', dot: 'importance-dot--high' },
]

type DateTarget = 'start' | 'due'
type CalendarPosition = {
  top: number
  left: number
}

const parseDateOnly = (value: string) => new Date(`${value}T00:00:00`)

const formatDateOnly = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const buildMonthCells = (value: string) => {
  const base = parseDateOnly(value)
  const year = base.getFullYear()
  const month = base.getMonth()
  const firstDay = new Date(year, month, 1)
  const leadingSpaces = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: { key: string; value: string | null }[] = []

  for (let index = 0; index < leadingSpaces; index += 1) {
    cells.push({ key: `empty-${index}`, value: null })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day)
    cells.push({
      key: formatDateOnly(date),
      value: formatDateOnly(date),
    })
  }

  return { year, month, cells }
}

const getDateLabel = (field: DateTarget, value: string) => {
  if (!value) {
    return field === 'start' ? '시작일 선택' : '마감일 선택'
  }

  return `${field === 'start' ? '시작일' : '마감일'} ${formatShortKoreanDate(value)}`
}

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
  const panelRef = useRef<HTMLElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const [draft, setDraft] = useState(task)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateTarget, setDateTarget] = useState<DateTarget>('due')
  const [calendarCursor, setCalendarCursor] = useState(task.dueDate || task.startDate)
  const [calendarPosition, setCalendarPosition] = useState<CalendarPosition | null>(null)
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [suggestionError, setSuggestionError] = useState<string | null>(null)

  useEffect(() => {
    setDraft(task)
    setCalendarCursor(task.dueDate || task.startDate)
  }, [task])

  useEffect(() => {
    if (!showDatePicker) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (popoverRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return
      }

      setShowDatePicker(false)
      setCalendarPosition(null)
    }

    window.addEventListener('mousedown', handlePointerDown)
    return () => window.removeEventListener('mousedown', handlePointerDown)
  }, [showDatePicker])

  const calendarMonth = useMemo(
    () => buildMonthCells(calendarCursor || task.dueDate || task.startDate),
    [calendarCursor, task.dueDate, task.startDate],
  )

  const handleSave = () => {
    const nextTitle = draft.title.trim()

    if (!nextTitle || !draft.startDate.trim() || !draft.dueDate.trim()) {
      return
    }

    onSave(task.id, {
      title: nextTitle,
      startDate: draft.startDate,
      dueDate: draft.dueDate,
      importance: draft.importance,
      memo: draft.memo,
      steps: draft.steps,
    })
    onClose()
  }

  const openDatePickerFor = (target: DateTarget, trigger: HTMLButtonElement) => {
    const rect = trigger.getBoundingClientRect()
    const popoverWidth = 280
    const popoverHeight = 320
    const viewportPadding = 16
    const left = Math.min(
      Math.max(viewportPadding, rect.left),
      Math.max(viewportPadding, window.innerWidth - popoverWidth - viewportPadding),
    )
    const preferredTop = rect.bottom + 8
    const top = Math.min(preferredTop, Math.max(viewportPadding, window.innerHeight - popoverHeight - viewportPadding))

    setDateTarget(target)
    setShowDatePicker(true)
    setCalendarCursor(target === 'due' ? draft.dueDate || draft.startDate : draft.startDate || draft.dueDate)
    setCalendarPosition({ top, left })
  }

  const moveCalendarMonth = (offset: number) => {
    const cursor = parseDateOnly(calendarCursor || task.dueDate || task.startDate)
    cursor.setMonth(cursor.getMonth() + offset)
    setCalendarCursor(formatDateOnly(cursor))
  }

  const applyDate = (value: string) => {
    if (dateTarget === 'due') {
      setDraft((current) => ({ ...current, dueDate: value }))
    } else {
      setDraft((current) => ({ ...current, startDate: value }))
    }
    setShowDatePicker(false)
    setCalendarPosition(null)
  }

  const runStepSuggestion = async () => {
    setIsSuggesting(true)
    setSuggestionError(null)

    try {
      const steps = await requestTaskStepTemplates(
        {
          title: draft.title,
          memo: draft.memo,
          importance: draft.importance,
        },
        {
          endpoint: '/api/step-templates',
        },
      )

      setDraft((current) => ({
        ...current,
        steps: steps.length > 0 ? steps : getSuggestedSteps(current.title, current.memo),
      }))
    } catch {
      setSuggestionError('단계 추천을 불러오지 못했어요. 기본 추천으로 채워둘게요.')
      setDraft((current) => ({ ...current, steps: getSuggestedSteps(current.title, current.memo) }))
    } finally {
      setIsSuggesting(false)
    }
  }

  return (
    <div className="overlay">
      <section className="side-panel" ref={panelRef}>
        <div className="panel-title-row">
          <h2>할 일</h2>
          <button className="ghost-button" onClick={onClose} type="button">
            닫기
          </button>
        </div>

        <div className="detail-grid">
          <label>
            <span>할 일</span>
            <input
              aria-label="할 일"
              value={draft.title}
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
            />
          </label>

          <div className="detail-field">
            <span>시작일</span>
            <button
              aria-label={getDateLabel('start', draft.startDate)}
              className="option-chip option-chip--date detail-date-button detail-date-button--plain"
              onClick={(event) => openDatePickerFor('start', event.currentTarget)}
              type="button"
            >
              <span className="date-chip-text">{draft.startDate ? formatShortKoreanDate(draft.startDate) : '날짜 선택'}</span>
            </button>
          </div>

          <div className="detail-field">
            <span>마감일</span>
            <button
              aria-label={getDateLabel('due', draft.dueDate)}
              className="option-chip option-chip--date detail-date-button"
              onClick={(event) => openDatePickerFor('due', event.currentTarget)}
              type="button"
            >
              <span className="date-chip-icon" aria-hidden="true">
                ○
              </span>
              <span className="date-chip-text">{draft.dueDate ? formatShortKoreanDate(draft.dueDate) : '날짜 선택'}</span>
            </button>
          </div>

          <div className="detail-field">
            <span>중요도</span>
            <div className="importance-choice-grid" role="group" aria-label="중요도 선택">
              {importanceOptions.map((option) => (
                <button
                  aria-label={`중요도 ${option.label}`}
                  aria-pressed={draft.importance === option.value}
                  className={`option-chip importance-choice ${draft.importance === option.value ? 'option-chip--active' : ''}`}
                  key={option.value}
                  onClick={() => setDraft((current) => ({ ...current, importance: option.value }))}
                  type="button"
                >
                  <span className={`importance-dot ${option.dot}`} aria-hidden="true" />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <label>
            <span>메모</span>
            <textarea
              aria-label="메모"
              onChange={(event) => setDraft((current) => ({ ...current, memo: event.target.value }))}
              rows={4}
              value={draft.memo}
            />
          </label>

          <TaskStepsEditor
            isSuggesting={isSuggesting}
            onSuggest={runStepSuggestion}
            steps={draft.steps}
            suggestionError={suggestionError}
          />

          <div className="detail-actions">
            <button className="danger-button" onClick={() => onDelete(task.id)} type="button">
              삭제하기
            </button>
            <button className="ghost-button" onClick={() => onMoveToTomorrow(task.id)} type="button">
              내일로 넘기기
            </button>
            <button className="primary-button" onClick={handleSave} type="button">
              저장
            </button>
          </div>
        </div>

        {showDatePicker ? (
          <div
            aria-label={dateTarget === 'start' ? '시작일 달력' : '마감일 달력'}
            className="calendar-popover"
            ref={popoverRef}
            role="dialog"
            style={
              calendarPosition
                ? {
                    left: `${calendarPosition.left}px`,
                    top: `${calendarPosition.top}px`,
                  }
                : undefined
            }
          >
            <div className="calendar-header">
              <button aria-label="이전 달" className="calendar-nav" onClick={() => moveCalendarMonth(-1)} type="button">
                ‹
              </button>
              <div className="calendar-title-group">
                <button aria-label={`${calendarMonth.year}년`} className="calendar-title-button" onClick={() => {}} type="button">
                  {calendarMonth.year}년
                </button>
                <button
                  aria-label={`${calendarMonth.month + 1}월`}
                  className="calendar-title-button"
                  onClick={() => {}}
                  type="button"
                >
                  {calendarMonth.month + 1}월
                </button>
              </div>
              <button aria-label="다음 달" className="calendar-nav" onClick={() => moveCalendarMonth(1)} type="button">
                ›
              </button>
            </div>

            <div className="calendar-weekdays">
              {['일', '월', '화', '수', '목', '금', '토'].map((weekday) => (
                <span key={weekday}>{weekday}</span>
              ))}
            </div>

            <div className="calendar-grid">
              {calendarMonth.cells.map((cell) =>
                cell.value ? (
                  <button
                    className={`calendar-day ${
                      cell.value === (dateTarget === 'start' ? draft.startDate : draft.dueDate) ? 'calendar-day--active' : ''
                    }`}
                    key={cell.key}
                    onClick={() => applyDate(cell.value!)}
                    type="button"
                  >
                    {Number.parseInt(cell.value.slice(-2), 10)}
                  </button>
                ) : (
                  <span key={cell.key} className="calendar-day calendar-day--empty" />
                ),
              )}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}
