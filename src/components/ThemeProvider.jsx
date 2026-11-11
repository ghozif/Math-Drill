import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadTheme, resolveMode, saveTheme } from '../lib/theme';

const ThemeContext = createContext(null);
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(loadTheme);
  const [prefersDark, setPrefersDark] = useState(() => darkQuery().matches);

  useEffect(() => {
    const q = darkQuery();
    const onChange = (e) => setPrefersDark(e.matches);
    q.addEventListener('change', onChange);
    return () => q.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    saveTheme(theme);
    const root = document.documentElement;
    root.dataset.theme = resolveMode(theme.mode, prefersDark);
    root.dataset.accent = theme.accent;
    const accent = getComputedStyle(root).getPropertyValue('--accent').trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', accent);
  }, [theme, prefersDark]);

  const value = useMemo(
    () => ({ ...theme, setAccent: (accent) => setTheme((t) => ({ ...t, accent })), setMode: (mode) => setTheme((t) => ({ ...t, mode })) }),
    [theme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
