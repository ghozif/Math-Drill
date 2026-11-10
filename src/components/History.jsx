import { useEffect, useMemo, useState } from 'react';
import { OPS } from '../lib/generator';
import { loadSessions } from '../lib/sessions';
import { dateKey, formatPct, groupByDay } from '../lib/stats';
import { useI18n } from './I18nProvider';

const DAYS_IN_CHART = 14;

export default function History({ uid }) {
  const { t, formatSec, formatDateLabel, formatDateTime } = useI18n();
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

  if (state.status === 'loading') return <div className="container muted">{t('history.loading')}</div>;
  if (state.status === 'error') return <div className="container error">{t('history.error')}</div>;
  if (!state.sessions.length) return <div className="container muted">{t('history.empty')}</div>;

  const maxTotal = Math.max(1, ...chart.map((c) => c.data?.total ?? 0));
  const today = days.find((d) => d.date === dateKey());

  return (
    <div className="container">
      <section className="card">
        <h2>{t('history.today')}</h2>
        {today ? (
          <div className="stats">
            <div className="stat-box">
              <span className="muted small">{t('table.problems')}</span>
              <b>{today.total}</b>
            </div>
            <div className="stat-box">
              <span className="muted small">{t('table.accuracy')}</span>
              <b>{formatPct(today.accuracy)}</b>
            </div>
          </div>
        ) : (
          <p className="muted">{t('history.noneToday')}</p>
        )}
      </section>

      <section className="card">
        <h2>{t('history.last14')}</h2>
        <div className="chart" role="img" aria-label={t('history.chartLabel')}>
          {chart.map((c) => (
            <div
              className="bar-col"
              key={c.key}
              title={
                c.data
                  ? `${t('count.problems', { n: c.data.total })}, ${formatPct(c.data.accuracy)}`
                  : t('history.noPractice')
              }
            >
              <span className="bar-acc">{c.data ? formatPct(c.data.accuracy) : ''}</span>
              <div
                className={`bar ${c.data ? '' : 'empty'}`}
                style={{ height: `${((c.data?.total ?? 0) / maxTotal) * 100}%` }}
              />
              <span className="bar-label">{c.day}</span>
            </div>
          ))}
        </div>
        <p className="muted small">{t('history.chartNote')}</p>
      </section>

      <section className="card">
        <h2>{t('history.perDay')}</h2>
        <table>
          <thead>
            <tr>
              <th>{t('table.date')}</th>
              <th>{t('table.problems')}</th>
              <th>{t('table.accuracy')}</th>
              <th>{t('table.average')}</th>
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
        <h2>{t('history.recent')}</h2>
        {state.sessions.slice(0, 10).map((s) => (
          <div className="miss" key={s.id}>
            <span>
              {s.ops.map((o) => OPS[o]?.symbol).join(' ')} · {t('history.digits', { x: s.digitsX, y: s.digitsY })}
              <br />
              <span className="muted small">{formatDateTime(s.startedAt)}</span>
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
