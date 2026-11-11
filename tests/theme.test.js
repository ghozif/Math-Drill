import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MESSAGES } from '../src/lib/i18n.js';
import { ACCENTS, MODES, resolveMode, sanitizeTheme } from '../src/lib/theme.js';

assert.equal(resolveMode('auto', true), 'dark');
assert.equal(resolveMode('auto', false), 'light');
assert.equal(resolveMode('light', true), 'light');
assert.equal(resolveMode('dark', false), 'dark');
assert.deepEqual(sanitizeTheme({ accent: 'neon', mode: 'sepia' }), { accent: 'teal', mode: 'auto' });
assert.deepEqual(sanitizeTheme(null), { accent: 'teal', mode: 'auto' });
assert.deepEqual(sanitizeTheme({ accent: 'rose', mode: 'dark' }), { accent: 'rose', mode: 'dark' });

for (const lang of Object.keys(MESSAGES)) {
  for (const key of [...ACCENTS, ...MODES]) assert.ok(MESSAGES[lang][`theme.${key}`], `${lang}: theme.${key} tidak ada`);
}

// index.html punya salinan kecil daftar warna; harus sama dengan ACCENTS.
const html = readFileSync('index.html', 'utf8');
assert.ok(html.includes(`^(${ACCENTS.join('|')})$`), 'daftar warna di index.html tidak sama dengan ACCENTS');

// Kontras WCAG: teks di tombol (accent-ink di atas accent) dan accent sebagai warna link di atas surface.
const css = readFileSync('src/styles.css', 'utf8');
const lum = (hex) => {
  const c = hex.match(/\w\w/g).map((h) => parseInt(h, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const surface = { light: '#ffffff', dark: '#181c1a' };
let checked = 0;
for (const accent of ACCENTS) {
  for (const mode of ['light', 'dark']) {
    const sel = mode === 'light' ? `[data-accent='${accent}'] {` : `[data-theme='dark'] [data-accent='${accent}'] {`;
    const block = css.slice(css.indexOf(sel)).split('}')[0];
    assert.ok(css.includes(sel), `blok CSS ${mode}/${accent} tidak ada`);
    const get = (name) => block.match(new RegExp(`--${name}: (#[0-9a-f]{6})`))[1];
    const [a, ink] = [get('accent'), get('accent-ink')];
    assert.ok(contrast(a, ink) >= 4.5, `${mode}/${accent}: teks tombol kontras ${contrast(a, ink).toFixed(2)}`);
    assert.ok(contrast(a, surface[mode]) >= 4.5, `${mode}/${accent}: link kontras ${contrast(a, surface[mode]).toFixed(2)}`);
    checked++;
  }
}
console.log(`OK: tema (${checked} kombinasi warna × mode lolos kontras)`);
