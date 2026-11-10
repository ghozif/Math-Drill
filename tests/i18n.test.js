// Uji kelengkapan terjemahan: node tests/i18n.test.js
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { OP_KEYS, validateSettings } from '../src/lib/generator.js';
import { LANGUAGES, MESSAGES, createI18n } from '../src/lib/i18n.js';

const placeholders = (m) => (typeof m === 'string' ? [...m.matchAll(/\{(\w+)\}/g)].map((x) => x[1]).sort() : null);

// Setiap bahasa punya kunci dan placeholder yang sama.
const langs = Object.keys(LANGUAGES);
const keys = Object.keys(MESSAGES.id).sort();
for (const lang of langs) {
  assert.deepEqual(Object.keys(MESSAGES[lang]).sort(), keys, `kunci ${lang} berbeda`);
  for (const key of keys) {
    const a = placeholders(MESSAGES.id[key]);
    const b = placeholders(MESSAGES[lang][key]);
    if (a && b) assert.deepEqual(b, a, `placeholder ${lang}:${key} berbeda`);
  }
}

// Setiap kunci yang dipakai kode harus ada di kamus.
const srcFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? srcFiles(join(dir, e.name)) : /\.jsx?$/.test(e.name) ? [join(dir, e.name)] : [],
  );
let used = 0;
for (const file of srcFiles('src')) {
  if (file.endsWith('i18n.js')) continue;
  const code = readFileSync(file, 'utf8');
  const literal = /\bt\('([^']+)'/g;
  const mapped = /:\s*'((?:result)\.[\w.]+)'/g;
  for (const re of [literal, mapped]) {
    for (const [, key] of code.matchAll(re)) {
      assert.ok(keys.includes(key), `${file}: kunci "${key}" tidak ada di kamus`);
      used++;
    }
  }
}
assert.ok(used > 50, `hanya ${used} kunci terdeteksi, regex pemindai mungkin rusak`);

for (const op of OP_KEYS) assert.ok(keys.includes(`ops.${op}`), `ops.${op} tidak ada`);
for (const key of [
  ...validateSettings({ ops: [], digitsX: 1, digitsY: 1 }),
  ...validateSettings({ ops: ['div'], digitsX: 1, digitsY: 2 }),
]) {
  assert.ok(keys.includes(key), `${key} tidak ada`);
}

// Format dan bentuk jamak.
const id = createI18n('id');
const en = createI18n('en');
assert.equal(id.formatSec(1500), '1,5 dtk');
assert.equal(en.formatSec(1500), '1.5 sec');
assert.equal(en.t('count.problems', { n: 1 }), '1 problem');
assert.equal(en.t('count.problems', { n: 20 }), '20 problems');
assert.equal(id.t('count.problems', { n: 20 }), '20 soal');
assert.equal(en.t('drill.wrongHint', { n: 0 }), 'Wrong 0×, try again');
assert.equal(id.formatDateLabel('2026-11-09'), new Date(2026, 10, 9).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }));
assert.equal(en.formatDateLabel('2026-11-09'), 'Mon, Nov 9');

console.log(`OK: ${keys.length} kunci di ${langs.length} bahasa, ${used} pemakaian di kode`);
