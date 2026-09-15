import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { useUser } from "../../features/user/hooks/useUser";
import { logout } from "../../features/auth/services/auth.service";
import toast from "react-hot-toast";

export function ProfileMenu() {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { data: user, isLoading } = useUser();

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

    const displayName = isLoading ? "" : user?.fullName?.trim() ?? "User";
    const initial = displayName.charAt(0).toUpperCase() || "U";

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                await logout({ refreshToken });
            }
        } catch {
            // API lỗi vẫn phải đăng xuất local, không chặn user
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            toast.success("Logged out successfully");
            window.location.href = "/login";
        }
    };

    const handleNavigate = (path: string) => {
        setOpen(false);
        navigate(path);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <button
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Profile menu"
                className={`relative flex h-11 w-11 lg:h-14 lg:w-14 items-center justify-center rounded-2xl text-base lg:text-lg font-bold transition ${
                    open ? "bg-accent-muted" : "bg-accent text-accent-fg hover:opacity-90"
                }`}
            >
                {user?.avatarUrl ? (
                    <img
                        src={user.avatarUrl}
                        alt={displayName}
                        className="h-full w-full rounded-2xl object-cover"
                    />
                ) : (
                    initial
                )}
                <ChevronDown
                    size={12}
                    className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-400 transition ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-[280px] rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/40">
                    {/* User info */}
                    <div className="border-b border-white/8 px-4 py-4">
                        <div className="flex items-center gap-3">
                            {user?.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt={displayName}
                                    className="h-10 w-10 rounded-xl object-cover"
                                />
                            ) : (
                                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent text-accent-fg font-bold">
                                    {initial}
                                </span>
                            )}

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-zinc-100">
                                    {displayName}
                                </p>
                                <p className="truncate text-xs text-zinc-500">
                                    {user?.email ?? ""}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-2">
                        <button
                            onClick={() => handleNavigate("/settings")}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
                        >
                            <UserIcon size={16} />
                            Profile & Settings
                        </button>

                        <div className="my-1.5 h-px bg-white/8" />

                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                        >
                            <LogOut size={16} />
                            Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
