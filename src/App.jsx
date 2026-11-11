import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { loadSettings, saveSettings } from './lib/settings';
import { dateKey } from './lib/stats';
import { loadPracticeDays, saveSession } from './lib/sessions';
import Login from './components/Login';
import Home from './components/Home';
import Drill from './components/Drill';
import Result from './components/Result';
import History from './components/History';
import Menu from './components/Menu';
import StreakBadge from './components/StreakBadge';
import { useI18n } from './components/I18nProvider';

export default function App() {
  const { t } = useI18n();
  const [user, setUser] = useState(undefined); 
  const [screen, setScreen] = useState('home');
  const [settings, setSettings] = useState(loadSettings);
  const [result, setResult] = useState(null);
  const [drillId, setDrillId] = useState(0);
  const [practiceDays, setPracticeDays] = useState(null);

  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u)), []);
  useEffect(() => saveSettings(settings), [settings]);

  useEffect(() => {
    setPracticeDays(null);
    if (!user) return;
    let alive = true;
    loadPracticeDays(user.uid)
      .then((days) => alive && setPracticeDays((prev) => (prev ? new Set([...days, ...prev]) : days)))
      .catch((e) => console.error(e));
    return () => {
      alive = false;
    };
  }, [user]);

  const start = () => {
    setDrillId((n) => n + 1);
    setScreen('drill');
  };

  const finish = useCallback(
    async (session) => {
      if (!session.summary.total) {
        setScreen('home');
        return;
      }
      // Langsung dihitung tanpa menunggu Firestore, karena saat offline simpanan baru selesai setelah online.
      setPracticeDays((prev) => new Set(prev).add(dateKey(new Date(session.startedAt))));
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

  if (user === undefined) return <div className="center muted">{t('app.loading')}</div>;
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
            {t('nav.practice')}
          </button>
          <button type="button" className={screen === 'history' ? 'active' : ''} onClick={() => setScreen('history')}>
            {t('nav.history')}
          </button>
        </nav>
        <StreakBadge days={practiceDays} />
        <Menu email={user.email} onSignOut={() => signOut(auth)} />
      </header>

      {screen === 'home' && <Home settings={settings} setSettings={setSettings} onStart={start} />}
      {screen === 'result' && result && <Result result={result} onAgain={start} onHome={() => setScreen('home')} />}
      {screen === 'history' && <History uid={user.uid} />}
    </>
  );
}
