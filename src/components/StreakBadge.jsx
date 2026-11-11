import { computeStreak } from '../lib/streak';
import { useI18n } from './I18nProvider';

export default function StreakBadge({ days }) {
  const { t } = useI18n();
  if (!days) return null;

  const { current, doneToday } = computeStreak(days);
  const label = t(current === 0 ? 'streak.none' : doneToday ? 'streak.done' : 'streak.pending', { n: current });

  return (
    <span className={`streak${doneToday ? ' is-lit' : ''}`} role="img" aria-label={label} title={label}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2.5c.6 3.2-1 5-2.6 6.9C7.8 11.2 6.5 13 6.5 15.5A5.5 5.5 0 0 0 12 21a5.5 5.5 0 0 0 5.5-5.5c0-2.3-1-4-2.2-5.4-.3 1.3-1 2.3-2 2.8.6-3.6-.2-7.3-1.3-10.4z"
          fill="currentColor"
        />
      </svg>
      <span className="streak-n">{current}</span>
    </span>
  );
}
