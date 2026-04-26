import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

export type ThemeMode = 'system' | 'light' | 'dark';
type ResolvedScheme = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colorScheme: ResolvedScheme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProviderCustom({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  const setMode = useCallback((m: ThemeMode) => setModeState(m), []);

  const colorScheme: ResolvedScheme = useMemo(() => {
    if (mode === 'system') return systemScheme ?? 'light';
    return mode;
  }, [mode, systemScheme]);

  const value = useMemo(() => ({ mode, setMode, colorScheme }), [mode, setMode, colorScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeProviderCustom');
  return ctx;
}
