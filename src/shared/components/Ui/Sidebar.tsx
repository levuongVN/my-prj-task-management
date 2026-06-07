// shared/components/navigation/Sidebar.tsx

import {
  CalendarDays,
  CheckCircle2,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  const items = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      icon: CheckCircle2,
      label: 'Tasks',
      path: '/tasks',
    },
    {
      icon: FolderKanban,
      label: 'Projects',
      path: '/projects',
    },
    {
      icon: CalendarDays,
      label: 'Calendar',
      path: '/calendar',
    },
    {
      icon: TrendingUp,
      label: 'Analytics',
      path: '/analytics',
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings',
    },
  ]

  return (
    <aside className="hidden lg:flex w-[290px] border-r border-white/5 bg-[#090909] flex-col justify-between px-6 py-8">
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-4 px-2">
          <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-xl">
            T
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              TaskFlow
            </h1>

            <p className="text-sm text-zinc-500 mt-1">
              Productivity Workspace
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="mt-12 space-y-2">
          {items.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `
                    w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all
                    ${
                      isActive
                        ? 'bg-white text-black'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }
                  `
                }
              >
                <Icon size={20} />

                <span className="font-medium">
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </div>
      </div>

      {/* PRO CARD */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />

        <div className="relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center">
            <Sparkles size={24} />
          </div>

          <h2 className="mt-6 text-xl font-bold leading-snug">
            Upgrade to Pro
          </h2>

          <p className="mt-3 text-sm text-zinc-400 leading-6">
            Unlock advanced analytics and team collaboration features.
          </p>

          <button className="mt-6 h-12 w-full rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition">
            Upgrade Plan
          </button>
        </div>
      </div>
    </aside>
  )
}