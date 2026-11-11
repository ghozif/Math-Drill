import { dateKey } from './stats.js';

export function shiftKey(key, days) {
  const [y, m, d] = key.split('-').map(Number);
  return dateKey(new Date(y, m - 1, d + days));
}

// Seperti Duolingo: streak tetap hidup sampai akhir hari ini walau belum latihan hari ini,
// baru putus kalau kemarin juga terlewat.
export function computeStreak(days, today = dateKey()) {
  const has = days instanceof Set ? (k) => days.has(k) : (k) => days.includes(k);
  const doneToday = has(today);
  let cursor = doneToday ? today : shiftKey(today, -1);
  let current = 0;
  while (has(cursor)) {
    current++;
    cursor = shiftKey(cursor, -1);
  }
  return { current, doneToday };
}
