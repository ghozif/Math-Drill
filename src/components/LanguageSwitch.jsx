import { LANGUAGES } from '../lib/i18n';
import { useI18n } from './I18nProvider';

export default function LanguageSwitch() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="segmented language-switch" role="group" aria-label={t('language.title')}>
      {Object.entries(LANGUAGES).map(([code, { name }]) => (
        <button
          key={code}
          type="button"
          lang={code}
          className={lang === code ? 'on' : ''}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
