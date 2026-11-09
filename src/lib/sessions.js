import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { dateKey } from './stats';

// Struktur data: users/{uid}/sessions/{sessionId}
// Yang disimpan hanya ringkasan (bukan setiap soal) supaya hemat kuota baca/tulis.
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
