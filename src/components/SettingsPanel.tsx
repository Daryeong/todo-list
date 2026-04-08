import { useState, type ChangeEvent } from 'react'

import type { Settings } from '../types/settings'

const normalizeNumber = (value: string) => {
  if (value.trim() === '') {
    return 0
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
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

  const updateNumberField = (field: keyof Pick<Settings, 'todayThresholdDays' | 'lateThresholdDays' | 'flexibleThresholdDays'>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = normalizeNumber(event.target.value)
      setDraft((current) => ({
        ...current,
        [field]: nextValue,
      }))
    }

  const updateLabelField = (field: keyof Settings['labels']) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setDraft((current) => ({
      ...current,
      labels: {
        ...current.labels,
        [field]: value,
      },
    }))
  }

  return (
    <div className="overlay">
      <section className="side-panel settings-panel" aria-labelledby="settings-panel-title">
        <div className="panel-title-row">
          <div>
            <h2 id="settings-panel-title">설정</h2>
            <p className="section-caption">현재 화면의 작업 분류와 코치 말투를 조정합니다.</p>
          </div>
          <button className="ghost-button" onClick={onClose} type="button">
            닫기
          </button>
        </div>

        <div className="settings-content">
          <section className="settings-section" aria-labelledby="settings-classification-title">
            <div>
              <h3 id="settings-classification-title">분류 규칙</h3>
              <p className="section-caption">각 작업 묶음이 며칠 범위를 가지는지 정합니다.</p>
            </div>
            <div className="settings-grid">
              <label className="setting-item">
                <span>오늘 기준 일수</span>
                <input
                  aria-label="오늘 기준 일수"
                  inputMode="numeric"
                  min="0"
                  type="number"
                  value={draft.todayThresholdDays}
                  onChange={updateNumberField('todayThresholdDays')}
                />
              </label>
              <label className="setting-item">
                <span>마감 기준 일수</span>
                <input
                  aria-label="마감 기준 일수"
                  inputMode="numeric"
                  min="0"
                  type="number"
                  value={draft.lateThresholdDays}
                  onChange={updateNumberField('lateThresholdDays')}
                />
              </label>
              <label className="setting-item">
                <span>유연 기준 일수</span>
                <input
                  aria-label="유연 기준 일수"
                  inputMode="numeric"
                  min="0"
                  type="number"
                  value={draft.flexibleThresholdDays}
                  onChange={updateNumberField('flexibleThresholdDays')}
                />
              </label>
            </div>
          </section>

          <section className="settings-section" aria-labelledby="settings-labels-title">
            <div>
              <h3 id="settings-labels-title">라벨 이름</h3>
              <p className="section-caption">작업 목록에 보이는 그룹 이름을 바꿉니다.</p>
            </div>
            <div className="settings-grid">
              <label className="setting-item">
                <span>오늘 라벨</span>
                <input
                  aria-label="오늘 라벨"
                  value={draft.labels.today}
                  onChange={updateLabelField('today')}
                />
              </label>
              <label className="setting-item">
                <span>마감 라벨</span>
                <input
                  aria-label="마감 라벨"
                  value={draft.labels.late}
                  onChange={updateLabelField('late')}
                />
              </label>
              <label className="setting-item">
                <span>유연 라벨</span>
                <input
                  aria-label="유연 라벨"
                  value={draft.labels.flexible}
                  onChange={updateLabelField('flexible')}
                />
              </label>
            </div>
          </section>

          <section className="settings-section" aria-labelledby="settings-tone-title">
            <div>
              <h3 id="settings-tone-title">코치 말투</h3>
              <p className="section-caption">배너 문구에 쓰이는 말투를 고릅니다.</p>
            </div>
            <label className="setting-item">
              <span>코치 말투</span>
              <select
                aria-label="코치 말투"
                value={draft.tone}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    tone: event.target.value as Settings['tone'],
                  }))
                }
              >
                <option value="encouraging">응원형</option>
                <option value="plain">담백형</option>
                <option value="funny">유쾌형</option>
                <option value="strict">엄격형</option>
              </select>
            </label>
          </section>

          <div className="settings-actions">
            <button className="primary-button" onClick={() => onSave(draft)} type="button">
              설정 저장
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
