export type ListTone = 'encouraging' | 'plain' | 'funny' | 'strict'

export interface Settings {
  todayLabel: string
  tone: ListTone
}

export const createDefaultSettings = (): Settings => ({
  todayLabel: '마감 임박',
  tone: 'encouraging',
})
