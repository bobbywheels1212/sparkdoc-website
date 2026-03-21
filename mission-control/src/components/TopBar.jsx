import { useLocation } from 'react-router-dom'
import { Search, Bell } from 'lucide-react'

const pageNames = {
  '/dashboard': 'Dashboard',
  '/jobs': 'Jobs',
  '/customers': 'Customers',
  '/tasks': 'Tasks',
  '/docs': 'Docs',
}

export default function TopBar() {
  const location = useLocation()
  const pageName = pageNames[location.pathname] ?? 'Mission Control'

  return (
    <header className="h-11 bg-white border-b border-gray-100 flex items-center px-5 gap-4 flex-shrink-0">
      <span className="text-sm font-medium text-gray-700">{pageName}</span>
      <div className="flex-1" />
      <div className="flex items-center gap-1.5">
        <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors px-2.5 py-1 rounded-md hover:bg-gray-50 text-sm border border-gray-100">
          <Search size={13} />
          <span className="text-xs text-gray-400">Search...</span>
          <kbd className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400 font-mono">⌘K</kbd>
        </button>
        <button className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
          <Bell size={15} />
        </button>
        <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold ml-1 flex-shrink-0">
          ME
        </div>
      </div>
    </header>
  )
}
