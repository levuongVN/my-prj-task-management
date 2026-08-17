import { useContext } from 'react';
import type { ThemeContextValue } from './theme.types';
import { ThemeContext } from './ThemeContext';

export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}
