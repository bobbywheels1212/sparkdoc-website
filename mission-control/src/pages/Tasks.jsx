import { useState } from 'react'
import { tasks } from '../data/mockData'
import { Plus, Circle, CheckCircle2 } from 'lucide-react'

const priorityConfig = {
  high: { bg: 'bg-red-50 text-red-600', label: 'High', order: 0 },
  medium: { bg: 'bg-amber-50 text-amber-600', label: 'Medium', order: 1 },
  low: { bg: 'bg-gray-100 text-gray-500', label: 'Low', order: 2 },
}

const tagColors = {
  Materials: 'bg-orange-50 text-orange-600',
  Quote: 'bg-blue-50 text-blue-600',
  'Follow-up': 'bg-purple-50 text-purple-600',
  Scheduling: 'bg-cyan-50 text-cyan-600',
  Permits: 'bg-red-50 text-red-600',
  Admin: 'bg-gray-100 text-gray-600',
  Marketing: 'bg-green-50 text-green-600',
}

const assigneeColors = {
  'Jake R.': 'bg-blue-500',
  'Mike T.': 'bg-green-500',
  You: 'bg-purple-600',
}

export default function Tasks() {
  const [localTasks, setLocalTasks] = useState(tasks)
  const [filterAssignee, setFilterAssignee] = useState('all')

  const toggleTask = id => {
    setLocalTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const assignees = ['all', 'You', 'Jake R.', 'Mike T.']

  const filtered = localTasks.filter(
    t => filterAssignee === 'all' || t.assignee === filterAssignee
  )

  const pending = filtered
    .filter(t => !t.completed)
    .sort((a, b) => priorityConfig[a.priority].order - priorityConfig[b.priority].order)

  const completed = filtered.filter(t => t.completed)

  const totalPending = localTasks.filter(t => !t.completed).length

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-400">
            {totalPending} open · {localTasks.filter(t => t.completed).length} completed
          </p>
        </div>
        <button className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors">
          <Plus size={14} />
          New Task
        </button>
      </div>

      {/* Assignee filter */}
      <div className="flex items-center gap-1 mb-4">
        {assignees.map(a => (
          <button
            key={a}
            onClick={() => setFilterAssignee(a)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-colors ${
              filterAssignee === a
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {a !== 'all' && (
              <span
                className={`w-2 h-2 rounded-full ${assigneeColors[a] || 'bg-gray-400'}`}
              />
            )}
            {a === 'all' ? 'All assignees' : a}
          </button>
        ))}
      </div>

      {/* Open Tasks */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden mb-4">
        <div className="px-4 py-2.5 border-b border-gray-50 bg-gray-50/80 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
            Open Tasks
          </span>
          <span className="text-[11px] text-gray-400">{pending.length} remaining</span>
        </div>
        <div className="divide-y divide-gray-50">
          {pending.map(task => (
            <TaskRow key={task.id} task={task} onToggle={toggleTask} />
          ))}
          {pending.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">All tasks completed!</p>
          )}
        </div>
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-50 bg-gray-50/80">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
              Completed
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {completed.map(task => (
              <TaskRow key={task.id} task={task} onToggle={toggleTask} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TaskRow({ task, onToggle }) {
  const pc = priorityConfig[task.priority]
  const avatarColor = assigneeColors[task.assignee] || 'bg-gray-400'

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors group ${
        task.completed ? 'opacity-50' : ''
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className="flex-shrink-0 text-gray-300 hover:text-blue-500 transition-colors"
      >
        {task.completed ? (
          <CheckCircle2 size={16} className="text-green-500" />
        ) : (
          <Circle size={16} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm text-gray-800 leading-snug ${task.completed ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {task.tag && (
            <span
              className={`text-[10px] px-1.5 py-px rounded font-medium ${
                tagColors[task.tag] || 'bg-gray-100 text-gray-500'
              }`}
            >
              {task.tag}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-[10px] px-1.5 py-px rounded font-medium ${pc.bg}`}>
          {pc.label}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(task.due + 'T12:00:00').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
        <div
          className={`w-5 h-5 rounded-full ${avatarColor} flex items-center justify-center text-white text-[9px] font-bold`}
          title={task.assignee}
        >
          {task.assignee
            .split(' ')
            .map(n => n[0])
            .join('')}
        </div>
      </div>
    </div>
  )
}
