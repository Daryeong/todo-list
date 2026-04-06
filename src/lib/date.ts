const DAY = 24 * 60 * 60 * 1000

const parseDateOnly = (value: string) => new Date(`${value}T00:00:00`)

const pad = (value: number) => `${value}`.padStart(2, '0')

const formatDateOnly = (value: Date) =>
  `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`

export const toDateOnly = (value: string) => value.slice(0, 10)

export const daysFromTo = (from: string, to: string) => {
  const diff = parseDateOnly(to).getTime() - parseDateOnly(from).getTime()
  return Math.round(diff / DAY)
}

export const addDays = (value: string, amount: number) => {
  const date = parseDateOnly(value)
  date.setDate(date.getDate() + amount)
  return formatDateOnly(date)
}

export const formatKoreanDate = (value: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(parseDateOnly(value))

export const formatShortKoreanDate = (value: string) =>
  value && !Number.isNaN(parseDateOnly(value).getTime())
    ? new Intl.DateTimeFormat('ko-KR', {
        month: 'numeric',
        day: 'numeric',
      }).format(parseDateOnly(value))
    : '-'
