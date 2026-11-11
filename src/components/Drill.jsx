import { useCallback, useEffect, useRef, useState } from 'react';
import { OPS, generateProblem } from '../lib/generator';
import { formatClock, summarize } from '../lib/stats';
import { useI18n } from './I18nProvider';
import Keypad from './Keypad';

export default function Drill({ settings, onFinish, onToggleKeypad }) {
  const { t } = useI18n();
  const [problem, setProblem] = useState(() => generateProblem(settings));
  const [input, setInputState] = useState('');
  const [records, setRecords] = useState([]);
  const [wrongNow, setWrongNow] = useState(0); // salah berapa kali di soal ini
  const [flash, setFlash] = useState(null); // 'right' | 'wrong' | null
  const [now, setNow] = useState(() => Date.now());

  const startRef = useRef(Date.now());
  const problemStartRef = useRef(performance.now());
  const recordsRef = useRef([]);
  const inputRef = useRef('');
  const finishedRef = useRef(false);
  const flashTimer = useRef(null);
  const fieldRef = useRef(null);

  // Simpan input di state (untuk tampilan) dan di ref (untuk event yang datang beruntun).
  const setInput = (v) => {
    inputRef.current = v;
    setInputState(v);
  };

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const recs = recordsRef.current;
    onFinish({
      settings: {
        ops: settings.ops,
        digitsX: settings.digitsX,
        digitsY: settings.digitsY,
        mode: settings.mode,
        target: settings.target,
      },
      records: recs,
      summary: summarize(recs),
      durationMs: Date.now() - startRef.current,
      startedAt: startRef.current,
    });
  }, [settings, onFinish]);

  // Jam: update 4x per detik untuk timer & progress bar.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  const elapsedSec = (now - startRef.current) / 1000;

  // Mode waktu: selesai otomatis saat waktu habis.
  useEffect(() => {
    if (settings.mode === 'time' && elapsedSec >= settings.target) finish();
  }, [elapsedSec, settings.mode, settings.target, finish]);

  const showFlash = (kind) => {
    clearTimeout(flashTimer.current);
    setFlash(kind);
    flashTimer.current = setTimeout(() => setFlash(null), kind === 'wrong' ? 400 : 160);
  };

  // Inti logika jawaban:
  // - sama persis dengan jawaban  -> benar, catat, lanjut soal berikut
  // - jumlah digit sudah >= jawaban tapi beda -> salah, kosongkan, ulang soal yang sama
  // - selain itu -> tunggu digit berikutnya
  const submitValue = (raw) => {
    if (finishedRef.current) return;
    const next = raw.replace(/\D/g, '');
    const ans = String(problem.answer);

    if (next === ans) {
      const rec = {
        op: problem.op,
        x: problem.x,
        y: problem.y,
        answer: problem.answer,
        firstTry: wrongNow === 0,
        wrongAttempts: wrongNow,
        timeMs: Math.round(performance.now() - problemStartRef.current),
      };
      const all = [...recordsRef.current, rec];
      recordsRef.current = all;
      setRecords(all);
      setInput('');
      setWrongNow(0);
      problemStartRef.current = performance.now();
      showFlash('right');

      if (settings.mode === 'count' && all.length >= settings.target) {
        finish();
        return;
      }
      setProblem((p) => generateProblem(settings, p));
    } else if (next.length >= ans.length) {
      setWrongNow((w) => w + 1);
      setInput('');
      showFlash('wrong');
      navigator.vibrate?.(60);
    } else {
      setInput(next);
    }
  };

  // Ref ke handler terbaru supaya listener keyboard tidak memakai data basi.
  const submitRef = useRef(submitValue);
  submitRef.current = submitValue;
  const finishRef = useRef(finish);
  finishRef.current = finish;

  // Keyboard fisik (laptop) saat keypad layar aktif.
  useEffect(() => {
    if (!settings.keypad) return;
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        submitRef.current(inputRef.current + e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        setInput(inputRef.current.slice(0, -1));
      } else if (e.key === 'Escape') {
        finishRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [settings.keypad]);

  // Saat keypad dimatikan, fokus ke input supaya keyboard angka bawaan HP muncul.
  useEffect(() => {
    if (!settings.keypad) fieldRef.current?.focus();
  }, [settings.keypad, problem]);

  const correct = records.filter((r) => r.firstTry).length;
  const progress =
    settings.mode === 'count'
      ? records.length / settings.target
      : Math.min(1, elapsedSec / settings.target);

  return (
    <div className="drill">
      <div className="drill-top">
        <span className="stat">
          {settings.mode === 'count'
            ? t('drill.progress', { current: Math.min(records.length + 1, settings.target), target: settings.target })
            : formatClock(settings.target - elapsedSec)}
        </span>
        <span className="muted small">✓ {correct}</span>
        {settings.mode === 'count' && <span className="muted small">{formatClock(elapsedSec)}</span>}
        <span className="spacer" />
        <button type="button" className="icon-btn" onClick={onToggleKeypad} aria-pressed={settings.keypad}>
          {settings.keypad ? t('drill.keypadOn') : t('drill.keypadOff')}
        </button>
        <button type="button" className="icon-btn" onClick={finish}>
          {t('drill.finish')}
        </button>
      </div>
      <div className="progress">
        <div style={{ width: `${progress * 100}%` }} />
      </div>

      <div className={`stage ${flash ?? ''}`} onClick={() => !settings.keypad && fieldRef.current?.focus()}>
        <div className="expr">
          {problem.x} {OPS[problem.op].symbol} {problem.y} =
        </div>

        {settings.keypad ? (
          <div className="answer" aria-live="polite">
            {input || ' '}
          </div>
        ) : (
          <input
            ref={fieldRef}
            className="answer answer-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            autoFocus
            value={input}
            onChange={(e) => submitRef.current(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && finish()}
            aria-label={t('drill.answer')}
          />
        )}

        <div className="hint">{wrongNow > 0 ? t('drill.wrongHint', { n: wrongNow }) : ' '}</div>
      </div>

      {settings.keypad && (
        <Keypad
          onDigit={(d) => submitRef.current(inputRef.current + d)}
          onBackspace={() => setInput(inputRef.current.slice(0, -1))}
          onClear={() => setInput('')}
        />
      )}
    </div>
  );
}
