import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'


import HeroSection from '../features/dashboard/components/HeroSection'
import TaskList from '../features/dashboard/components/TaskList'
import RightPanel from '../features/dashboard/components/RightPanel'
import { useDashboardData } from '../features/dashboard/hooks/useDashboardData'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
)

export default function DashboardPage() {
  const {
    stats,
    ongoingTasks,
    upcomingMeetings,
    weeklyProductivity,
    isLoading,
  } = useDashboardData();

  return (
    <div className="flex">
      {/* MAIN */}
      <main className="flex-1 min-w-0 p-6">

        {/*HERO SECTION */}
        <HeroSection stats={stats} />

        {/* CONTENT */}
        <div className="mt-8 grid grid-cols-1 2xl:grid-cols-[1.4fr_0.8fr] gap-8">

          {/* TASK LIST */}
          <TaskList tasks={ongoingTasks} isLoading={isLoading} />

          {/* RIGHT PANEL */}
          <RightPanel
            weeklyProductivity={weeklyProductivity}
            upcomingMeetings={upcomingMeetings}
          />
        </div>
      </main>
    </div>
  )
}