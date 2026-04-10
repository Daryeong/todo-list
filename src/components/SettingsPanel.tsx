import { useEffect, useState, type ChangeEvent } from 'react'

import type { Settings } from '../types/settings'

const previewText = (label: string, sample: string) => `[${label}] ${sample}`

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

  useEffect(() => {
    setDraft(settings)
  }, [settings])

  const updateTodayLabel = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setDraft((current) => ({
      ...current,
      todayLabel: value,
    }))
  }

  return (
    <div className="overlay">
      <section className="side-panel settings-panel" aria-labelledby="settings-panel-title">
        <div className="panel-title-row">
          <div>
            <h2 id="settings-panel-title">설정</h2>
            <p className="section-caption">홈 화면 배지 문구와 리스트 말투를 조정합니다.</p>
          </div>
          <button className="ghost-button" onClick={onClose} type="button">
            닫기
          </button>
        </div>

        <div className="settings-content">
          <section className="settings-section" aria-labelledby="settings-label-title">
            <div>
              <h3 id="settings-label-title">라벨 이름 설정</h3>
              <p className="section-caption">홈 화면의 마감 배지에 표시되는 문구를 수정합니다.</p>
            </div>
            <label className="setting-item">
              <span>라벨 이름</span>
              <input aria-label="라벨 이름" value={draft.todayLabel} onChange={updateTodayLabel} />
            </label>
            <p className="preview-copy">
              미리보기: <span>{previewText(draft.todayLabel, '오늘 상태에 표시됩니다')}</span>
            </p>
          </section>

          <section className="settings-section" aria-labelledby="settings-tone-title">
            <div>
              <h3 id="settings-tone-title">리스트 말투</h3>
              <p className="section-caption">배너 문구에 쓰이는 말투를 고릅니다.</p>
            </div>
            <label className="setting-item">
              <span>리스트 말투</span>
              <select
                aria-label="리스트 말투"
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
