import { useEffect, useState } from 'react'

import { addDays, toDateOnly } from '../lib/date'
import { createEmptyState, loadStoredState, saveStoredState, type StoredAppState } from '../lib/storage'
import { createDefaultSettings, type Settings } from '../types/settings'
import { createTask, type Task, type TaskInput } from '../types/task'

const mergeSettings = (current: Settings, partial: Partial<Settings>): Settings => ({
  todayLabel: partial.todayLabel ?? current.todayLabel,
  tone: partial.tone ?? current.tone,
})

export const useTodoApp = (today = toDateOnly(new Date().toISOString())) => {
  const [state, setState] = useState<StoredAppState>(() => {
    if (typeof window === 'undefined') {
      return createEmptyState()
    }
    return loadStoredState()
  })

  useEffect(() => {
    saveStoredState(state)
  }, [state])

  const completedTasks = state.tasks.filter((task) => task.completedAt)
  const todayCompletedTasks = completedTasks.filter((task) => task.completedAt?.startsWith(today))
  const openTasks = state.tasks.filter((task) => !task.completedAt)
  const todayCompletedCount = todayCompletedTasks.length

  const addTask = (input: TaskInput) => {
    const now = `${today}T09:00:00.000Z`
    setState((current) => ({ ...current, tasks: [...current.tasks, createTask(input, now)] }))
  }

  const updateTask = (taskId: string, patch: Partial<Task>) => {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) => (task.id === taskId ? { ...task, ...patch } : task)),
    }))
  }

  const completeTask = (taskId: string) => {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId ? { ...task, completedAt: `${today}T18:00:00.000Z` } : task,
      ),
    }))
  }

  const moveTaskToTomorrow = (taskId: string) => {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId ? { ...task, dueDate: addDays(task.dueDate, 1) } : task,
      ),
    }))
  }

  const deleteTask = (taskId: string) => {
    setState((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== taskId),
    }))
  }

  const updateSettings = (partial: Partial<Settings>) => {
    setState((current) => ({ ...current, settings: mergeSettings(current.settings, partial) }))
  }

  return {
    tasks: state.tasks,
    openTasks,
    completedTasks,
    todayCompletedTasks,
    todayCompletedCount,
    settings: state.settings,
    addTask,
    updateTask,
    completeTask,
    moveTaskToTomorrow,
    updateSettings,
    deleteTask,
  }
}

export const getInitialSettings = () => createDefaultSettings()
