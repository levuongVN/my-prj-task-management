import { Check, Moon, Monitor, Sparkles, Sun, Type } from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "../../../contexts/useTheme";
import type { FontSize, ColorMode } from "../../../contexts/theme.types";
import { THEME_PRESETS, ACCENT_COLORS } from "../data";
import { SectionTitle } from "./SectionTitle";
import { SettingCard } from "./SettingCard";

export function AppearanceSection() {
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
