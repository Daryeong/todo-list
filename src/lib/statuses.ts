import type { Settings } from '../types/settings'
import type { Task } from '../types/task'
import { daysFromTo } from './date'

const TODAY_THRESHOLD_DAYS = 0
const LATE_THRESHOLD_DAYS = 0
const FLEXIBLE_THRESHOLD_DAYS = 7

export interface TaskStatuses {
  today: boolean
  late: boolean
  flexible: boolean
}

export const getTaskStatuses = (task: Task, settings: Settings, today: string): TaskStatuses => {
  void settings
  const distance = daysFromTo(today, task.dueDate)
  const automatic: TaskStatuses = {
    today: distance >= 0 && distance <= TODAY_THRESHOLD_DAYS,
    late: distance < -LATE_THRESHOLD_DAYS,
    flexible: distance >= FLEXIBLE_THRESHOLD_DAYS,
  }

  return {
    today: task.manualStatuses.today ?? automatic.today,
    late: task.manualStatuses.late ?? automatic.late,
    flexible: task.manualStatuses.flexible ?? automatic.flexible,
  }
}
