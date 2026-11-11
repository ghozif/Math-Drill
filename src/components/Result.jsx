import { OPS } from '../lib/generator';
import { formatClock, formatPct } from '../lib/stats';
import { useI18n } from './I18nProvider';

const SAVE_TEXT = {
  saving: 'result.saving',
  saved: 'result.saved',
  error: 'result.saveError',
};

export default function Result({ result, onAgain, onHome }) {
  const { t, formatSec } = useI18n();
  const { summary, records, durationMs, saveState } = result;
  const missed = records.filter((r) => !r.firstTry);

  return (
    <div className="container">
      <section className="card">
        <div className="big">{formatPct(summary.accuracy)}</div>
        <p className="center-text muted">{t('result.summary', { correct: summary.correct, total: summary.total })}</p>
        <div className="stats">
          <div className="stat-box">
            <span className="muted small">{t('result.avgPerProblem')}</span>
            <b>{formatSec(summary.avgMs)}</b>
          </div>
          <div className="stat-box">
            <span className="muted small">{t('result.duration')}</span>
            <b>{formatClock(durationMs / 1000)}</b>
          </div>
          <div className="stat-box">
            <span className="muted small">{t('result.wrongAttempts')}</span>
            <b>{summary.wrongAttempts}</b>
          </div>
          <div className="stat-box">
            <span className="muted small">{t('result.perMinute')}</span>
            <b>{durationMs ? ((summary.total / durationMs) * 60000).toFixed(1) : 0}</b>
          </div>
        </div>
        <p className={`small ${saveState === 'error' ? 'error' : 'muted'}`}>{t(SAVE_TEXT[saveState])}</p>
      </section>

      {Object.keys(summary.perOp).length > 1 && (
        <section className="card">
          <h2>{t('result.perOperation')}</h2>
          <table>
            <thead>
              <tr>
                <th>{t('table.operation')}</th>
                <th>{t('table.problems')}</th>
                <th>{t('table.accuracy')}</th>
                <th>{t('table.average')}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary.perOp).map(([op, o]) => (
                <tr key={op}>
                  <td>
                    {OPS[op].symbol} {t(`ops.${op}`)}
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
          <h2>{t('result.missed')}</h2>
          {missed.map((r, i) => (
            <div className="miss" key={i}>
              <span>
                {r.x} {OPS[r.op].symbol} {r.y} = <b>{r.answer}</b>
              </span>
              <span className="muted small">{t('result.wrongCount', { n: r.wrongAttempts })}</span>
            </div>
          ))}
        </section>
      )}

      <div className="btn-row">
        <button type="button" className="btn secondary" onClick={onHome}>
          {t('result.back')}
        </button>
        <button type="button" className="btn" onClick={onAgain}>
          {t('result.again')}
        </button>
      </div>
    </div>
  );
}
