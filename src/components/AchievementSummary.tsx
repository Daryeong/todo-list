export const AchievementSummary = ({ completedCount }: { completedCount: number }) => {
  const sentence =
    completedCount === 0
      ? '아직 시작 전이에요. 첫 번째 일부터 가볍게 해봐요.'
      : `오늘 ${completedCount}개를 마쳤어요. 남은 일도 천천히 정리해봐요.`

  return (
    <section className="panel accent-panel">
      <div className="panel-title-row">
        <h2>오늘 성취</h2>
      </div>
      <p className="summary-number">오늘 {completedCount}개 완료</p>
      <p>{sentence}</p>
    </section>
  )
}
