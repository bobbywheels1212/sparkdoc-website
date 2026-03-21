import { useState } from 'react'
import { jobs } from '../data/mockData'
import { Plus, MapPin, User, Calendar, DollarSign } from 'lucide-react'

const columns = [
  { id: 'new', label: 'New Leads', dotColor: 'bg-gray-400' },
  { id: 'scheduled', label: 'Scheduled', dotColor: 'bg-blue-400' },
  { id: 'in_progress', label: 'In Progress', dotColor: 'bg-amber-400' },
  { id: 'completed', label: 'Completed', dotColor: 'bg-green-400' },
]

const priorityDot = {
  high: 'bg-red-400',
  medium: 'bg-amber-400',
  low: 'bg-gray-300',
}

const typeColors = {
  'Panel Upgrade': 'bg-red-50 text-red-600',
  'EV Charger': 'bg-green-50 text-green-700',
  'Rewiring': 'bg-orange-50 text-orange-600',
  'Outlet Repair': 'bg-blue-50 text-blue-600',
  'Surge Protection': 'bg-purple-50 text-purple-600',
  'Inspection': 'bg-gray-100 text-gray-600',
  'Dedicated Circuit': 'bg-cyan-50 text-cyan-700',
  'Lighting': 'bg-yellow-50 text-yellow-700',
}

export default function Jobs() {
  const [boardJobs, setBoardJobs] = useState(jobs)
  const [selectedJob, setSelectedJob] = useState(null)

  const totalEstimate = boardJobs
    .filter(j => j.status !== 'completed')
    .reduce((sum, j) => sum + j.estimate, 0)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Jobs</h1>
          <p className="text-sm text-gray-400">
            {boardJobs.length} total · ${totalEstimate.toLocaleString()} open pipeline
          </p>
        </div>
        <button className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors">
          <Plus size={14} />
          New Job
        </button>
      </div>

      {/* Kanban board */}
      <div className="flex gap-3 flex-1 overflow-x-auto pb-2">
        {columns.map(col => {
          const colJobs = boardJobs.filter(j => j.status === col.id)
          const colTotal = colJobs.reduce((sum, j) => sum + j.estimate, 0)
          return (
            <div key={col.id} className="flex-shrink-0 w-[270px] flex flex-col">
              {/* Column header */}
              <div className="flex items-center gap-2 mb-2.5 px-1">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${col.dotColor}`} />
                <span className="text-sm font-medium text-gray-700">{col.label}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full ml-auto">
                  {colJobs.length}
                </span>
              </div>
              {colJobs.length > 0 && (
                <p className="text-[11px] text-gray-400 px-1 mb-2">
                  ${colTotal.toLocaleString()} estimated
                </p>
              )}

              {/* Cards */}
              <div className="flex-1 space-y-2 bg-gray-50/70 rounded-lg p-2 min-h-[80px]">
                {colJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onClick={() => setSelectedJob(job)}
                  />
                ))}
                <button className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-colors">
                  <Plus size={12} />
                  Add job
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Job detail slide-over */}
      {selectedJob && (
        <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  )
}

function JobCard({ job, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-md border border-gray-100 p-3 hover:shadow-sm hover:border-gray-200 transition-all cursor-pointer"
    >
      <div className="flex items-start gap-2 mb-2.5">
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${priorityDot[job.priority]}`} />
        <p className="text-sm font-medium text-gray-800 leading-snug">{job.title}</p>
      </div>
      <div className="space-y-1 pl-3.5">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <User size={10} />
          <span>{job.customer}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <MapPin size={10} />
          <span className="truncate">{job.address.split(',')[0]}</span>
        </div>
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar size={10} />
            <span>
              {new Date(job.date + 'T12:00:00').toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <span className="text-xs font-semibold text-gray-700">
            ${job.estimate.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
            typeColors[job.type] || 'bg-gray-100 text-gray-500'
          }`}
        >
          {job.type}
        </span>
        <span className="text-[10px] text-gray-400">{job.tech}</span>
      </div>
    </div>
  )
}

function JobDetail({ job, onClose }) {
  const statusColors = {
    new: 'bg-gray-100 text-gray-600',
    scheduled: 'bg-blue-50 text-blue-700',
    in_progress: 'bg-amber-50 text-amber-700',
    completed: 'bg-green-50 text-green-700',
  }
  const statusLabels = {
    new: 'New Lead',
    scheduled: 'Scheduled',
    in_progress: 'In Progress',
    completed: 'Completed',
  }

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/20" onClick={onClose} />
      <div className="w-96 bg-white border-l border-gray-100 h-full overflow-y-auto shadow-xl">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-gray-400 font-mono mb-1">{job.id}</p>
              <h2 className="text-base font-semibold text-gray-900">{job.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none mt-1"
            >
              ×
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[job.status]}`}>
              {statusLabels[job.status]}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[job.type] || 'bg-gray-100 text-gray-500'}`}>
              {job.type}
            </span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <Field label="Customer" value={job.customer} />
          <Field label="Address" value={job.address} />
          <Field label="Technician" value={job.tech} />
          <Field
            label="Date"
            value={new Date(job.date + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          />
          <Field
            label="Estimate"
            value={`$${job.estimate.toLocaleString()}`}
            valueClass="text-green-700 font-semibold"
          />
          <Field
            label="Priority"
            value={job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
          />
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">Notes</p>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-md p-3">
              {job.notes}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, valueClass = 'text-gray-800' }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className={`text-sm ${valueClass}`}>{value}</p>
    </div>
  )
}
