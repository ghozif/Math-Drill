import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createI18n, loadLang, saveLang } from '../lib/i18n';

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(loadLang);

  useEffect(() => {
    saveLang(lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ ...createI18n(lang), setLang }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
