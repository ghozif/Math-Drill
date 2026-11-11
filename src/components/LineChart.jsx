import { useEffect, useRef, useState } from 'react';

const HEIGHT = 190;
const PAD = { top: 12, right: 24, bottom: 24, left: 48 };

// Kelipatan genap supaya label tengah (top / 2) juga angka bulat.
function niceMax(v) {
  if (!(v > 0)) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 2, 4, 6, 8]) if (m * p >= v) return m * p;
  return 10 * p;
}

// series: [{ key, label, symbol, color, points: [{ v, hollow? } | null] }], satu titik per xLabels.
export default function LineChart({
  series,
  xLabels,
  xTick,
  formatY,
  yMax,
  minTop = 0,
  connectNulls = false,
  label,
  missedLabel,
  showLegend = true,
}) {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const [width, setWidth] = useState(320);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(240, Math.round(entry.contentRect.width))));
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Di layar sentuh tidak ada pointerleave yang berguna, jadi tooltip ditutup saat mengetuk di luar chart.
  useEffect(() => {
    if (active === null) return;
    const onDown = (e) => !wrapRef.current?.contains(e.target) && setActive(null);
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [active]);

  const n = xLabels.length;
  const values = series.flatMap((s) => s.points.map((p) => p?.v)).filter((v) => v != null);
  const top = yMax ?? niceMax(Math.max(minTop, Math.max(0, ...values) * 1.1));
  const plotW = width - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (n === 1 ? plotW / 2 : (i * plotW) / (n - 1));
  const y = (v) => PAD.top + plotH - (v / top) * plotH;

  const niceStep = (raw) => [1, 2, 5, 10, 20, 25, 50, 100].find((s) => s >= raw) ?? Math.ceil(raw / 100) * 100;
  // Step >= 5 ditaruh di kelipatan nomor (1, 10, 20, ...), bukan di indeks (1, 11, 21, ...).
  const onStep = (i, step) => (step < 5 ? i % step === 0 : i === 0 || (i + 1) % step === 0);
  const gridStep = n <= 31 ? 1 : niceStep(n / 15);
  const labelStep = niceStep(n / Math.max(1, Math.floor(plotW / 28)));
  const showAllMarkers = n <= 40;
  const hasMissed = series.some((s) => s.points.some((p) => p?.hollow));

  const pathOf = (points) => {
    let d = '';
    let penDown = false;
    points.forEach((p, i) => {
      if (p?.v == null) {
        if (!connectNulls) penDown = false;
        return;
      }
      d += `${penDown ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`;
      penDown = true;
    });
    return d;
  };

  // Simbol operasi di kolom kanan, setinggi nilai terakhir garisnya. Yang bertabrakan dilewati;
  // legend tetap jadi acuan utama.
  const endLabels = [];
  if (series.length > 1) {
    const ends = series
      .map((s) => {
        let i = s.points.length - 1;
        while (i >= 0 && s.points[i]?.v == null) i--;
        return i < 0 ? null : { key: s.key, symbol: s.symbol, y: y(s.points[i].v) };
      })
      .filter(Boolean)
      .sort((a, b) => a.y - b.y);
    for (const e of ends) if (endLabels.every((k) => Math.abs(k.y - e.y) >= 13)) endLabels.push(e);
  }

  const indexAt = (clientX) => {
    if (n === 1) return 0;
    const px = clientX - svgRef.current.getBoundingClientRect().left;
    return Math.min(n - 1, Math.max(0, Math.round(((px - PAD.left) / plotW) * (n - 1))));
  };

  const onKeyDown = (e) => {
    const moves = { ArrowLeft: -1, ArrowRight: 1 };
    if (e.key in moves) {
      e.preventDefault();
      setActive((a) => Math.min(n - 1, Math.max(0, (a ?? n - 1) + moves[e.key])));
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      setActive(e.key === 'Home' ? 0 : n - 1);
    } else if (e.key === 'Escape') {
      setActive(null);
    }
  };

  const rows =
    active === null
      ? []
      : series.filter((s) => s.points[active]?.v != null).map((s) => ({ s, p: s.points[active] }));
  const tipLeft = active === null ? 0 : Math.min(width - 84, Math.max(84, x(active)));

  return (
    <div className="line-chart" ref={wrapRef}>
      {showLegend && (series.length > 1 || hasMissed) && (
        <ul className="chart-legend">
          {series.length > 1 &&
            series.map((s) => (
              <li key={s.key}>
                <svg width="18" height="10" aria-hidden="true">
                  <line x1="1" y1="5" x2="17" y2="5" stroke={s.color} strokeWidth="2" strokeLinecap="round" />
                  <circle cx="9" cy="5" r="3" fill={s.color} />
                </svg>
                {s.label}
              </li>
            ))}
          {hasMissed && (
            <li>
              <svg width="18" height="10" aria-hidden="true">
                <circle cx="9" cy="5" r="3.5" fill="var(--surface)" stroke="var(--muted)" strokeWidth="2" />
              </svg>
              {missedLabel}
            </li>
          )}
        </ul>
      )}

      <div
        className="chart-plot"
        role="group"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={() => setActive((a) => a ?? n - 1)}
        onBlur={() => setActive(null)}
      >
        <svg
          ref={svgRef}
          width={width}
          height={HEIGHT}
          aria-hidden="true"
          onPointerDown={(e) => setActive(indexAt(e.clientX))}
          onPointerMove={(e) => setActive(indexAt(e.clientX))}
          onPointerLeave={(e) => e.pointerType === 'mouse' && setActive(null)}
        >
          {xLabels.map((_, i) =>
            onStep(i, gridStep) ? (
              <line key={`g${i}`} className="chart-grid" x1={x(i)} x2={x(i)} y1={PAD.top} y2={PAD.top + plotH} />
            ) : null,
          )}
          {[0, top / 2, top].map((v, i) => (
            <g key={`y${i}`}>
              <line
                className={i === 0 ? 'chart-axis' : 'chart-grid'}
                x1={PAD.left}
                x2={PAD.left + plotW}
                y1={y(v)}
                y2={y(v)}
              />
              <text className="chart-tick" x={PAD.left - 8} y={y(v) + 4} textAnchor="end">
                {formatY(v)}
              </text>
            </g>
          ))}
          {xLabels.map((_, i) =>
            onStep(i, labelStep) ? (
              <text key={`x${i}`} className="chart-tick" x={x(i)} y={HEIGHT - 6} textAnchor="middle">
                {xTick(i)}
              </text>
            ) : null,
          )}

          {active !== null && (
            <line className="chart-crosshair" x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + plotH} />
          )}

          {series.map((s) => (
            <path
              key={s.key}
              d={pathOf(s.points)}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}

          {series.map((s) =>
            s.points.map((p, i) => {
              if (p?.v == null || (!showAllMarkers && !p.hollow && i !== active)) return null;
              const r = i === active ? 5.5 : 4;
              return p.hollow ? (
                <circle key={`${s.key}${i}`} cx={x(i)} cy={y(p.v)} r={r} fill="var(--surface)" stroke={s.color} strokeWidth="2.5" />
              ) : (
                <circle key={`${s.key}${i}`} cx={x(i)} cy={y(p.v)} r={r} fill={s.color} stroke="var(--surface)" strokeWidth="2" />
              );
            }),
          )}

          {endLabels.map((e) => (
            <text key={`e${e.key}`} className="chart-end" x={PAD.left + plotW + 10} y={e.y + 5}>
              {e.symbol}
            </text>
          ))}
        </svg>

        {active !== null && rows.length > 0 && (
          <div className="chart-tip" style={{ left: tipLeft }}>
            <div className="chart-tip-head">{xLabels[active]}</div>
            {rows.map(({ s, p }) => (
              <div key={s.key} className="chart-tip-row">
                <svg width="12" height="10" aria-hidden="true">
                  <line x1="1" y1="5" x2="11" y2="5" stroke={s.color} strokeWidth="2" strokeLinecap="round" />
                </svg>
                <b>{formatY(p.v)}</b>
                <span>
                  {s.label}
                  {p.hollow ? ` · ${missedLabel}` : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {active !== null &&
          `${xLabels[active]}: ${rows.map(({ s, p }) => `${s.label} ${formatY(p.v)}${p.hollow ? `, ${missedLabel}` : ''}`).join('; ')}`}
      </p>

      {/* sr-only di <div>, karena <table> tetap selebar isinya walau width: 1px. */}
      <div className="sr-only">
      <table>
        <caption>{label}</caption>
        <thead>
          <tr>
            <td />
            {series.map((s) => (
              <th key={s.key} scope="col">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {xLabels.map((xl, i) => (
            <tr key={i}>
              <th scope="row">{xl}</th>
              {series.map((s) => {
                const p = s.points[i];
                return (
                  <td key={s.key}>
                    {p?.v != null ? formatY(p.v) : ''}
                    {p?.hollow ? ` (${missedLabel})` : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
