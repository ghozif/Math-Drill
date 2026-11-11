import { useRef } from 'react';
import { useI18n } from './I18nProvider';
import LanguageSwitch from './LanguageSwitch';

export default function Menu({ email, onSignOut }) {
  const { t } = useI18n();
  const dialogRef = useRef(null);

  const open = () => dialogRef.current.showModal();
  const close = () => dialogRef.current.close();

  const signOut = () => {
    close();
    onSignOut();
  };

  return (
    <>
      <button type="button" className="menu-btn" onClick={open} aria-label={t('menu.open')} aria-haspopup="dialog">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Klik di backdrop mengenai <dialog> itu sendiri, bukan isinya. */}
      <dialog
        ref={dialogRef}
        className="sidebar"
        aria-labelledby="sidebar-title"
        onClick={(e) => e.target === dialogRef.current && close()}
      >
        <div className="sidebar-inner">
          <div className="sidebar-head">
            <span id="sidebar-title" className="brand">
              Math Drill
            </span>
            <button type="button" className="menu-btn" onClick={close} aria-label={t('menu.close')}>
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {email && (
            <p className="sidebar-account">
              <span className="muted small">{t('menu.signedInAs')}</span>
              <br />
              {email}
            </p>
          )}

          <section>
            <h2 className="sidebar-label">{t('language.title')}</h2>
            <LanguageSwitch />
          </section>

          <button type="button" className="btn signout" onClick={signOut}>
            {t('nav.signOut')}
          </button>
        </div>
      </dialog>
    </>
  );
}
