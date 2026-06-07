import { Outlet } from 'react-router-dom'

import Topbar from '../shared/components/dashboard/Topbar'
import Sidebar from '../shared/components/Ui/Sidebar'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <Sidebar />

      <main className="flex-1 min-w-0">
        <Topbar />

        <div className="p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}