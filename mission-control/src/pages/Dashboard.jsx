import { Link } from 'react-router-dom'
import { TrendingUp, Briefcase, Users, DollarSign, ChevronRight } from 'lucide-react'
import { jobs, customers, tasks, stats } from '../data/mockData'

const statusColors = {
  new: 'bg-gray-100 text-gray-600',
  scheduled: 'bg-blue-50 text-blue-700',
  in_progress: 'bg-amber-50 text-amber-700',
  completed: 'bg-green-50 text-green-700',
}

const statusLabels = {
  new: 'New',
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
}

const priorityColors = {
  high: 'bg-red-50 text-red-600',
  medium: 'bg-amber-50 text-amber-600',
  low: 'bg-gray-100 text-gray-500',
}

export default function Dashboard() {
  const activeAndScheduled = jobs.filter(j => j.status === 'in_progress' || j.status === 'scheduled')
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 6)
  const revenuePercent = Math.min(100, Math.round((stats.revenueThisMonth / stats.revenueGoal) * 100))

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Good morning 👋</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Here's what's going on at Spark Doc today, March 21.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard
          label="Active Jobs"
          value={stats.activeJobs}
          icon={<Briefcase size={15} />}
          color="blue"
          sub={`${stats.scheduledJobs} scheduled today`}
        />
        <StatCard
          label="Customers"
          value={stats.totalCustomers}
          icon={<Users size={15} />}
          color="purple"
          sub={`${customers.filter(c => c.status === 'lead').length} new leads`}
        />
        <StatCard
          label="Revenue (March)"
          value={`$${stats.revenueThisMonth.toLocaleString()}`}
          icon={<DollarSign size={15} />}
          color="green"
          sub={`${revenuePercent}% of $${(stats.revenueGoal / 1000).toFixed(0)}k goal`}
        />
        <StatCard
          label="Completed (March)"
          value={stats.completedThisMonth}
          icon={<TrendingUp size={15} />}
          color="amber"
          sub={`Avg $${stats.avgJobValue.toLocaleString()} / job`}
        />
      </div>

      {/* Revenue progress bar */}
      <div className="bg-white rounded-lg border border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">March Revenue Goal</span>
          <span className="text-xs text-gray-400">
            ${stats.revenueThisMonth.toLocaleString()} / ${stats.revenueGoal.toLocaleString()}
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-700"
            style={{ width: `${revenuePercent}%` }}
          />
        </div>
        <p className="text-[11px] text-gray-400 mt-1.5">
          {revenuePercent}% complete — ${(stats.revenueGoal - stats.revenueThisMonth).toLocaleString()} remaining to hit goal
        </p>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Active Jobs */}
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800">Active & Scheduled Jobs</h2>
            <Link
              to="/jobs"
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-0.5 transition-colors"
            >
              View all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-1">
            {activeAndScheduled.map(job => (
              <div
                key={job.id}
                className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{job.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {job.customer} · {job.tech}
                  </p>
                </div>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusColors[job.status]}`}
                >
                  {statusLabels[job.status]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Open Tasks */}
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800">Open Tasks</h2>
            <Link
              to="/tasks"
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-0.5 transition-colors"
            >
              View all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-1">
            {pendingTasks.map(task => (
              <div key={task.id} className="flex items-start gap-2.5 py-1.5">
                <div className="mt-0.5 w-3.5 h-3.5 rounded border border-gray-200 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug truncate">{task.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`text-[10px] px-1.5 py-px rounded font-medium ${priorityColors[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-400">{task.assignee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color, sub }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
        <div className={`p-1.5 rounded-md ${colors[color]}`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-gray-900 leading-none">{value}</div>
      <div className="text-xs text-gray-400 mt-1.5">{sub}</div>
    </div>
  )
}
