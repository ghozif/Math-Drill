// Harus sama dengan skrip kecil di index.html yang memasang tema sebelum halaman tampil.
const KEY = 'drill-hitung:theme';

export const ACCENTS = ['teal', 'blue', 'violet', 'rose', 'amber'];
export const MODES = ['auto', 'light', 'dark'];
export const DEFAULT_THEME = { accent: 'teal', mode: 'auto' };

export function sanitizeTheme(t) {
  return {
    accent: ACCENTS.includes(t?.accent) ? t.accent : DEFAULT_THEME.accent,
    mode: MODES.includes(t?.mode) ? t.mode : DEFAULT_THEME.mode,
  };
}

export const resolveMode = (mode, prefersDark) => (mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode);

export function loadTheme() {
  try {
    return sanitizeTheme(JSON.parse(localStorage.getItem(KEY) ?? '{}'));
  } catch {
    return DEFAULT_THEME;
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(KEY, JSON.stringify(theme));
  } catch {
    /* mode private / storage diblokir: abaikan */
  }
}
