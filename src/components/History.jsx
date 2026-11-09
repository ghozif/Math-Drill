import { useEffect, useMemo, useState } from 'react';
import { OPS } from '../lib/generator';
import { loadSessions } from '../lib/sessions';
import { dateKey, formatDateLabel, formatPct, formatSec, groupByDay } from '../lib/stats';

const DAYS_IN_CHART = 14;

export default function History({ uid }) {
  const [state, setState] = useState({ status: 'loading', sessions: [] });

  useEffect(() => {
    let alive = true;
    loadSessions(uid)
      .then((sessions) => alive && setState({ status: 'ok', sessions }))
      .catch((e) => {
        console.error(e);
        if (alive) setState({ status: 'error', sessions: [] });
      });
    return () => {
      alive = false;
    };
  }, [uid]);

  const days = useMemo(() => groupByDay(state.sessions), [state.sessions]);

  // 14 hari terakhir (termasuk hari tanpa latihan) untuk grafik.
  const chart = useMemo(() => {
    const byDate = Object.fromEntries(days.map((d) => [d.date, d]));
    const out = [];
    for (let i = DAYS_IN_CHART - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dateKey(d);
      out.push({ key, day: d.getDate(), data: byDate[key] });
    }
    return out;
  }, [days]);

  if (state.status === 'loading') return <div className="container muted">Memuat riwayat…</div>;
  if (state.status === 'error')
    return <div className="container error">Gagal memuat riwayat. Cek koneksi atau aturan Firestore.</div>;
  if (!state.sessions.length)
    return <div className="container muted">Belum ada riwayat. Selesaikan satu sesi latihan dulu.</div>;

  const maxTotal = Math.max(1, ...chart.map((c) => c.data?.total ?? 0));
  const today = days.find((d) => d.date === dateKey());

  return (
    <div className="container">
      <section className="card">
        <h2>Hari ini</h2>
        {today ? (
          <div className="stats">
            <div className="stat-box">
              <span className="muted small">Soal</span>
              <b>{today.total}</b>
            </div>
            <div className="stat-box">
              <span className="muted small">Akurasi</span>
              <b>{formatPct(today.accuracy)}</b>
            </div>
          </div>
        ) : (
          <p className="muted">Belum latihan hari ini.</p>
        )}
      </section>

      <section className="card">
        <h2>14 hari terakhir</h2>
        <div className="chart" role="img" aria-label="Grafik jumlah soal per hari">
          {chart.map((c) => (
            <div className="bar-col" key={c.key} title={c.data ? `${c.data.total} soal, ${formatPct(c.data.accuracy)}` : 'Tidak latihan'}>
              <span className="bar-acc">{c.data ? formatPct(c.data.accuracy) : ''}</span>
              <div
                className={`bar ${c.data ? '' : 'empty'}`}
                style={{ height: `${((c.data?.total ?? 0) / maxTotal) * 100}%` }}
              />
              <span className="bar-label">{c.day}</span>
            </div>
          ))}
        </div>
        <p className="muted small">Tinggi batang = jumlah soal, angka di atas = akurasi.</p>
      </section>

      <section className="card">
        <h2>Per hari</h2>
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Soal</th>
              <th>Akurasi</th>
              <th>Rata-rata</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.date}>
                <td>{formatDateLabel(d.date)}</td>
                <td>{d.total}</td>
                <td>{formatPct(d.accuracy)}</td>
                <td>{formatSec(d.avgMs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>Sesi terakhir</h2>
        {state.sessions.slice(0, 10).map((s) => (
          <div className="miss" key={s.id}>
            <span>
              {s.ops.map((o) => OPS[o]?.symbol).join(' ')} · {s.digitsX}×{s.digitsY} digit
              <br />
              <span className="muted small">
                {new Date(s.startedAt).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </span>
            <span className="right">
              {s.correct}/{s.total}
              <br />
              <span className="muted small">{formatPct(s.accuracy)}</span>
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
