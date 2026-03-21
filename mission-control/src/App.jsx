import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Customers from './pages/Customers'
import Tasks from './pages/Tasks'
import Docs from './pages/Docs'

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-[#F9FAFB] font-inter overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
        />
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <TopBar />
          <main className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/docs/:docId" element={<Docs />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
