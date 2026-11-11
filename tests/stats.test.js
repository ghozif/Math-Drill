import assert from 'node:assert/strict';
import { groupByDayOp, summarize } from '../src/lib/stats.js';

const s1 = summarize([
  { op: 'add', firstTry: true, wrongAttempts: 0, timeMs: 1000 },
  { op: 'mul', firstTry: false, wrongAttempts: 2, timeMs: 3000 },
  { op: 'add', firstTry: false, wrongAttempts: 1, timeMs: 2000 },
]);
const s2 = summarize([{ op: 'add', firstTry: true, wrongAttempts: 0, timeMs: 500 }]);

const byDay = groupByDayOp([
  { dateKey: '2026-11-10', ...s1 },
  { dateKey: '2026-11-10', ...s2 },
  { dateKey: '2026-11-09', ...s2 },
  { dateKey: '2026-11-08', total: 3 },
]);

assert.deepEqual(byDay['2026-11-10'], {
  add: { total: 3, correct: 2, totalMs: 3500 },
  mul: { total: 1, correct: 0, totalMs: 3000 },
});
assert.deepEqual(byDay['2026-11-09'], { add: { total: 1, correct: 1, totalMs: 500 } });
assert.equal(byDay['2026-11-08'], undefined, 'sesi tanpa perOp diabaikan');

console.log('OK: groupByDayOp');
