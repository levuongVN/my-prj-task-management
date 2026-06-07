import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'


import HeroSection from '../shared/components/dashboard/HeroSection'
import TaskList from '../shared/components/dashboard/TaskList'
import RightPanel from '../shared/components/dashboard/RightPanel'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
)

export default function DashboardPage() {
  const tasks = [
    {
      id: 1,
      title: 'Design new landing page',
      status: 'In Progress',
      due: '20/05/2026',
      priority: 'High',
    },
    {
      id: 2,
      title: 'Create task analytics module',
      status: 'Todo',
      due: '21/05/2026',
      priority: 'Medium',
    },
    {
      id: 3,
      title: 'Implement notifications system',
      status: 'Overdue',
      due: '15/05/2026',
      priority: 'Low',
    },
  ]



  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* MAIN */}
      <main className="flex-1 min-w-0">

        {/*HERO SECTION */}
        <HeroSection />

        {/* CONTENT */}
        <div className="grid grid-cols-1 2xl:grid-cols-[1.4fr_0.8fr] gap-8">

          {/* TASK LIST */}
          <TaskList tasks={tasks} />

          {/* RIGHT PANEL */}
          <RightPanel />
        </div>
      </main>
    </div>
  )
}