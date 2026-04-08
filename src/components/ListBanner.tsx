import { formatKoreanDate } from '../lib/date'

export const ListBanner = ({
  today,
  message,
  completedCount,
  onOpenSettings,
}: {
  today: string
  message: string
  completedCount: number
  onOpenSettings: () => void
}) => (
  <div className="hero-stack">
    <div className="hero-topline">
      <p className="eyebrow">오늘 집중</p>
      <button className="ghost-button" onClick={onOpenSettings} type="button">
        설정 열기
      </button>
    </div>
    <div className="hero-body">
      <div className="hero-left">
        <h1>{formatKoreanDate(today)}</h1>
        <p className="hero-message">{message}</p>
      </div>
      <div className="hero-right">
        <div className="achievement-mini">
          <p className="summary-number">오늘 {completedCount}개 완료</p>
          <p className="achievement-sentence">
            {completedCount === 0
              ? '아직 시작 전이에요.'
              : `${completedCount}개를 마쳤어요.`}
          </p>
        </div>
      </div>
    </div>
  </div>
)
