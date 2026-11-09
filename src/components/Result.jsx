import { OPS } from '../lib/generator';
import { formatClock, formatPct, formatSec } from '../lib/stats';

const SAVE_TEXT = {
  saving: 'Menyimpan… (kalau offline, otomatis tersinkron saat online)',
  saved: 'Tersimpan ke riwayat ✓',
  error: 'Gagal menyimpan ke riwayat.',
};

export default function Result({ result, onAgain, onHome }) {
  const { summary, records, durationMs, saveState } = result;
  const missed = records.filter((r) => !r.firstTry);

  return (
    <div className="container">
      <section className="card">
        <div className="big">{formatPct(summary.accuracy)}</div>
        <p className="center-text muted">
          {summary.correct} dari {summary.total} soal benar di percobaan pertama
        </p>
        <div className="stats">
          <div className="stat-box">
            <span className="muted small">Rata-rata per soal</span>
            <b>{formatSec(summary.avgMs)}</b>
          </div>
          <div className="stat-box">
            <span className="muted small">Durasi</span>
            <b>{formatClock(durationMs / 1000)}</b>
          </div>
          <div className="stat-box">
            <span className="muted small">Total percobaan salah</span>
            <b>{summary.wrongAttempts}</b>
          </div>
          <div className="stat-box">
            <span className="muted small">Soal per menit</span>
            <b>{durationMs ? ((summary.total / durationMs) * 60000).toFixed(1) : 0}</b>
          </div>
        </div>
        <p className={`small ${saveState === 'error' ? 'error' : 'muted'}`}>{SAVE_TEXT[saveState]}</p>
      </section>

      {Object.keys(summary.perOp).length > 1 && (
        <section className="card">
          <h2>Per operasi</h2>
          <table>
            <thead>
              <tr>
                <th>Operasi</th>
                <th>Soal</th>
                <th>Akurasi</th>
                <th>Rata-rata</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary.perOp).map(([op, o]) => (
                <tr key={op}>
                  <td>
                    {OPS[op].symbol} {OPS[op].label}
                  </td>
                  <td>{o.total}</td>
                  <td>{formatPct(o.correct / o.total)}</td>
                  <td>{formatSec(o.totalMs / o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {missed.length > 0 && (
        <section className="card">
          <h2>Soal yang sempat salah</h2>
          {missed.map((r, i) => (
            <div className="miss" key={i}>
              <span>
                {r.x} {OPS[r.op].symbol} {r.y} = <b>{r.answer}</b>
              </span>
              <span className="muted small">salah {r.wrongAttempts}×</span>
            </div>
          ))}
        </section>
      )}

      <div className="btn-row">
        <button type="button" className="btn secondary" onClick={onHome}>
          Ubah setting
        </button>
        <button type="button" className="btn" onClick={onAgain}>
          Ulangi
        </button>
      </div>
    </div>
  );
}
