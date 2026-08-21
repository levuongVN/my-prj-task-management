import type { ThemeId, AccentId } from "../../contexts/ThemeContext";

export type SettingSection = "appearance" | "profile" | "notifications" | "account" | "devices";

export interface ThemePreset {
    id: ThemeId;
    name: string;
    preview: string[];
    tag?: string;
}

export interface AccentColor {
    id: AccentId;
    name: string;
    color: string;
}
