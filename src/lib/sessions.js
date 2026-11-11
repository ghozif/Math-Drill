import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../firebase';
import { dateKey } from './stats';
import { computeStreak, shiftKey } from './streak';

export async function saveSession(uid, { settings, summary, durationMs, startedAt }) {
  return addDoc(collection(db, 'users', uid, 'sessions'), {
    ops: settings.ops,
    digitsX: settings.digitsX,
    digitsY: settings.digitsY,
    mode: settings.mode,
    target: settings.target,
    ...summary,
    durationMs,
    startedAt,
    dateKey: dateKey(new Date(startedAt)),
    createdAt: serverTimestamp(),
  });
}

export async function loadSessions(uid, max = 500) {
  const q = query(collection(db, 'users', uid, 'sessions'), orderBy('createdAt', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Ambil rentang pendek dulu supaya hemat read; baru diperlebar kalau streak-nya menyentuh ujung rentang.
export async function loadPracticeDays(uid, today = dateKey()) {
  let days = new Set();
  for (const span of [31, 127, 511, 2047]) {
    const q = query(collection(db, 'users', uid, 'sessions'), where('dateKey', '>=', shiftKey(today, -span)));
    const snap = await getDocs(q);
    days = new Set(snap.docs.map((d) => d.data().dateKey));
    if (computeStreak(days, today).current < span) break;
  }
  return days;
}
