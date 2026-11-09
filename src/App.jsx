import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { loadSettings, saveSettings } from './lib/settings';
import { saveSession } from './lib/sessions';
import Login from './components/Login';
import Home from './components/Home';
import Drill from './components/Drill';
import Result from './components/Result';
import History from './components/History';

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = masih cek status login
  const [screen, setScreen] = useState('home'); // home | drill | result | history
  const [settings, setSettings] = useState(loadSettings);
  const [result, setResult] = useState(null);
  const [drillId, setDrillId] = useState(0); // ganti key -> Drill mulai dari nol

  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u)), []);
  useEffect(() => saveSettings(settings), [settings]);

  const start = () => {
    setDrillId((n) => n + 1);
    setScreen('drill');
  };

  const finish = useCallback(
    async (session) => {
      if (!session.summary.total) {
        setScreen('home'); // berhenti sebelum menjawab satu soal pun
        return;
      }
      setResult({ ...session, saveState: 'saving' });
      setScreen('result');
      try {
        await saveSession(user.uid, session);
        setResult((r) => ({ ...r, saveState: 'saved' }));
      } catch (e) {
        console.error(e);
        setResult((r) => ({ ...r, saveState: 'error' }));
      }
    },
    [user],
  );

  if (user === undefined) return <div className="center muted">Memuat…</div>;
  if (!user) return <Login />;

  if (screen === 'drill') {
    return (
      <Drill
        key={drillId}
        settings={settings}
        onFinish={finish}
        onToggleKeypad={() => setSettings((s) => ({ ...s, keypad: !s.keypad }))}
      />
    );
  }

  return (
    <>
      <header className="top">
        <span className="brand">Math Drill</span>
        <nav className="nav">
          <button type="button" className={screen !== 'history' ? 'active' : ''} onClick={() => setScreen('home')}>
            Latihan
          </button>
          <button type="button" className={screen === 'history' ? 'active' : ''} onClick={() => setScreen('history')}>
            Riwayat
          </button>
        </nav>
        <button type="button" className="icon-btn" onClick={() => signOut(auth)} title={user.email ?? ''}>
          Keluar
        </button>
      </header>

      {screen === 'home' && <Home settings={settings} setSettings={setSettings} onStart={start} />}
      {screen === 'result' && result && <Result result={result} onAgain={start} onHome={() => setScreen('home')} />}
      {screen === 'history' && <History uid={user.uid} />}
    </>
  );
}
