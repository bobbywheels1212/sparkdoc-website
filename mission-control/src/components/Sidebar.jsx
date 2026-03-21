import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CheckSquare,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Jobs', icon: Briefcase, to: '/jobs' },
  { label: 'Customers', icon: Users, to: '/customers' },
  { label: 'Tasks', icon: CheckSquare, to: '/tasks' },
  { label: 'Docs', icon: FileText, to: '/docs' },
]

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`flex flex-col bg-[#191919] transition-all duration-200 flex-shrink-0 ${
        collapsed ? 'w-14' : 'w-56'
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center h-12 px-3 border-b border-white/10 flex-shrink-0 ${
          collapsed ? 'justify-center' : 'gap-2.5'
        }`}
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-red-600 flex-shrink-0">
          <Zap size={14} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-white font-semibold text-sm leading-tight">Mission Control</div>
            <div className="text-white/40 text-[10px] leading-tight">Spark Doc Electric</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/80'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            <Icon size={16} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-3 border-t border-white/10 pt-3 space-y-0.5">
        <button
          className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-white/50 hover:bg-white/5 hover:text-white/80 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <Settings size={16} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
        <button
          onClick={onToggle}
          className={`w-full flex items-center px-2 py-1.5 rounded-md text-white/30 hover:bg-white/5 hover:text-white/60 transition-colors ${
            collapsed ? 'justify-center' : 'gap-2.5'
          }`}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
