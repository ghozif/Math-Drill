import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useI18n } from './I18nProvider';
import LanguageSwitch from './LanguageSwitch';

export default function Login() {
  const { lang, t, has } = useI18n();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Simpan kode, bukan teks, supaya pesan ikut berganti saat bahasa diganti.
  const [msg, setMsg] = useState(null); // { type: 'error', code } | { type: 'info', key }
  const [busy, setBusy] = useState(false);

  // Bahasa halaman login Google dan email reset password dari Firebase.
  useEffect(() => {
    auth.languageCode = lang;
  }, [lang]);

  const errMsg = (e) => ({ type: 'error', code: e?.code ?? 'unknown' });
  const msgText = (m) => {
    if (m.type === 'info') return t(m.key);
    return has(m.code) ? t(m.code) : t('login.errUnknown', { code: m.code });
  };

  const google = async () => {
    setMsg(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      // Popup diblokir (sering di Safari/PWA iOS) -> pakai redirect.
      if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') {
        await signInWithRedirect(auth, googleProvider);
      } else if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
        setMsg(errMsg(e));
      }
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === 'login') await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setMsg(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    setMsg(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMsg({ type: 'info', key: 'login.resetSent' });
    } catch (err) {
      setMsg(errMsg(err));
    }
  };

  return (
    <div className="login">
      <div className="card">
        <h1 className="title">Math Drill</h1>
        <p className="muted">{t('login.tagline')}</p>

        <button type="button" className="btn secondary google-btn" onClick={google}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
          </svg>
          {t('login.google')}
        </button>

        <div className="divider">{t('login.orEmail')}</div>

        <form className="stack" onSubmit={submit}>
          <input type="email" placeholder={t('login.email')} autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            type="password"
            placeholder={t('login.password')}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn" disabled={busy}>
            {mode === 'login' ? t('login.submit') : t('login.register')}
          </button>
        </form>

        {msg && <p className={msg.type === 'error' ? 'error' : 'muted small'}>{msgText(msg)}</p>}

        <div className="login-links">
          <button type="button" className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? t('login.toRegister') : t('login.toLogin')}
          </button>
          {mode === 'login' && (
            <button type="button" className="link" onClick={reset}>
              {t('login.forgot')}
            </button>
          )}
        </div>

        <LanguageSwitch />
      </div>
    </div>
  );
}
