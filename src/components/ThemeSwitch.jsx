import { ACCENTS, MODES } from '../lib/theme';
import { useI18n } from './I18nProvider';
import { useTheme } from './ThemeProvider';

export default function ThemeSwitch() {
  const { t } = useI18n();
  const { accent, mode, setAccent, setMode } = useTheme();

  return (
    <>
      <div className="swatches" role="radiogroup" aria-label={t('theme.color')}>
        {ACCENTS.map((a) => (
          <button
            key={a}
            type="button"
            role="radio"
            aria-checked={accent === a}
            aria-label={t(`theme.${a}`)}
            title={t(`theme.${a}`)}
            data-accent={a}
            className="swatch"
            onClick={() => setAccent(a)}
          />
        ))}
      </div>
      <div className="segmented segmented-3" role="group" aria-label={t('theme.mode')}>
        {MODES.map((m) => (
          <button key={m} type="button" className={mode === m ? 'on' : ''} aria-pressed={mode === m} onClick={() => setMode(m)}>
            {t(`theme.${m}`)}
          </button>
        ))}
      </div>
    </>
  );
}
