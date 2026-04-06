export const getSuggestedSteps = (title: string) => {
  if (title.includes('발표')) {
    return ['주제 정리', '자료 조사', '슬라이드 초안', '발표 연습']
  }
  if (title.includes('공부')) {
    return ['범위 정리', '핵심 개념 복습', '문제 풀기']
  }
  return ['작업 나누기', '첫 단계 시작하기', '마무리 점검']
}

export const TaskStepsEditor = ({ steps }: { steps: string[] }) => (
  <div className="steps-box">
    <h3>단계 목록</h3>
    <ul>
      {steps.length === 0 ? <li>아직 단계가 없어요.</li> : null}
      {steps.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ul>
  </div>
)
