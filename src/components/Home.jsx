import { useMemo } from 'react';
import { MAX_DIGITS, OPS, OP_KEYS, formatProblem, generateProblem, validateSettings } from '../lib/generator';
import { PRESETS } from '../lib/settings';

function Stepper({ value, min, max, onChange, label }) {
  return (
    <div className="stepper" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>
        −
      </button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>
        +
      </button>
    </div>
  );
}

const timeLabel = (s) => (s < 60 ? `${s} dtk` : `${s / 60} mnt`);

export default function Home({ settings, setSettings, onStart }) {
  const errors = validateSettings(settings);
  const update = (patch) => setSettings((s) => ({ ...s, ...patch }));

  const toggleOp = (op) =>
    update({
      ops: settings.ops.includes(op) ? settings.ops.filter((o) => o !== op) : [...settings.ops, op],
    });

  const setMode = (mode) => {
    if (mode !== settings.mode) update({ mode, target: mode === 'time' ? 60 : 20 });
  };

  // Contoh soal, berubah setiap setting operasi/digit berubah.
  const samples = useMemo(() => {
    if (errors.length) return [];
    const list = [];
    let prev;
    for (let i = 0; i < 3; i++) list.push((prev = generateProblem(settings, prev)));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.ops.join(), settings.digitsX, settings.digitsY, errors.length]);

  return (
    <div className="container">
      <section className="card">
        <h2>Operasi</h2>
        <div className="chips">
          {OP_KEYS.map((op) => (
            <button
              key={op}
              type="button"
              className={`chip ${settings.ops.includes(op) ? 'on' : ''}`}
              aria-pressed={settings.ops.includes(op)}
              onClick={() => toggleOp(op)}
            >
              <span className="sym">{OPS[op].symbol}</span>
              {OPS[op].label}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Jumlah digit</h2>
        <div className="row">
          <span>Angka pertama (X)</span>
          <Stepper label="Digit X" value={settings.digitsX} min={1} max={MAX_DIGITS} onChange={(v) => update({ digitsX: v })} />
        </div>
        <div className="row">
          <span>Angka kedua (Y)</span>
          <Stepper label="Digit Y" value={settings.digitsY} min={1} max={MAX_DIGITS} onChange={(v) => update({ digitsY: v })} />
        </div>
        {samples.length > 0 && (
          <div className="samples">
            {samples.map((p, i) => (
              <span key={i}>{formatProblem(p)}</span>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h2>Sesi</h2>
        <div className="segmented">
          <button type="button" className={settings.mode === 'count' ? 'on' : ''} onClick={() => setMode('count')}>
            Jumlah soal
          </button>
          <button type="button" className={settings.mode === 'time' ? 'on' : ''} onClick={() => setMode('time')}>
            Waktu
          </button>
        </div>
        <div className="chips">
          {PRESETS[settings.mode].map((v) => (
            <button
              key={v}
              type="button"
              className={`chip ${settings.target === v ? 'on' : ''}`}
              onClick={() => update({ target: v })}
            >
              {settings.mode === 'time' ? timeLabel(v) : `${v} soal`}
            </button>
          ))}
        </div>
        <label className="row custom">
          <span>{settings.mode === 'time' ? 'Atau isi sendiri (detik)' : 'Atau isi sendiri (soal)'}</span>
          <input
            type="number"
            inputMode="numeric"
            min={settings.mode === 'time' ? 10 : 1}
            max={settings.mode === 'time' ? 3600 : 1000}
            value={settings.target}
            onChange={(e) => update({ target: Math.max(1, Number(e.target.value) || 1) })}
          />
        </label>
      </section>

      <section className="card">
        <div className="row">
          <span>
            Keypad angka di layar
            <br />
            <span className="muted small">Matikan kalau mau pakai keyboard HP/laptop</span>
          </span>
          <label className="switch">
            <input type="checkbox" checked={settings.keypad} onChange={(e) => update({ keypad: e.target.checked })} />
            <span />
          </label>
        </div>
      </section>

      {errors.map((e) => (
        <p key={e} className="error">
          {e}
        </p>
      ))}
      <button type="button" className="btn" disabled={errors.length > 0} onClick={onStart}>
        Mulai latihan
      </button>
    </div>
  );
}
