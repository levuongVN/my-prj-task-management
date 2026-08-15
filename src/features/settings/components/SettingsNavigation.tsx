import { ChevronRight } from "lucide-react";
import { SIDEBAR_ITEMS } from "../data";
import type { SettingSection } from "../types";

interface SettingsNavigationProps {
    activeSection: SettingSection;
    onSelect: (section: SettingSection) => void;
}

export function SettingsNavigation({ activeSection, onSelect }: SettingsNavigationProps) {
    return (
        <>
            {/* Desktop left nav */}
            <aside className="hidden w-[200px] flex-shrink-0 lg:block">
                <nav className="space-y-0.5">
                    {SIDEBAR_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onSelect(item.id)}
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
                            onClick={() => onSelect(item.id)}
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
        </>
    );
}
