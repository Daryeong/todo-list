import type { Settings } from '../types/settings'
import type { Task } from '../types/task'
import { daysFromTo } from './date'

export interface TaskStatuses {
  today: boolean
  late: boolean
  flexible: boolean
}

export const getTaskStatuses = (
  task: Task,
  settings: Settings,
  today: string,
): TaskStatuses => {
  const distance = daysFromTo(today, task.dueDate)
  const automatic: TaskStatuses = {
    today: distance >= 0 && distance <= settings.todayThresholdDays,
    late: distance < -settings.lateThresholdDays,
    flexible: distance >= settings.flexibleThresholdDays,
  }

  return {
    today: task.manualStatuses.today ?? automatic.today,
    late: task.manualStatuses.late ?? automatic.late,
    flexible: task.manualStatuses.flexible ?? automatic.flexible,
  }
}
