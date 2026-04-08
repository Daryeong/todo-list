export type CoachTone = 'encouraging' | 'plain' | 'funny' | 'strict'

export interface Settings {
  todayThresholdDays: number
  lateThresholdDays: number
  flexibleThresholdDays: number
  labels: {
    today: string
    late: string
    flexible: string
  }
  tone: CoachTone
}

export const createDefaultSettings = (): Settings => ({
  todayThresholdDays: 0,
  lateThresholdDays: 0,
  flexibleThresholdDays: 7,
  labels: {
    today: '마감 임박',
    late: '늦은 일',
    flexible: '여유',
  },
  tone: 'encouraging',
})
