// Uji cepat generator: node tests/generator.test.js
import assert from 'node:assert/strict';
import { digitRange, generateProblem, validateSettings } from '../src/lib/generator.js';

const digits = (n) => String(n).length;
let checked = 0;

for (const op of ['add', 'sub', 'mul', 'div']) {
  for (let dx = 1; dx <= 4; dx++) {
    for (let dy = 1; dy <= 4; dy++) {
      const s = { ops: [op], digitsX: dx, digitsY: dy };
      if (validateSettings(s).length) continue;
      const [xMin, xMax] = digitRange(dx);
      const [yMin, yMax] = digitRange(dy);
      let prev;
      for (let i = 0; i < 3000; i++) {
        const p = generateProblem(s, prev);
        prev = p;
        assert.equal(p.op, op);
        assert.ok(Number.isInteger(p.answer), `bukan bilangan bulat: ${JSON.stringify(p)}`);
        assert.ok(p.answer >= 0, `negatif: ${JSON.stringify(p)}`);
        if (op === 'add') assert.equal(p.answer, p.x + p.y);
        if (op === 'sub') assert.equal(p.answer, p.x - p.y);
        if (op === 'mul') assert.equal(p.answer, p.x * p.y);
        if (op === 'div') assert.equal(p.x, p.y * p.answer);
        // Jumlah digit harus sesuai setting (kecuali pengurangan yang ditukar karena X < Y)
        if (!(op === 'sub' && dx < dy)) {
          assert.ok(p.x >= xMin && p.x <= xMax, `X keluar rentang: ${JSON.stringify(p)} (${dx} digit)`);
          assert.ok(p.y >= yMin && p.y <= yMax, `Y keluar rentang: ${JSON.stringify(p)} (${dy} digit)`);
          assert.equal(digits(p.x), dx);
          assert.equal(digits(p.y), dy);
        }
        checked++;
      }
    }
  }
}

assert.ok(validateSettings({ ops: [], digitsX: 1, digitsY: 1 }).length > 0);
assert.ok(validateSettings({ ops: ['div'], digitsX: 1, digitsY: 2 }).length > 0);
console.log(`OK: ${checked.toLocaleString()} soal lolos uji`);
