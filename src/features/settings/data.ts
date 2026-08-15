import { User, Palette, Bell, Shield } from "lucide-react";
import type { SettingSection, ThemePreset, AccentColor } from "./types";

export const THEME_PRESETS: ThemePreset[] = [
    { id: "midnight",  name: "Midnight",  preview: ["#050505", "#111111", "#1a1a1a", "#ffffff"], tag: "Default" },
    { id: "zinc",      name: "Zinc Dark", preview: ["#18181b", "#27272a", "#3f3f46", "#a1a1aa"] },
    { id: "nord",      name: "Nord",      preview: ["#2e3440", "#3b4252", "#4c566a", "#88c0d0"] },
    { id: "navy",      name: "Deep Navy", preview: ["#0a0f1e", "#0f172a", "#1e293b", "#6366f1"] },
    { id: "rose-pine", name: "Rosé Pine", preview: ["#191724", "#1f1d2e", "#26233a", "#eb6f92"] },
    { id: "light",     name: "Snow",      preview: ["#fafafa", "#ffffff", "#f4f4f5", "#18181b"] },
];

export const ACCENT_COLORS: AccentColor[] = [
    { id: "white",   name: "Arctic",  color: "#ffffff" },
    { id: "indigo",  name: "Indigo",  color: "#6366f1" },
    { id: "blue",    name: "Sapphire", color: "#3b82f6" },
    { id: "cyan",    name: "Cyan",    color: "#06b6d4" },
    { id: "emerald", name: "Emerald", color: "#10b981" },
    { id: "amber",   name: "Amber",   color: "#f59e0b" },
    { id: "rose",    name: "Rose",    color: "#f43f5e" },
    { id: "purple",  name: "Violet",  color: "#a855f7" },
];

export const SIDEBAR_ITEMS: { id: SettingSection; icon: typeof User; label: string }[] = [
    { id: "appearance", icon: Palette, label: "Appearance" },
    { id: "profile",    icon: User,    label: "Profile" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "account",    icon: Shield,  label: "Account & Security" },
];
