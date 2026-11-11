// Keypad angka di layar. Pakai onPointerDown (bukan onClick) supaya
// respon lebih cepat di HP dan tidak memicu zoom saat ketuk dua kali.
import { useI18n } from './I18nProvider';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

export default function Keypad({ onDigit, onBackspace, onClear }) {
  const { t } = useI18n();
  const press = (k) => (e) => {
    e.preventDefault();
    if (k === '⌫') onBackspace();
    else if (k === 'C') onClear();
    else onDigit(k);
  };

  return (
    <div className="keypad" role="group" aria-label={t('keypad.label')}>
      {KEYS.map((k) => (
        <button
          key={k}
          type="button"
          className={k === 'C' || k === '⌫' ? 'fn' : ''}
          aria-label={k === '⌫' ? t('keypad.backspace') : k === 'C' ? t('keypad.clear') : k}
          onPointerDown={press(k)}
        >
          {k}
        </button>
      ))}
    </div>
  );
}
