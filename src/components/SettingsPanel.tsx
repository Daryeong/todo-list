import { useState } from 'react'

import type { Settings } from '../types/settings'

const toSafeNumber = (value: string, fallback: number) => {
  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : fallback
}

export const SettingsPanel = ({
  settings,
  onClose,
  onSave,
}: {
  settings: Settings
  onClose: () => void
  onSave: (settings: Partial<Settings>) => void
}) => {
  const [draft, setDraft] = useState(settings)

  return (
    <div className="overlay">
      <section className="side-panel">
        <div className="panel-title-row">
          <h2>설정</h2>
          <button className="ghost-button" onClick={onClose} type="button">
            닫기
          </button>
        </div>
        <div className="detail-grid">
          <label>
            <span>오늘 마감 기준</span>
            <input
              aria-label="오늘 마감 기준"
              type="number"
              value={draft.todayThresholdDays}
              onChange={(event) => setDraft({ ...draft, todayThresholdDays: toSafeNumber(event.target.value, draft.todayThresholdDays) })}
            />
          </label>
          <label>
            <span>늦은 일 기준</span>
            <input
              aria-label="늦은 일 기준"
              type="number"
              value={draft.lateThresholdDays}
              onChange={(event) => setDraft({ ...draft, lateThresholdDays: toSafeNumber(event.target.value, draft.lateThresholdDays) })}
            />
          </label>
          <label>
            <span>여유 기준 일수</span>
            <input
              aria-label="여유 기준 일수"
              type="number"
              value={draft.flexibleThresholdDays}
              onChange={(event) =>
                setDraft({ ...draft, flexibleThresholdDays: toSafeNumber(event.target.value, draft.flexibleThresholdDays) })
              }
            />
          </label>
          <label>
            <span>오늘 마감 라벨</span>
            <input aria-label="오늘 마감 라벨" value={draft.labels.today} onChange={(event) => setDraft({ ...draft, labels: { ...draft.labels, today: event.target.value } })} />
          </label>
          <label>
            <span>늦은 일 라벨</span>
            <input value={draft.labels.late} onChange={(event) => setDraft({ ...draft, labels: { ...draft.labels, late: event.target.value } })} />
          </label>
          <label>
            <span>여유 라벨</span>
            <input value={draft.labels.flexible} onChange={(event) => setDraft({ ...draft, labels: { ...draft.labels, flexible: event.target.value } })} />
          </label>
          <label>
            <span>문구 톤</span>
            <select aria-label="문구 톤" value={draft.tone} onChange={(event) => setDraft({ ...draft, tone: event.target.value as Settings['tone'] })}>
              <option value="encouraging">응원형</option>
              <option value="plain">담백형</option>
            </select>
          </label>
          <button className="primary-button" onClick={() => onSave(draft)} type="button">
            설정 저장
          </button>
        </div>
      </section>
    </div>
  )
}
