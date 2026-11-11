import { MAX_DIGITS, OP_KEYS } from './generator';

const KEY = 'drill-hitung:settings';

export const PRESETS = {
  count: [10, 20, 50, 100],
  time: [30, 60, 120, 300], 
};

export const DEFAULT_SETTINGS = {
  ops: ['add'],
  digitsX: 2,
  digitsY: 1,
  mode: 'count',
  target: 20,
  keypad: true,
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
