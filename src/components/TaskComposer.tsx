import { useEffect, useMemo, useRef, useState } from 'react'

import { addDays, formatShortKoreanDate } from '../lib/date'
import type { Importance, TaskInput } from '../types/task'

const importanceOptions: { value: Importance; label: string; dot: string }[] = [
  { value: 'low', label: '낮음', dot: '○' },
  { value: 'medium', label: '보통', dot: '◑' },
  { value: 'high', label: '높음', dot: '●' },
]

const parseDateOnly = (value: string) => new Date(`${value}T00:00:00`)

const formatDateOnly = (date: Date) => {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

const buildMonthCells = (value: string) => {
  const base = parseDateOnly(value)
  const year = base.getFullYear()
  const month = base.getMonth()
  const firstDay = new Date(year, month, 1)
  const firstWeekday = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: Array<{ key: string; label: string; value: string | null }> = []

  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push({ key: `empty-${i}`, label: '', value: null })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day)
    cells.push({
      key: formatDateOnly(date),
      label: `${month + 1}월 ${day}일`,
      value: formatDateOnly(date),
    })
  }

  return { year, month, cells }
}

export const TaskComposer = ({ onSubmit, defaultDate }: { onSubmit: (input: TaskInput) => void; defaultDate: string }) => {
  const composerRef = useRef<HTMLDivElement | null>(null)
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState(defaultDate)
  const [startDate, setStartDate] = useState(defaultDate)
  const [importance, setImportance] = useState<Importance>('medium')
  const [showOptions, setShowOptions] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [calendarCursor, setCalendarCursor] = useState(defaultDate)
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [dateTarget, setDateTarget] = useState<'due' | 'start'>('due')

  const todayStr = defaultDate
  const tomorrowStr = addDays(defaultDate, 1)
  const weekStr = addDays(defaultDate, 7)
  const dueDateMode = dueDate === todayStr ? 'today' : dueDate === tomorrowStr ? 'tomorrow' : 'custom'
  const startDateMode = startDate === todayStr ? 'today' : startDate === tomorrowStr ? 'tomorrow' : 'custom'
  const activeDateValue = dateTarget === 'due' ? dueDate : startDate
  const activeMode = dateTarget === 'due' ? dueDateMode : startDateMode
  const isCustomDate = showDatePicker || (activeMode === 'custom' && activeDateValue !== '')
  const calendarMonth = useMemo(() => buildMonthCells(calendarCursor), [calendarCursor])

  const closePickers = () => {
    setShowDatePicker(false)
    setShowYearPicker(false)
    setShowMonthPicker(false)
  }

  const moveCalendarMonth = (offset: number) => {
    const cursor = parseDateOnly(calendarCursor)
    cursor.setMonth(cursor.getMonth() + offset, 1)
    setCalendarCursor(formatDateOnly(cursor))
  }

  const applyDate = (value: string) => {
    if (dateTarget === 'due') {
      setDueDate(value)
    } else {
      setStartDate(value)
    }
    closePickers()
  }

  const openDatePickerFor = (target: 'due' | 'start') => {
    setDateTarget(target)
    setShowDatePicker(true)
    setShowYearPicker(false)
    setShowMonthPicker(false)
    setCalendarCursor(target === 'due' ? dueDate : startDate)
  }

  const handleSubmit = () => {
    if (!title.trim() || !startDate.trim() || !dueDate.trim() || !importance) return
    onSubmit({ title: title.trim(), startDate, dueDate, importance })
    setTitle('')
    setStartDate(defaultDate)
    setDueDate(defaultDate)
    setImportance('medium')
    setShowOptions(false)
    closePickers()
    setCalendarCursor(defaultDate)
  }

  useEffect(() => {
    if (!showDatePicker) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (showDatePicker && composerRef.current?.querySelector(".calendar-popover") && !composerRef.current.querySelector(".calendar-popover").contains(event.target as Node)) {
        closePickers()
      }
    }

    window.addEventListener('mousedown', handlePointerDown)

    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
    }
  }, [showDatePicker])

  return (
    <div className={`task-composer ${showOptions ? 'task-composer--open' : ''}`} ref={composerRef}>
      <div className="composer-row">
        <input
          aria-label="할 일 제목"
          className="composer-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setShowOptions(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit()
          }}
          placeholder="할 일 추가..."
        />
        <button className="composer-add-btn" type="button" onClick={handleSubmit}>
          추가
        </button>
      </div>
      {showOptions ? (
        <div className="composer-options">
          <div className="option-section option-section--stacked">
            <div className="option-row">
              <span className="option-label">시작일</span>
              <div className="option-chips">
                <button
                  type="button"
                  className={`option-chip ${dateTarget === 'start' && startDateMode === 'today' && !showDatePicker ? 'option-chip--active' : ''}`}
                  onClick={() => {
                    setDateTarget('start')
                    setStartDate(todayStr)
                    closePickers()
                    setCalendarCursor(todayStr)
                  }}
                >
                  오늘
                </button>
                <button
                  type="button"
                  className={`option-chip ${dateTarget === 'start' && startDateMode === 'tomorrow' && !showDatePicker ? 'option-chip--active' : ''}`}
                  onClick={() => {
                    setDateTarget('start')
                    setStartDate(tomorrowStr)
                    closePickers()
                    setCalendarCursor(tomorrowStr)
                  }}
                >
                  내일</button>
                <button
                  type="button"
                  className={`option-chip ${dateTarget === 'start' && startDateMode === 'week' && !showDatePicker ? 'option-chip--active' : ''}`}
                  onClick={() => {
                    setDateTarget('start')
                    setStartDate(weekStr)
                    closePickers()
                    setCalendarCursor(weekStr)
                  }}
                >
                  일주일</button>
                <button
                  type="button"
                  aria-label={dateTarget === 'start' && isCustomDate || startDateMode === 'custom' || startDateMode === 'week' ? formatShortKoreanDate(startDate) : '시작일 선택'}
                  className={`option-chip option-chip--date ${dateTarget === 'start' && isCustomDate ? 'option-chip--active' : startDateMode === 'custom' ? 'option-chip--active' : ''}`}
                  onClick={() => openDatePickerFor('start')}
                >
                  <span className="date-chip-icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="2" y="3" width="10" height="9" rx="2" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M4.5 1.8v2.4M9.5 1.8v2.4M2 5.2h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="date-chip-text">
                    {startDateMode === "today" ? "오늘 ✓" : startDateMode === "tomorrow" ? "내일 ✓" : startDateMode === "week" ? "일주일" : startDate ? formatShortKoreanDate(startDate) : "날짜 선택"}
                  </span>
                </button>
              </div>
            </div>
            {showDatePicker && dateTarget === 'start' ? (
              <div aria-label="시작일 선택 달력" className="calendar-popover" role="dialog">
                <div className="calendar-header">
                  <button type="button" className="calendar-nav" aria-label="이전 달" onClick={() => moveCalendarMonth(-1)}>
                    ‹
                  </button>
                  <div className="calendar-title-group">
                    <button type="button" className="calendar-title-button" aria-label={`${calendarMonth.year}년 선택`} onClick={() => { setShowYearPicker((c) => !c); setShowMonthPicker(false) }}>
                      {calendarMonth.year}년
                    </button>
                    <button type="button" className="calendar-title-button" aria-label={`${calendarMonth.month + 1}월 선택`} onClick={() => { setShowMonthPicker((c) => !c); setShowYearPicker(false) }}>
                      {calendarMonth.month + 1}월
                    </button>
                  </div>
                  <button type="button" className="calendar-nav" aria-label="다음 달" onClick={() => moveCalendarMonth(1)}>
                    ›
                  </button>
                </div>
                {showYearPicker ? (
                  <div aria-label="연도 선택" className="year-picker" role="dialog">
                    {Array.from({ length: 9 }, (_, index) => parseDateOnly(defaultDate).getFullYear() - 4 + index).map((year) => (
                      <button
                        key={year}
                        type="button"
                        className={`year-option ${year === calendarMonth.year ? 'year-option--active' : ''}`}
                        aria-label={`${year}년`}
                        onClick={() => {
                          const cursor = parseDateOnly(calendarCursor)
                          cursor.setFullYear(year)
                          setCalendarCursor(formatDateOnly(cursor))
                          setShowYearPicker(false)
                        }}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                ) : null}
                {showMonthPicker ? (
                  <div aria-label="월 선택" className="year-picker" role="dialog">
                    {Array.from({ length: 12 }, (_, index) => index).map((month) => (
                      <button
                        key={month}
                        type="button"
                        className={`year-option ${month === calendarMonth.month ? 'year-option--active' : ''}`}
                        aria-label={`${month + 1}월`}
                        onClick={() => {
                          const cursor = parseDateOnly(calendarCursor)
                          cursor.setMonth(month, 1)
                          setCalendarCursor(formatDateOnly(cursor))
                          setShowMonthPicker(false)
                        }}
                      >
                        {month + 1}월
                      </button>
                    ))}
                  </div>
                ) : null}
                <div className="calendar-weekdays">
                  <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
                </div>
                <div className="calendar-grid">
                  {calendarMonth.cells.map((cell) =>
                    cell.value ? (
                      <button
                        key={cell.key}
                        type="button"
                        aria-label={cell.label}
                        className={`calendar-day ${cell.value === startDate ? 'calendar-day--active' : ''}`}
                        onClick={() => applyDate(cell.value!)}
                      >
                        {Number(cell.value.slice(-2))}
                      </button>
                    ) : (
                      <span key={cell.key} className="calendar-day calendar-day--empty" />
                    ),
                  )}
                </div>
              </div>
            ) : null}
          </div>
          <div className="option-section option-section--stacked">
            <div className="option-row">
              <span className="option-label">마감일</span>
              <div className="option-chips">
                <button
                  type="button"
                  className={`option-chip ${dateTarget === 'due' && dueDateMode === 'today' && !showDatePicker ? 'option-chip--active' : ''}`}
                  onClick={() => {
                    setDateTarget('due')
                    setDueDate(todayStr)
                    closePickers()
                    setCalendarCursor(todayStr)
                  }}
                >
                  오늘
                </button>
                <button
                  type="button"
                  className={`option-chip ${dateTarget === 'due' && dueDateMode === 'tomorrow' && !showDatePicker ? 'option-chip--active' : ''}`}
                  onClick={() => {
                    setDateTarget('due')
                    setDueDate(tomorrowStr)
                    closePickers()
                    setCalendarCursor(tomorrowStr)
                  }}
                >
                  내일</button>
                <button
                  type="button"
                  className={`option-chip ${dateTarget === 'due' && dueDateMode === 'week' && !showDatePicker ? 'option-chip--active' : ''}`}
                  onClick={() => {
                    setDateTarget('due')
                    setDueDate(weekStr)
                    closePickers()
                    setCalendarCursor(weekStr)
                  }}
                >
                  일주일</button>
                <button
                  type="button"
                  aria-label={dueDate ? formatShortKoreanDate(dueDate) : '날짜 선택'}
                  className={`option-chip option-chip--date ${dateTarget === 'due' && isCustomDate ? 'option-chip--active' : dueDateMode === 'custom' ? 'option-chip--active' : ''}`}
                  onClick={() => openDatePickerFor('due')}
                >
                  <span className="date-chip-icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="2" y="3" width="10" height="9" rx="2" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M4.5 1.8v2.4M9.5 1.8v2.4M2 5.2h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="date-chip-text">
                    {dueDateMode === "today" ? "오늘 ✓" : dueDateMode === "tomorrow" ? "내일 ✓" : dueDateMode === "week" ? "일주일" : dueDate ? formatShortKoreanDate(dueDate) : "날짜 선택"}
                  </span>
                </button>
              </div>
            </div>
            {showDatePicker && dateTarget === 'due' ? (
              <div aria-label="날짜 선택 달력" className="calendar-popover" role="dialog">
                <div className="calendar-header">
                  <button type="button" className="calendar-nav" aria-label="이전 달" onClick={() => moveCalendarMonth(-1)}>
                    ‹
                  </button>
                  <div className="calendar-title-group">
                    <button type="button" className="calendar-title-button" aria-label={`${calendarMonth.year}년 선택`} onClick={() => { setShowYearPicker((c) => !c); setShowMonthPicker(false) }}>
                      {calendarMonth.year}년
                    </button>
                    <button type="button" className="calendar-title-button" aria-label={`${calendarMonth.month + 1}월 선택`} onClick={() => { setShowMonthPicker((c) => !c); setShowYearPicker(false) }}>
                      {calendarMonth.month + 1}월
                    </button>
                  </div>
                  <button type="button" className="calendar-nav" aria-label="다음 달" onClick={() => moveCalendarMonth(1)}>
                    ›
                  </button>
                </div>
                {showYearPicker ? (
                  <div aria-label="연도 선택" className="year-picker" role="dialog">
                    {Array.from({ length: 9 }, (_, index) => parseDateOnly(defaultDate).getFullYear() - 4 + index).map((year) => (
                      <button
                        key={year}
                        type="button"
                        className={`year-option ${year === calendarMonth.year ? 'year-option--active' : ''}`}
                        aria-label={`${year}년`}
                        onClick={() => {
                          const cursor = parseDateOnly(calendarCursor)
                          cursor.setFullYear(year)
                          setCalendarCursor(formatDateOnly(cursor))
                          setShowYearPicker(false)
                        }}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                ) : null}
                {showMonthPicker ? (
                  <div aria-label="월 선택" className="year-picker" role="dialog">
                    {Array.from({ length: 12 }, (_, index) => index).map((month) => (
                      <button
                        key={month}
                        type="button"
                        className={`year-option ${month === calendarMonth.month ? 'year-option--active' : ''}`}
                        aria-label={`${month + 1}월`}
                        onClick={() => {
                          const cursor = parseDateOnly(calendarCursor)
                          cursor.setMonth(month, 1)
                          setCalendarCursor(formatDateOnly(cursor))
                          setShowMonthPicker(false)
                        }}
                      >
                        {month + 1}월
                      </button>
                    ))}
                  </div>
                ) : null}
                <div className="calendar-weekdays">
                  <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
                </div>
                <div className="calendar-grid">
                  {calendarMonth.cells.map((cell) =>
                    cell.value ? (
                      <button
                        key={cell.key}
                        type="button"
                        aria-label={cell.label}
                        className={`calendar-day ${cell.value === dueDate ? 'calendar-day--active' : ''}`}
                        onClick={() => applyDate(cell.value!)}
                      >
                        {Number(cell.value.slice(-2))}
                      </button>
                    ) : (
                      <span key={cell.key} className="calendar-day calendar-day--empty" />
                    ),
                  )}
                </div>
              </div>
            ) : null}
          </div>
          <div className="option-section">
            <span className="option-label">중요도</span>
            <div className="option-chips">
              {importanceOptions.map((opt) => (
                <button key={opt.value} type="button" className={`option-chip ${importance === opt.value ? 'option-chip--active' : ''}`} onClick={() => setImportance(opt.value)}>
                  <span className={`importance-dot importance-dot--${opt.value}`}>{opt.dot}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
