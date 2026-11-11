import assert from 'node:assert/strict';
import { computeStreak, shiftKey } from '../src/lib/streak.js';

assert.equal(shiftKey('2026-03-01', -1), '2026-02-28');
assert.equal(shiftKey('2024-03-01', -1), '2024-02-29');
assert.equal(shiftKey('2026-01-01', -1), '2025-12-31');
assert.equal(shiftKey('2026-12-31', 1), '2027-01-01');
// Hari pergantian jam musim panas tidak boleh terlewat atau terhitung dua kali.
assert.equal(shiftKey('2026-03-09', -1), '2026-03-08');
assert.equal(shiftKey('2026-11-02', -1), '2026-11-01');

const today = '2026-11-11';

assert.deepEqual(computeStreak([], today), { current: 0, doneToday: false });
assert.deepEqual(computeStreak(new Set([today]), today), { current: 1, doneToday: true });
assert.deepEqual(computeStreak(['2026-11-09', '2026-11-10', today], today), { current: 3, doneToday: true });

// Belum latihan hari ini tapi kemarin latihan: streak masih hidup.
assert.deepEqual(computeStreak(['2026-11-09', '2026-11-10'], today), { current: 2, doneToday: false });

// Kemarin terlewat: streak putus, yang lama tidak dihitung.
assert.deepEqual(computeStreak(['2026-11-08', '2026-11-09'], today), { current: 0, doneToday: false });
assert.deepEqual(computeStreak(['2026-11-08', '2026-11-09', today], today), { current: 1, doneToday: true });

// Melewati batas bulan dan tahun.
const long = [];
for (let i = 0; i < 400; i++) long.push(shiftKey(today, -i));
assert.deepEqual(computeStreak(new Set(long), today), { current: 400, doneToday: true });

// Duplikat dan tanggal masa depan tidak mengacaukan hitungan.
assert.deepEqual(computeStreak(['2026-11-10', '2026-11-10', '2026-11-12'], today), { current: 1, doneToday: false });

console.log('OK: streak');
