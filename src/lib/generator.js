// Generator soal hitung.
// Aturan:
// - Penjumlahan & perkalian: X dan Y diacak sesuai jumlah digit.
// - Pengurangan: hasil tidak pernah negatif (X >= Y).
// - Pembagian: hasil selalu bulat (X dibuat dari Y × hasil).

export const OPS = {
  add: { symbol: '+', label: 'Penjumlahan' },
  sub: { symbol: '−', label: 'Pengurangan' },
  mul: { symbol: '×', label: 'Perkalian' },
  div: { symbol: '÷', label: 'Pembagian' },
};

export const OP_KEYS = Object.keys(OPS);
export const MAX_DIGITS = 5;

// 1 digit -> 1..9 (0 tidak dipakai supaya soal tidak terlalu remeh)
// n digit -> 10^(n-1) .. 10^n - 1
export function digitRange(n) {
  return n <= 1 ? [1, 9] : [10 ** (n - 1), 10 ** n - 1];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function validateSettings(s) {
  const errors = [];
  if (!s.ops || s.ops.length === 0) errors.push('Pilih minimal satu operasi.');
  if (s.ops?.includes('div') && s.digitsX < s.digitsY) {
    errors.push('Untuk pembagian, digit X harus ≥ digit Y supaya hasilnya bisa bulat.');
  }
  return errors;
}

function makeAdd(rx, ry) {
  const x = randInt(...rx);
  const y = randInt(...ry);
  return { x, y, answer: x + y };
}

function makeSub(rx, ry) {
  // Coba cari pasangan dengan X >= Y tanpa mengubah jumlah digit.
  for (let i = 0; i < 30; i++) {
    const x = randInt(...rx);
    const y = randInt(...ry);
    if (x >= y) return { x, y, answer: x - y };
  }
  // Kalau X lebih pendek dari Y (mis. 1 digit − 2 digit), tukar posisinya.
  const a = randInt(...rx);
  const b = randInt(...ry);
  const x = Math.max(a, b);
  const y = Math.min(a, b);
  return { x, y, answer: x - y };
}

function makeMul(rx, ry) {
  const x = randInt(...rx);
  const y = randInt(...ry);
  return { x, y, answer: x * y };
}

function makeDiv(rx, ry) {
  // Mulai dari pembagi (Y) dan hasil (Q), lalu X = Y × Q.
  // Utamakan Y >= 2 dan Q >= 2 supaya tidak ada soal "÷ 1" atau "= 1".
  for (const minVal of [2, 1]) {
    for (let i = 0; i < 60; i++) {
      const yMin = Math.max(minVal, ry[0]);
      if (yMin > ry[1]) continue;
      const y = randInt(yMin, ry[1]);
      const qMin = Math.max(minVal, Math.ceil(rx[0] / y));
      const qMax = Math.floor(rx[1] / y);
      if (qMin <= qMax) {
        const q = randInt(qMin, qMax);
        return { x: y * q, y, answer: q };
      }
    }
  }
  return null; // kombinasi digit tidak memungkinkan
}

const makers = { add: makeAdd, sub: makeSub, mul: makeMul, div: makeDiv };

export function generateProblem(settings, prev) {
  const rx = digitRange(settings.digitsX);
  const ry = digitRange(settings.digitsY);
  const ops = settings.ops.length ? settings.ops : ['add'];

  for (let i = 0; i < 30; i++) {
    const op = ops[randInt(0, ops.length - 1)];
    const p = makers[op](rx, ry);
    if (!p) continue;
    // Hindari soal yang persis sama dengan soal sebelumnya.
    if (prev && prev.op === op && prev.x === p.x && prev.y === p.y) continue;
    return { op, ...p };
  }
  return { op: 'add', ...makeAdd(rx, ry) };
}

export function formatProblem(p) {
  return `${p.x} ${OPS[p.op].symbol} ${p.y}`;
}
