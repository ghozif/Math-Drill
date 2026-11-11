export function dateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function summarize(records) {
  const total = records.length;
  let correct = 0;
  let wrongAttempts = 0;
  let totalMs = 0;
  const perOp = {};

  for (const r of records) {
    if (r.firstTry) correct++;
    wrongAttempts += r.wrongAttempts;
    totalMs += r.timeMs;
    const o = (perOp[r.op] ??= { total: 0, correct: 0, totalMs: 0 });
    o.total++;
    if (r.firstTry) o.correct++;
    o.totalMs += r.timeMs;
  }

  return {
    total,
    correct,
    wrongAttempts,
    totalMs,
    accuracy: total ? correct / total : 0,
    avgMs: total ? Math.round(totalMs / total) : 0,
    perOp,
  };
}

export function groupByDay(sessions) {
  const map = new Map();
  for (const s of sessions) {
    const d = map.get(s.dateKey) ?? { date: s.dateKey, sessions: 0, total: 0, correct: 0, totalMs: 0 };
    d.sessions++;
    d.total += s.total ?? 0;
    d.correct += s.correct ?? 0;
    d.totalMs += s.totalMs ?? 0;
    map.set(s.dateKey, d);
  }
  return [...map.values()]
    .map((d) => ({
      ...d,
      accuracy: d.total ? d.correct / d.total : 0,
      avgMs: d.total ? Math.round(d.totalMs / d.total) : 0,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// { 'YYYY-MM-DD': { add: { total, correct, totalMs }, ... } }
export function groupByDayOp(sessions) {
  const out = {};
  for (const s of sessions) {
    for (const [op, o] of Object.entries(s.perOp ?? {})) {
      const a = ((out[s.dateKey] ??= {})[op] ??= { total: 0, correct: 0, totalMs: 0 });
      a.total += o.total ?? 0;
      a.correct += o.correct ?? 0;
      a.totalMs += o.totalMs ?? 0;
    }
  }
  return out;
}

export function formatPct(x) {
  return `${Math.round(x * 100)}%`;
}

export function formatClock(totalSec) {
  const s = Math.max(0, Math.ceil(totalSec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
