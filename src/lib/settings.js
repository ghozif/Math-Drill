import { MAX_DIGITS, OP_KEYS } from './generator';

const KEY = 'drill-hitung:settings';

export const PRESETS = {
  count: [10, 20, 50, 100], // jumlah soal
  time: [30, 60, 120, 300], // detik
};

export const DEFAULT_SETTINGS = {
  ops: ['add'],
  digitsX: 2,
  digitsY: 1,
  mode: 'count', // 'count' | 'time'
  target: 20,
  keypad: true, // keypad angka di layar, default aktif
};

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, Number(n) || lo));

export function sanitize(s) {
  const ops = Array.isArray(s.ops) ? s.ops.filter((o) => OP_KEYS.includes(o)) : DEFAULT_SETTINGS.ops;
  const mode = s.mode === 'time' ? 'time' : 'count';
  return {
    ops: ops.length ? ops : DEFAULT_SETTINGS.ops,
    digitsX: clamp(s.digitsX, 1, MAX_DIGITS),
    digitsY: clamp(s.digitsY, 1, MAX_DIGITS),
    mode,
    target: mode === 'time' ? clamp(s.target, 10, 3600) : clamp(s.target, 1, 1000),
    keypad: s.keypad !== false,
  };
}

// Setting disimpan di browser saja (per perangkat), riwayat di Firestore.
export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? sanitize({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) }) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* mode private / storage diblokir: abaikan */
  }
}
