import type { ThemeId, AccentId } from "../../contexts/theme.types";

export type SettingSection = "appearance" | "profile" | "notifications" | "account";

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
