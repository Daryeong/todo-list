type TaskStepsEditorProps = {
  steps: string[]
  isSuggesting?: boolean
  suggestionError?: string | null
  onSuggest: () => void
}

export const TaskStepsEditor = ({
  steps,
  isSuggesting = false,
  suggestionError = null,
  onSuggest,
}: TaskStepsEditorProps) => (
  <section className="steps-box">
    <div className="steps-box__header">
      <div>
        <h3>단계 목록</h3>
        <p className="steps-box__hint">OpenAI가 작업 성격에 맞는 단계 템플릿을 제안합니다.</p>
      </div>
      <button className="secondary-button" onClick={onSuggest} type="button" disabled={isSuggesting}>
        {isSuggesting ? '추천 중...' : '단계 템플릿 추천'}
      </button>
    </div>

    {suggestionError ? (
      <p aria-live="polite" className="step-error" role="alert">
        {suggestionError}
      </p>
    ) : null}

    <ul className="steps-list">
      {steps.length === 0 ? <li>아직 단계가 없습니다.</li> : null}
      {steps.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ul>
  </section>
)
