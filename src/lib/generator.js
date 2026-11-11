export const OPS = {
  add: { symbol: '+' },
  sub: { symbol: '−' },
  mul: { symbol: '×' },
  div: { symbol: '÷' },
};

export const OP_KEYS = Object.keys(OPS);
export const MAX_DIGITS = 5;

export function digitRange(n) {
  return n <= 1 ? [1, 9] : [10 ** (n - 1), 10 ** n - 1];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function validateSettings(s) {
  const errors = [];
  if (!s.ops || s.ops.length === 0) errors.push('errors.noOps');
  if (s.ops?.includes('div') && s.digitsX < s.digitsY) {
    errors.push('errors.divDigits');
  }
  return errors;
}

function makeAdd(rx, ry) {
  const x = randInt(...rx);
  const y = randInt(...ry);
  return { x, y, answer: x + y };
}

function makeSub(rx, ry) {
  for (let i = 0; i < 30; i++) {
    const x = randInt(...rx);
    const y = randInt(...ry);
    if (x >= y) return { x, y, answer: x - y };
  }

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
  return null;
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
    if (prev && prev.op === op && prev.x === p.x && prev.y === p.y) continue;
    return { op, ...p };
  }
  return { op: 'add', ...makeAdd(rx, ry) };
}

export function formatProblem(p) {
  return `${p.x} ${OPS[p.op].symbol} ${p.y}`;
}
