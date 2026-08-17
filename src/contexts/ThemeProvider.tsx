import { useEffect, useState, type ReactNode } from 'react';
import type { ThemeConfig, ThemeId, AccentId, FontSize } from './theme.types';
import { ThemeContext } from './ThemeContext';

// ─── Defaults ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'taskflow-theme';

const DEFAULT_CONFIG: ThemeConfig = {
    themeId: 'midnight',
    accentId: 'white',
    fontSize: 'md',
    colorMode: 'dark',
};

// ─── CSS Variable Maps ─────────────────────────────────────────────────────────

const THEME_VARS: Record<ThemeId, Record<string, string>> = {
    midnight: {
        '--bg-base': '#050505',
        '--bg-surface': '#0a0a0a',
        '--bg-card': '#111111',
        '--bg-hover': 'rgba(255,255,255,0.04)',
        '--border': 'rgba(255,255,255,0.06)',
        '--border-strong': 'rgba(255,255,255,0.12)',
        '--text-primary': '#ffffff',
        '--text-secondary': '#a1a1aa',
        '--text-muted': '#52525b',
    },
    zinc: {
        '--bg-base': '#18181b',
        '--bg-surface': '#1f1f23',
        '--bg-card': '#27272a',
        '--bg-hover': 'rgba(255,255,255,0.04)',
        '--border': 'rgba(255,255,255,0.08)',
        '--border-strong': 'rgba(255,255,255,0.15)',
        '--text-primary': '#fafafa',
        '--text-secondary': '#a1a1aa',
        '--text-muted': '#52525b',
    },
    nord: {
        '--bg-base': '#2e3440',
        '--bg-surface': '#373e4d',
        '--bg-card': '#3b4252',
        '--bg-hover': 'rgba(255,255,255,0.05)',
        '--border': 'rgba(255,255,255,0.08)',
        '--border-strong': 'rgba(136,192,208,0.2)',
        '--text-primary': '#eceff4',
        '--text-secondary': '#81a1c1',
        '--text-muted': '#4c566a',
    },
    navy: {
        '--bg-base': '#0a0f1e',
        '--bg-surface': '#0d1526',
        '--bg-card': '#0f172a',
        '--bg-hover': 'rgba(99,102,241,0.05)',
        '--border': 'rgba(99,102,241,0.1)',
        '--border-strong': 'rgba(99,102,241,0.2)',
        '--text-primary': '#f1f5f9',
        '--text-secondary': '#94a3b8',
        '--text-muted': '#475569',
    },
    'rose-pine': {
        '--bg-base': '#191724',
        '--bg-surface': '#1d1a2b',
        '--bg-card': '#1f1d2e',
        '--bg-hover': 'rgba(235,111,146,0.05)',
        '--border': 'rgba(235,111,146,0.08)',
        '--border-strong': 'rgba(235,111,146,0.18)',
        '--text-primary': '#e0def4',
        '--text-secondary': '#908caa',
        '--text-muted': '#524f67',
    },
    light: {
        '--bg-base': '#fafafa',
        '--bg-surface': '#f4f4f5',
        '--bg-card': '#ffffff',
        '--bg-hover': 'rgba(0,0,0,0.04)',
        '--border': 'rgba(0,0,0,0.07)',
        '--border-strong': 'rgba(0,0,0,0.15)',
        '--text-primary': '#09090b',
        '--text-secondary': '#52525b',
        '--text-muted': '#a1a1aa',
    },
};

const ACCENT_VARS: Record<AccentId, Record<string, string>> = {
    white:   { '--accent': '#ffffff', '--accent-fg': '#000000', '--accent-muted': 'rgba(255,255,255,0.12)' },
    indigo:  { '--accent': '#6366f1', '--accent-fg': '#ffffff', '--accent-muted': 'rgba(99,102,241,0.15)' },
    blue:    { '--accent': '#3b82f6', '--accent-fg': '#ffffff', '--accent-muted': 'rgba(59,130,246,0.15)' },
    cyan:    { '--accent': '#06b6d4', '--accent-fg': '#000000', '--accent-muted': 'rgba(6,182,212,0.15)' },
    emerald: { '--accent': '#10b981', '--accent-fg': '#000000', '--accent-muted': 'rgba(16,185,129,0.15)' },
    amber:   { '--accent': '#f59e0b', '--accent-fg': '#000000', '--accent-muted': 'rgba(245,158,11,0.15)' },
    rose:    { '--accent': '#f43f5e', '--accent-fg': '#ffffff', '--accent-muted': 'rgba(244,63,94,0.15)' },
    purple:  { '--accent': '#a855f7', '--accent-fg': '#ffffff', '--accent-muted': 'rgba(168,85,247,0.15)' },
};

const FONT_SIZE_VARS: Record<FontSize, string> = {
    sm: '13px',
    md: '14px',
    lg: '16px',
};

// ─── Apply to DOM ──────────────────────────────────────────────────────────────

function applyTheme(config: ThemeConfig) {
    const root = document.documentElement;

    let activeThemeId = config.themeId;
    if (config.colorMode === 'light') {
        activeThemeId = 'light';
    } else if (config.colorMode === 'system') {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        activeThemeId = isSystemDark ? (config.themeId === 'light' ? 'midnight' : config.themeId) : 'light';
    } else if (config.colorMode === 'dark' && config.themeId === 'light') {
        activeThemeId = 'midnight';
    }

    const themeVars = THEME_VARS[activeThemeId];
    Object.entries(themeVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });

    const accentVars = { ...ACCENT_VARS[config.accentId] };

    if (activeThemeId === 'light' && config.accentId === 'white') {
        accentVars['--accent'] = '#000000';
        accentVars['--accent-fg'] = '#ffffff';
        accentVars['--accent-muted'] = 'rgba(0,0,0,0.10)';
    }

    Object.entries(accentVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });

    root.style.setProperty('--font-size-base', FONT_SIZE_VARS[config.fontSize]);
    root.style.fontSize = FONT_SIZE_VARS[config.fontSize];

    root.setAttribute('data-theme', activeThemeId);
    root.setAttribute('data-color-mode', config.colorMode);

    if (activeThemeId === 'light') {
        root.classList.add('theme-light');
        root.classList.remove('theme-dark');
    } else {
        root.classList.add('theme-dark');
        root.classList.remove('theme-light');
    }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [config, setConfig] = useState<ThemeConfig>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return { ...DEFAULT_CONFIG, ...JSON.parse(stored) } as ThemeConfig;
            }
        } catch {
            // ignore
        }
        return DEFAULT_CONFIG;
    });

    useEffect(() => {
        applyTheme(config);

        if (config.colorMode === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = () => applyTheme(config);
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        }
    }, [config]);

    const updateConfig = (partial: Partial<ThemeConfig>) => {
        setConfig((prev) => {
            let newThemeId = prev.themeId;
            if (partial.colorMode) {
                if (partial.colorMode === 'light') newThemeId = 'light';
                else if (partial.colorMode === 'dark' && newThemeId === 'light') newThemeId = 'midnight';
            }
            if (partial.themeId) {
                if (partial.themeId === 'light') partial.colorMode = 'light';
                else partial.colorMode = 'dark';
            }

            return { ...prev, themeId: newThemeId, ...partial };
        });
    };

    const saveAppearance = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    };

    return (
        <ThemeContext.Provider
            value={{
                ...config,
                setThemeId: (id) => updateConfig({ themeId: id }),
                setAccentId: (id) => updateConfig({ accentId: id }),
                setFontSize: (size) => updateConfig({ fontSize: size }),
                setColorMode: (mode) => updateConfig({ colorMode: mode }),
                saveAppearance,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}
