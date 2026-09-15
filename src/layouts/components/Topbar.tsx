import { useEffect, useRef, useState } from "react";
import { Bell, Menu } from "lucide-react";
import { NotificationDropdown } from "../../features/notification/components/NotificationDropdown";
import { useNotificationStore } from "../../features/notification/store/notificationStore";
import { GlobalSearch } from "../../features/search/components/GlobalSearch";
import { ProfileMenu } from "./ProfileMenu";

interface TopbarProps {
    onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const unreadCount = useNotificationStore((s) => s.unreadCount);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open]);

    return (
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-black/40 border-b border-white/5 px-4 lg:px-10 py-4 lg:py-5">
            <div className="flex items-center justify-between gap-4 lg:gap-6">

                <div className="flex items-center gap-3 min-w-0">
                    {/* Hamburger — mobile only */}
                    <button
                        onClick={onMenuToggle}
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition lg:hidden"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="min-w-0">
                        <p className="text-sm text-zinc-500 uppercase tracking-[0.2em]">
                            Workspace
                        </p>

                        <h1 className="mt-1 text-2xl lg:text-4xl font-bold tracking-tight truncate">
                            Welcome back, Vuong 👋
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">

                    <GlobalSearch />

                    {/* Bell + dropdown */}
                    <div ref={wrapperRef} className="relative">
                        <button
                            onClick={() => setOpen((prev) => !prev)}
                            className="relative flex h-11 w-11 lg:h-14 lg:w-14 items-center justify-center rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-blue-500/30">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {open && <NotificationDropdown onClose={() => setOpen(false)} />}
                    </div>

                    <ProfileMenu />
                </div>
            </div>
        </header>
    )
}
