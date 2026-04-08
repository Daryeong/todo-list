import { useState } from 'react'

import type { Settings } from '../types/settings'

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
        <div className="settings-content">
          <label className="setting-item">
            <span>문구 톤</span>
            <select aria-label="문구 톤" value={draft.tone} onChange={(event) => setDraft({ ...draft, tone: event.target.value as Settings['tone'] })}>
              <option value="encouraging">응원형</option>
              <option value="plain">담백형</option>
              <option value="funny">유쾌형</option>
              <option value="strict">엄격형</option>
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