import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-w-0">
        <Topbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

        <div className="p-4 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
