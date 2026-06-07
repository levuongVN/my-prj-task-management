import { Bell, Search } from "lucide-react";

export default function Topbar() {
    return (
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-black/40 border-b border-white/5 px-6 lg:px-10 py-5">
            <div className="flex items-center justify-between gap-6">

                <div>
                    <p className="text-sm text-zinc-500 uppercase tracking-[0.2em]">
                        Workspace
                    </p>

                    <h1 className="mt-2 text-3xl lg:text-4xl font-bold tracking-tight">
                        Welcome back, Vuong 👋
                    </h1>
                </div>

                <div className="flex items-center gap-4">

                    <div className="hidden md:flex items-center gap-3 h-14 px-5 rounded-2xl bg-white/5 border border-white/5 min-w-[320px]">
                        <Search size={18} className="text-zinc-500" />

                        <input
                            placeholder="Search tasks, projects..."
                            className="bg-transparent outline-none text-sm flex-1 placeholder:text-zinc-500"
                        />
                    </div>

                    <button className="w-14 h-14 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                        <Bell size={20} />
                    </button>

                    <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-lg">
                        V
                    </div>
                </div>
            </div>
        </header>
    )
}