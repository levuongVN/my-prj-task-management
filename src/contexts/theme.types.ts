export type ThemeId = 'midnight' | 'zinc' | 'nord' | 'navy' | 'rose-pine' | 'light';
export type AccentId = 'white' | 'indigo' | 'blue' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple';
export type FontSize = 'sm' | 'md' | 'lg';
export type ColorMode = 'dark' | 'light' | 'system';

export interface ThemeConfig {
    themeId: ThemeId;
    accentId: AccentId;
    fontSize: FontSize;
    colorMode: ColorMode;
}

export interface ThemeContextValue extends ThemeConfig {
    setThemeId: (id: ThemeId) => void;
    setAccentId: (id: AccentId) => void;
    setFontSize: (size: FontSize) => void;
    setColorMode: (mode: ColorMode) => void;
    saveAppearance: () => void;
}
