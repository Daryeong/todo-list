import { useMemo, useState } from 'react'

import { ListBanner } from './components/ListBanner'
import { CompletedTasks } from './components/CompletedTasks'
import { LayoutShell } from './components/LayoutShell'
import { SettingsPanel } from './components/SettingsPanel'
import { TaskComposer } from './components/TaskComposer'
import { TaskDetailPanel } from './components/TaskDetailPanel'
import { TopTasks } from './components/TopTasks'
import { getListCopy } from './lib/listCopy'
import { toDateOnly } from './lib/date'
import { useTodoApp } from './hooks/useTodoApp'

const defaultToday = toDateOnly(new Date().toISOString())

function App({ today = defaultToday }: { today?: string }) {
  const {
    settings,
    openTasks,
    todayCompletedTasks,
    addTask,
    updateTask,
    completeTask,
    moveTaskToTomorrow,
    deleteTask,
    updateSettings,
  } = useTodoApp(today)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const selectedTask = openTasks.find((task) => task.id === selectedTaskId) ?? null
  const listCopy = useMemo(() => getListCopy(settings.tone, today), [settings.tone, today])

  return (
    <LayoutShell
      header={
        <ListBanner
          today={today}
          message={listCopy}
          completedCount={todayCompletedTasks.length}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      }
    >
      <div className="main-column">
        <section className="panel unified-panel">
          <TaskComposer defaultDate={today} onSubmit={addTask} />
          <div className="panel-divider" />
          <TopTasks
            onComplete={completeTask}
            onDelete={deleteTask}
            onOpenDetail={setSelectedTaskId}
            tasks={openTasks}
          />
          <div className="panel-divider" />
          <CompletedTasks tasks={todayCompletedTasks} onDelete={deleteTask} />
        </section>
      </div>
      {selectedTask ? (
        <TaskDetailPanel
          onClose={() => setSelectedTaskId(null)}
          onDelete={deleteTask}
          onMoveToTomorrow={moveTaskToTomorrow}
          onSave={updateTask}
          task={selectedTask}
        />
      ) : null}
      {settingsOpen ? (
        <SettingsPanel
          onClose={() => setSettingsOpen(false)}
          onSave={(nextSettings) => {
            updateSettings(nextSettings)
            setSettingsOpen(false)
          }}
          settings={settings}
        />
      ) : null}
    </LayoutShell>
  )
}

export default App
