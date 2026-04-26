import { useThemeMode } from './use-theme-mode';

/**
 * Bridge hook: returns the resolved color scheme from the theme context.
 * Falls back to 'light' if used outside ThemeProviderCustom (e.g. during SSR).
 */
export function useResolvedColorScheme(): 'light' | 'dark' {
  try {
    const { colorScheme } = useThemeMode();
    return colorScheme;
  } catch {
    return 'light';
  }
}
