import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const MESSAGES = {
  'auth/invalid-credential': 'Email atau password salah.',
  'auth/wrong-password': 'Email atau password salah.',
  'auth/user-not-found': 'Akun dengan email ini belum terdaftar.',
  'auth/email-already-in-use': 'Email sudah terdaftar. Silakan masuk.',
  'auth/weak-password': 'Password minimal 6 karakter.',
  'auth/invalid-email': 'Format email tidak valid.',
  'auth/missing-email': 'Isi email dulu.',
  'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi beberapa saat lagi.',
  'auth/network-request-failed': 'Tidak ada koneksi internet.',
  'auth/unauthorized-domain': 'Domain ini belum diizinkan di Firebase Auth (Authorized domains).',
};

const errText = (e) => MESSAGES[e?.code] ?? `Terjadi kesalahan (${e?.code ?? 'unknown'}).`;

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null); // { type: 'error' | 'info', text }
  const [busy, setBusy] = useState(false);

  const google = async () => {
    setMsg(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      // Popup diblokir (sering di Safari/PWA iOS) -> pakai redirect.
      if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') {
        await signInWithRedirect(auth, googleProvider);
      } else if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
        setMsg({ type: 'error', text: errText(e) });
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
      setMsg({ type: 'error', text: errText(err) });
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    setMsg(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMsg({ type: 'info', text: 'Link reset password sudah dikirim ke email kamu.' });
    } catch (err) {
      setMsg({ type: 'error', text: errText(err) });
    }
  };

  return (
    <div className="login">
      <div className="card">
        <h1 className="title">Math Drill</h1>
        <p className="muted">Latihan hitung cepat: +, −, ×, ÷</p>

        <button type="button" className="btn secondary google-btn" onClick={google}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
          </svg>
          Masuk dengan Google
        </button>

        <div className="divider">atau pakai email</div>

        <form className="stack" onSubmit={submit}>
          <input type="email" placeholder="Email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            type="password"
            placeholder="Password (min. 6 karakter)"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn" disabled={busy}>
            {mode === 'login' ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        {msg && <p className={msg.type === 'error' ? 'error' : 'muted small'}>{msg.text}</p>}

        <div className="login-links">
          <button type="button" className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
          </button>
          {mode === 'login' && (
            <button type="button" className="link" onClick={reset}>
              Lupa password
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
