import { useState } from "react";
import {
    User,
    Palette,
    Bell,
    Shield,
    ChevronRight,
    Check,
    Sun,
    Moon,
    Monitor,
    Type,
    Globe,
    Lock,
    LogOut,
    Camera,
    Mail,
    AtSign,
    Clock,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Sparkles,
} from "lucide-react";
import { useTheme, type ThemeId, type AccentId, type FontSize, type ColorMode } from "../contexts/ThemeContext";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type SettingSection = "appearance" | "profile" | "notifications" | "account";

interface ThemePreset {
    id: ThemeId;
    name: string;
    preview: string[];
    tag?: string;
}

interface AccentColor {
    id: AccentId;
    name: string;
    color: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const THEME_PRESETS: ThemePreset[] = [
    { id: "midnight",  name: "Midnight",  preview: ["#050505", "#111111", "#1a1a1a", "#ffffff"], tag: "Default" },
    { id: "zinc",      name: "Zinc Dark", preview: ["#18181b", "#27272a", "#3f3f46", "#a1a1aa"] },
    { id: "nord",      name: "Nord",      preview: ["#2e3440", "#3b4252", "#4c566a", "#88c0d0"] },
    { id: "navy",      name: "Deep Navy", preview: ["#0a0f1e", "#0f172a", "#1e293b", "#6366f1"] },
    { id: "rose-pine", name: "Rosé Pine", preview: ["#191724", "#1f1d2e", "#26233a", "#eb6f92"] },
    { id: "light",     name: "Snow",      preview: ["#fafafa", "#ffffff", "#f4f4f5", "#18181b"] },
];

const ACCENT_COLORS: AccentColor[] = [
    { id: "white",   name: "Arctic",  color: "#ffffff" },
    { id: "indigo",  name: "Indigo",  color: "#6366f1" },
    { id: "blue",    name: "Sapphire", color: "#3b82f6" },
    { id: "cyan",    name: "Cyan",    color: "#06b6d4" },
    { id: "emerald", name: "Emerald", color: "#10b981" },
    { id: "amber",   name: "Amber",   color: "#f59e0b" },
    { id: "rose",    name: "Rose",    color: "#f43f5e" },
    { id: "purple",  name: "Violet",  color: "#a855f7" },
];

const SIDEBAR_ITEMS = [
    { id: "appearance"    as SettingSection, icon: Palette, label: "Appearance" },
    { id: "profile"       as SettingSection, icon: User,    label: "Profile" },
    { id: "notifications" as SettingSection, icon: Bell,    label: "Notifications" },
    { id: "account"       as SettingSection, icon: Shield,  label: "Account & Security" },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
        </div>
    );
}

function SettingCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`rounded-2xl border border-white/6 bg-white/[0.03] p-6 ${className}`}>
            {children}
        </div>
    );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
    return (
        <button onClick={onChange} className="relative flex-shrink-0">
            {enabled ? (
                <ToggleRight size={40} className="text-white" strokeWidth={1.5} />
            ) : (
                <ToggleLeft size={40} className="text-zinc-600" strokeWidth={1.5} />
            )}
        </button>
    );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function AppearanceSection() {
    const {
        themeId, accentId, fontSize, colorMode,
        setThemeId, setAccentId, setFontSize, setColorMode,
        saveAppearance,
    } = useTheme();

    const handleSave = () => {
        saveAppearance();
        toast.success("Appearance saved!", {
            style: { background: "#111", color: "#fff", border: "1px solid rgba(255,255,255,0.08)" },
            iconTheme: { primary: "#fff", secondary: "#000" },
        });
    };

    return (
        <div className="space-y-8">
            <SectionTitle
                title="Appearance"
                subtitle="Customize how TaskFlow looks and feels for you."
            />

            {/* Color Mode */}
            <SettingCard>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                    Color Mode
                </p>
                <p className="mb-5 text-sm text-zinc-600">Choose your base color preference.</p>
                <div className="grid grid-cols-3 gap-3">
                    {(["dark", "light", "system"] as ColorMode[]).map((mode) => {
                        const Icon = mode === "dark" ? Moon : mode === "light" ? Sun : Monitor;
                        const label = mode.charAt(0).toUpperCase() + mode.slice(1);
                        const isActive = colorMode === mode;
                        return (
                            <button
                                key={mode}
                                onClick={() => setColorMode(mode)}
                                className={`relative flex flex-col items-center gap-3 rounded-xl border p-4 transition-all duration-200 ${
                                    isActive
                                        ? "border-white/30 bg-white/8"
                                        : "border-white/6 bg-transparent hover:border-white/12 hover:bg-white/4"
                                }`}
                            >
                                {isActive && (
                                    <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                                        <Check size={10} className="text-black" strokeWidth={3} />
                                    </span>
                                )}
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isActive ? "bg-white/10" : "bg-white/4"}`}>
                                    <Icon size={22} className={isActive ? "text-white" : "text-zinc-500"} />
                                </div>
                                <span className={`text-sm font-medium ${isActive ? "text-white" : "text-zinc-500"}`}>
                                    {label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </SettingCard>

            {/* Theme Presets */}
            <SettingCard>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                    Theme
                </p>
                <p className="mb-5 text-sm text-zinc-600">
                    Select a preset color palette for your workspace.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {THEME_PRESETS.map((theme) => {
                        const isActive = themeId === theme.id;
                        return (
                            <button
                                key={theme.id}
                                onClick={() => setThemeId(theme.id)}
                                className={`group relative overflow-hidden rounded-xl border p-3 text-left transition-all duration-200 ${
                                    isActive
                                        ? "border-white/25 ring-1 ring-white/15"
                                        : "border-white/6 hover:border-white/12"
                                }`}
                            >
                                {/* Colour swatch preview */}
                                <div
                                    className="mb-3 flex h-16 w-full overflow-hidden rounded-lg"
                                    style={{ background: theme.preview[0] }}
                                >
                                    <div className="flex h-full w-full items-end gap-1 p-2">
                                        {theme.preview.map((color, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 rounded-md"
                                                style={{
                                                    background: color,
                                                    height: `${[40, 55, 65, 75][i]}%`,
                                                    opacity: 0.9,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className={`text-xs font-medium truncate ${isActive ? "text-white" : "text-zinc-400"}`}>
                                            {theme.name}
                                        </span>
                                        {theme.tag && (
                                            <span className="flex-shrink-0 rounded-full bg-white/8 px-1.5 py-0.5 text-[9px] font-medium text-zinc-500">
                                                {theme.tag}
                                            </span>
                                        )}
                                    </div>
                                    {isActive && (
                                        <span className="flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                                            <Check size={9} className="text-black" strokeWidth={3} />
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </SettingCard>

            {/* Accent Color */}
            <SettingCard>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                    Accent Color
                </p>
                <p className="mb-5 text-sm text-zinc-600">
                    Used for active states, buttons, and highlights.
                </p>
                <div className="flex flex-wrap gap-3">
                    {ACCENT_COLORS.map((accent) => {
                        const isActive = accentId === accent.id;
                        return (
                            <button
                                key={accent.id}
                                onClick={() => setAccentId(accent.id)}
                                title={accent.name}
                                className={`relative flex flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-200 ${
                                    isActive
                                        ? "border-white/25 bg-white/6"
                                        : "border-white/6 hover:border-white/12"
                                }`}
                            >
                                <div
                                    className="h-8 w-8 rounded-full border border-white/10 shadow-sm"
                                    style={{ background: accent.color }}
                                />
                                {isActive && (
                                    <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white">
                                        <Check size={8} className="text-black" strokeWidth={3} />
                                    </span>
                                )}
                                <span className={`text-[10px] font-medium ${isActive ? "text-white" : "text-zinc-600"}`}>
                                    {accent.name}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Live preview strip */}
                <div className="mt-5 rounded-xl border border-white/6 bg-white/3 p-4">
                    <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-zinc-600">Live Preview</p>
                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            className="rounded-xl px-4 py-2 text-sm font-semibold"
                            style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                        >
                            Primary button
                        </button>
                        <div
                            className="h-8 w-8 rounded-xl"
                            style={{ background: "var(--accent-muted)", border: "1px solid var(--accent)" }}
                        />
                        <div className="h-1.5 flex-1 min-w-[80px] rounded-full bg-white/8 overflow-hidden">
                            <div className="h-full w-2/3 rounded-full transition-all duration-500" style={{ background: "var(--accent)" }} />
                        </div>
                        <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>
                            Active text
                        </span>
                    </div>
                </div>
            </SettingCard>

            {/* Font Size */}
            <SettingCard>
                <div className="mb-4 flex items-center gap-2">
                    <Type size={15} className="text-zinc-500" />
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                        Font Size
                    </p>
                </div>
                <div className="flex gap-2">
                    {(["sm", "md", "lg"] as FontSize[]).map((size) => {
                        const meta = {
                            sm: { label: "Small",   px: "13px" },
                            md: { label: "Default", px: "14px" },
                            lg: { label: "Large",   px: "16px" },
                        };
                        const isActive = fontSize === size;
                        return (
                            <button
                                key={size}
                                onClick={() => setFontSize(size)}
                                className={`flex-1 flex flex-col items-center gap-1 rounded-xl border py-3.5 transition-all ${
                                    isActive
                                        ? "border-white/25 bg-white/8 text-white"
                                        : "border-white/6 text-zinc-500 hover:border-white/12 hover:text-zinc-300"
                                }`}
                            >
                                <span style={{ fontSize: meta[size].px }} className="font-semibold leading-none">Aa</span>
                                <span className="text-[10px] mt-1.5">{meta[size].label}</span>
                                <span className="text-[9px] text-zinc-600">{meta[size].px}</span>
                            </button>
                        );
                    })}
                </div>
            </SettingCard>

            {/* Save bar */}
            <div className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.02] px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Sparkles size={14} />
                    <span>Changes preview live — save to persist across sessions.</span>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-85"
                    style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                >
                    <Check size={15} />
                    Save appearance
                </button>
            </div>
        </div>
    );
}

function ProfileSection() {
    const [name, setName] = useState("Vuong Le");
    const [username, setUsername] = useState("vuongle");
    const [email] = useState("vuongle@example.com");
    const [timezone, setTimezone] = useState("Asia/Ho_Chi_Minh");

    return (
        <div className="space-y-8">
            <SectionTitle title="Profile" subtitle="Manage your personal information and preferences." />

            <SettingCard>
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Avatar</p>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-3xl font-bold text-black">
                            V
                        </div>
                        <button className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-zinc-300 transition hover:bg-zinc-700">
                            <Camera size={13} />
                        </button>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-300">Upload a photo</p>
                        <p className="mt-1 text-xs text-zinc-600">PNG, JPG up to 2MB. Recommended 256×256.</p>
                        <div className="mt-3 flex gap-2">
                            <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/6">Upload</button>
                            <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:text-zinc-400">Remove</button>
                        </div>
                    </div>
                </div>
            </SettingCard>

            <SettingCard>
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Personal Information</p>
                <div className="space-y-4">
                    <div>
                        <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-400"><User size={12} /> Full Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/20 focus:bg-white/6" />
                    </div>
                    <div>
                        <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-400"><AtSign size={12} /> Username</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/20 focus:bg-white/6" />
                    </div>
                    <div>
                        <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-400"><Mail size={12} /> Email</label>
                        <input value={email} disabled
                            className="w-full cursor-not-allowed rounded-xl border border-white/5 bg-white/2 px-4 py-3 text-sm text-zinc-600 outline-none" />
                        <p className="mt-1.5 text-xs text-zinc-600">Email cannot be changed.</p>
                    </div>
                </div>
            </SettingCard>

            <SettingCard>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Timezone</p>
                <p className="mb-4 text-sm text-zinc-600">Affects how deadlines and times are displayed.</p>
                <div className="relative">
                    <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <select value={timezone} onChange={(e) => setTimezone(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-white/8 bg-white/4 py-3 pl-10 pr-10 text-sm text-white outline-none transition focus:border-white/20">
                        <option value="Asia/Ho_Chi_Minh">UTC+7 — Ho Chi Minh City</option>
                        <option value="Asia/Bangkok">UTC+7 — Bangkok</option>
                        <option value="Asia/Singapore">UTC+8 — Singapore</option>
                        <option value="America/New_York">UTC-5 — New York</option>
                        <option value="Europe/London">UTC+0 — London</option>
                        <option value="Europe/Paris">UTC+1 — Paris</option>
                    </select>
                    <Clock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>
            </SettingCard>

            <div className="flex justify-end">
                <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-100">
                    <Check size={15} /> Save profile
                </button>
            </div>
        </div>
    );
}

function NotificationsSection() {
    const [notifs, setNotifs] = useState({
        taskDeadline: true,
        taskAssigned: false,
        meetingReminder: true,
        projectUpdate: false,
        weeklyDigest: true,
        soundEnabled: false,
    });

    const toggle = (key: keyof typeof notifs) =>
        setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));

    const groups = [
        {
            label: "Tasks",
            items: [
                { key: "taskDeadline" as const, title: "Deadline reminders", sub: "Notify 24h before a task is due" },
                { key: "taskAssigned" as const, title: "Task assigned", sub: "When someone assigns a task to you" },
            ],
        },
        {
            label: "Meetings",
            items: [
                { key: "meetingReminder" as const, title: "Meeting reminders", sub: "15 min before a scheduled meeting" },
            ],
        },
        {
            label: "Projects",
            items: [
                { key: "projectUpdate" as const, title: "Project updates", sub: "Status changes and milestones" },
                { key: "weeklyDigest" as const, title: "Weekly digest", sub: "Summary of your week every Monday" },
            ],
        },
        {
            label: "General",
            items: [
                { key: "soundEnabled" as const, title: "Notification sounds", sub: "Play a chime for each notification" },
            ],
        },
    ];

    return (
        <div className="space-y-8">
            <SectionTitle title="Notifications" subtitle="Control what reminders and alerts you receive." />
            {groups.map((group) => (
                <SettingCard key={group.label}>
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">{group.label}</p>
                    <div className="space-y-1">
                        {group.items.map((item, idx) => (
                            <div key={item.key}>
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium text-zinc-200">{item.title}</p>
                                        <p className="mt-0.5 text-xs text-zinc-600">{item.sub}</p>
                                    </div>
                                    <Toggle enabled={notifs[item.key]} onChange={() => toggle(item.key)} />
                                </div>
                                {idx < group.items.length - 1 && <div className="border-t border-white/4" />}
                            </div>
                        ))}
                    </div>
                </SettingCard>
            ))}
            <div className="flex justify-end">
                <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-100">
                    <Check size={15} /> Save preferences
                </button>
            </div>
        </div>
    );
}

function AccountSection() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div className="space-y-8">
            <SectionTitle title="Account & Security" subtitle="Manage your password and account data." />

            <SettingCard>
                <div className="mb-5 flex items-center gap-2">
                    <Lock size={14} className="text-zinc-500" />
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Change Password</p>
                </div>
                <div className="space-y-4">
                    {[
                        { label: "Current password", value: currentPassword, set: setCurrentPassword },
                        { label: "New password",     value: newPassword,     set: setNewPassword },
                        { label: "Confirm new password", value: confirmPassword, set: setConfirmPassword },
                    ].map(({ label, value, set }) => (
                        <div key={label}>
                            <label className="mb-2 block text-xs font-medium text-zinc-400">{label}</label>
                            <input type="password" value={value} onChange={(e) => set(e.target.value)} placeholder="••••••••"
                                className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/20 focus:bg-white/6" />
                        </div>
                    ))}
                </div>
                <div className="mt-5 flex justify-end">
                    <button className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-100">
                        <Lock size={13} /> Update password
                    </button>
                </div>
            </SettingCard>

            <SettingCard>
                <div className="mb-5 flex items-center gap-2">
                    <Globe size={14} className="text-zinc-500" />
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Active Session</p>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/6 bg-white/3 px-4 py-3">
                    <div>
                        <p className="text-sm font-medium text-zinc-200">Current device</p>
                        <p className="mt-0.5 text-xs text-zinc-600">Ho Chi Minh City · Chrome on macOS</p>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Active
                    </span>
                </div>
                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-white/15 hover:text-zinc-200">
                    <LogOut size={14} /> Sign out of all devices
                </button>
            </SettingCard>

            <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-6">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-red-400/70">Danger Zone</p>
                <p className="mb-5 text-sm text-zinc-600">These actions are irreversible. Proceed with caution.</p>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-300">Delete account</p>
                        <p className="mt-0.5 text-xs text-zinc-600">Permanently remove all your data.</p>
                    </div>
                    <button className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20">
                        <Trash2 size={13} /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState<SettingSection>("appearance");

    const renderSection = () => {
        switch (activeSection) {
            case "appearance":    return <AppearanceSection />;
            case "profile":       return <ProfileSection />;
            case "notifications": return <NotificationsSection />;
            case "account":       return <AccountSection />;
        }
    };

    return (
        <div className="min-h-screen text-white">
            <div className="mb-8">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-zinc-600">Configuration</p>
                <h1 className="text-[22px] font-medium text-white">Settings</h1>
                <p className="mt-1 text-sm text-zinc-600">Customize your workspace to fit your workflow.</p>
            </div>

            <div className="flex gap-8">
                {/* Desktop left nav */}
                <aside className="hidden w-[200px] flex-shrink-0 lg:block">
                    <nav className="space-y-0.5">
                        {SIDEBAR_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
                                        isActive
                                            ? "bg-white/8 text-white"
                                            : "text-zinc-500 hover:bg-white/4 hover:text-zinc-300"
                                    }`}
                                >
                                    <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${isActive ? "bg-white/10" : "bg-white/4 group-hover:bg-white/6"}`}>
                                        <Icon size={14} />
                                    </div>
                                    <span className="text-sm font-medium">{item.label}</span>
                                    {isActive && <ChevronRight size={12} className="ml-auto flex-shrink-0 text-zinc-500" />}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Mobile tab bar */}
                <div className="mb-6 flex gap-1 overflow-x-auto lg:hidden">
                    {SIDEBAR_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                                    isActive ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                <Icon size={14} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                {/* Main content */}
                <main className="min-w-0 flex-1">{renderSection()}</main>
            </div>
        </div>
    );
}
