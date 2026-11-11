const KEY = 'drill-hitung:lang';

export const DEFAULT_LANG = 'id';

export const LANGUAGES = {
  id: { name: 'Indonesia', locale: 'id-ID' },
  en: { name: 'English', locale: 'en-US' },
};

export const MESSAGES = {
  id: {
    'app.loading': 'Memuat…',
    'nav.practice': 'Latihan',
    'nav.history': 'Riwayat',
    'nav.signOut': 'Keluar',
    'menu.open': 'Buka menu',
    'menu.close': 'Tutup menu',
    'menu.signedInAs': 'Masuk sebagai',
    'streak.done': 'Streak {n} hari. Sudah latihan hari ini',
    'streak.pending': 'Streak {n} hari. Latihan hari ini supaya streak tidak putus',
    'streak.none': 'Belum ada streak. Latihan hari ini untuk memulai',
    'language.title': 'Bahasa',
    'theme.title': 'Tema',
    'theme.color': 'Warna tema',
    'theme.mode': 'Mode tampilan',
    'theme.auto': 'Otomatis',
    'theme.light': 'Terang',
    'theme.dark': 'Gelap',
    'theme.teal': 'Hijau toska',
    'theme.blue': 'Biru',
    'theme.violet': 'Ungu',
    'theme.rose': 'Merah muda',
    'theme.amber': 'Oranye',

    'ops.add': 'Penjumlahan',
    'ops.sub': 'Pengurangan',
    'ops.mul': 'Perkalian',
    'ops.div': 'Pembagian',

    'errors.noOps': 'Pilih minimal satu operasi.',
    'errors.divDigits': 'Untuk pembagian, digit X harus ≥ digit Y supaya hasilnya bisa bulat.',

    'units.sec': '{n} dtk',
    'units.min': '{n} mnt',
    'count.problems': '{n} soal',

    'table.operation': 'Operasi',
    'table.date': 'Tanggal',
    'table.problems': 'Soal',
    'table.accuracy': 'Akurasi',
    'table.average': 'Rata-rata',

    'home.operations': 'Operasi',
    'home.digits': 'Jumlah digit',
    'home.firstNumber': 'Angka pertama (X)',
    'home.secondNumber': 'Angka kedua (Y)',
    'home.digitsX': 'Digit X',
    'home.digitsY': 'Digit Y',
    'home.session': 'Sesi',
    'home.modeCount': 'Jumlah soal',
    'home.modeTime': 'Waktu',
    'home.customTime': 'Atau isi sendiri (detik)',
    'home.customCount': 'Atau isi sendiri (soal)',
    'home.keypad': 'Keypad angka di layar',
    'home.keypadHint': 'Matikan kalau mau pakai keyboard HP/laptop',
    'home.start': 'Mulai latihan',

    'drill.progress': 'Soal {current}/{target}',
    'drill.keypadOn': 'Keypad: on',
    'drill.keypadOff': 'Keypad: off',
    'drill.finish': 'Selesai',
    'drill.answer': 'Jawaban',
    'drill.wrongHint': 'Salah {n}×, coba lagi',

    'keypad.label': 'Keypad angka',
    'keypad.backspace': 'Hapus satu digit',
    'keypad.clear': 'Kosongkan',

    'result.summary': '{correct} dari {total} soal benar di percobaan pertama',
    'result.avgPerProblem': 'Rata-rata per soal',
    'result.duration': 'Durasi',
    'result.wrongAttempts': 'Total percobaan salah',
    'result.perMinute': 'Soal per menit',
    'result.saving': 'Menyimpan… (kalau offline, otomatis tersinkron saat online)',
    'result.saved': 'Tersimpan ke riwayat ✓',
    'result.saveError': 'Gagal menyimpan ke riwayat.',
    'result.perOperation': 'Per operasi',
    'result.missed': 'Soal yang sempat salah',
    'result.wrongCount': 'salah {n}×',
    'result.back': 'Kembali',
    'result.again': 'Ulangi',

    'history.loading': 'Memuat riwayat…',
    'history.error': 'Gagal memuat riwayat. Cek koneksi atau aturan Firestore.',
    'history.empty': 'Belum ada riwayat. Selesaikan satu sesi latihan dulu.',
    'history.today': 'Hari ini',
    'history.noneToday': 'Belum latihan hari ini.',
    'history.last14': '14 hari terakhir',
    'history.chartLabel': 'Grafik jumlah soal per hari',
    'history.noPractice': 'Tidak latihan',
    'history.chartNote': 'Tinggi batang = jumlah soal, angka di atas = akurasi.',
    'history.perDay': 'Per hari',
    'history.recent': 'Sesi terakhir',
    'history.digits': '{x}×{y} digit',
    'history.trend': 'Tren per operasi',
    'history.speed': 'Kecepatan (rata-rata per soal)',
    'history.speedNote': 'Makin rendah makin cepat. Ketuk grafik untuk melihat angkanya.',
    'history.accuracyTrend': 'Akurasi (benar di percobaan pertama)',
    'history.noTrend': 'Belum ada latihan dalam 14 hari terakhir.',

    'chart.timePerProblem': 'Waktu per soal',
    'chart.problemN': 'Soal {n}',
    'chart.missed': 'Salah di percobaan pertama',

    'login.tagline': 'Latihan hitung cepat: +, −, ×, ÷',
    'login.google': 'Masuk dengan Google',
    'login.orEmail': 'atau pakai email',
    'login.email': 'Email',
    'login.password': 'Password (min. 6 karakter)',
    'login.submit': 'Masuk',
    'login.register': 'Daftar',
    'login.toRegister': 'Belum punya akun? Daftar',
    'login.toLogin': 'Sudah punya akun? Masuk',
    'login.forgot': 'Lupa password',
    'login.resetSent': 'Link reset password sudah dikirim ke email kamu.',
    'login.errUnknown': 'Terjadi kesalahan ({code}).',

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
  },

  en: {
    'app.loading': 'Loading…',
    'nav.practice': 'Practice',
    'nav.history': 'History',
    'nav.signOut': 'Log out',
    'menu.open': 'Open menu',
    'menu.close': 'Close menu',
    'menu.signedInAs': 'Signed in as',
    'streak.done': ({ n }) => `${n}-day streak. You've practiced today`,
    'streak.pending': ({ n }) => `${n}-day streak. Practice today to keep it going`,
    'streak.none': 'No streak yet. Practice today to start one',
    'language.title': 'Language',
    'theme.title': 'Theme',
    'theme.color': 'Theme color',
    'theme.mode': 'Display mode',
    'theme.auto': 'Auto',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.teal': 'Teal',
    'theme.blue': 'Blue',
    'theme.violet': 'Purple',
    'theme.rose': 'Pink',
    'theme.amber': 'Orange',

    'ops.add': 'Addition',
    'ops.sub': 'Subtraction',
    'ops.mul': 'Multiplication',
    'ops.div': 'Division',

    'errors.noOps': 'Select at least one operation.',
    'errors.divDigits': 'For division, X must have at least as many digits as Y so the result can be a whole number.',

    'units.sec': '{n} sec',
    'units.min': '{n} min',
    'count.problems': ({ n }) => `${n} ${n === 1 ? 'problem' : 'problems'}`,

    'table.operation': 'Operation',
    'table.date': 'Date',
    'table.problems': 'Problems',
    'table.accuracy': 'Accuracy',
    'table.average': 'Average',

    'home.operations': 'Operations',
    'home.digits': 'Number of digits',
    'home.firstNumber': 'First number (X)',
    'home.secondNumber': 'Second number (Y)',
    'home.digitsX': 'X digits',
    'home.digitsY': 'Y digits',
    'home.session': 'Session',
    'home.modeCount': 'Problem count',
    'home.modeTime': 'Time',
    'home.customTime': 'Or enter your own (seconds)',
    'home.customCount': 'Or enter your own (problems)',
    'home.keypad': 'On-screen number keypad',
    'home.keypadHint': 'Turn off to use your phone or laptop keyboard',
    'home.start': 'Start practice',

    'drill.progress': '{current}/{target}',
    'drill.keypadOn': 'Keypad: on',
    'drill.keypadOff': 'Keypad: off',
    'drill.finish': 'Finish',
    'drill.answer': 'Answer',
    'drill.wrongHint': 'Wrong {n}×, try again',

    'keypad.label': 'Number keypad',
    'keypad.backspace': 'Delete one digit',
    'keypad.clear': 'Clear',

    'result.summary': '{correct} of {total} correct on the first try',
    'result.avgPerProblem': 'Average per problem',
    'result.duration': 'Duration',
    'result.wrongAttempts': 'Total wrong attempts',
    'result.perMinute': 'Problems per minute',
    'result.saving': 'Saving… (if offline, it syncs automatically once online)',
    'result.saved': 'Saved to history ✓',
    'result.saveError': 'Failed to save to history.',
    'result.perOperation': 'By operation',
    'result.missed': 'Problems you got wrong at first',
    'result.wrongCount': 'wrong {n}×',
    'result.back': 'Back',
    'result.again': 'Go again',

    'history.loading': 'Loading history…',
    'history.error': 'Failed to load history. Check your connection or Firestore rules.',
    'history.empty': 'No history yet. Finish a practice session first.',
    'history.today': 'Today',
    'history.noneToday': 'No practice yet today.',
    'history.last14': 'Last 14 days',
    'history.chartLabel': 'Chart of problems per day',
    'history.noPractice': 'No practice',
    'history.chartNote': 'Bar height = number of problems, number on top = accuracy.',
    'history.perDay': 'By day',
    'history.recent': 'Recent sessions',
    'history.digits': '{x}×{y}-digit',
    'history.trend': 'Trend by operation',
    'history.speed': 'Speed (average per problem)',
    'history.speedNote': 'Lower is faster. Tap the chart to see the numbers.',
    'history.accuracyTrend': 'Accuracy (correct on the first try)',
    'history.noTrend': 'No practice in the last 14 days.',

    'chart.timePerProblem': 'Time per problem',
    'chart.problemN': 'Problem {n}',
    'chart.missed': 'Wrong on the first try',

    'login.tagline': 'Fast arithmetic practice: +, −, ×, ÷',
    'login.google': 'Log in with Google',
    'login.orEmail': 'or use email',
    'login.email': 'Email',
    'login.password': 'Password (min. 6 characters)',
    'login.submit': 'Log in',
    'login.register': 'Sign up',
    'login.toRegister': 'No account yet? Sign up',
    'login.toLogin': 'Already have an account? Log in',
    'login.forgot': 'Forgot password',
    'login.resetSent': 'A password reset link has been sent to your email.',
    'login.errUnknown': 'Something went wrong ({code}).',

    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/user-not-found': 'No account is registered with this email.',
    'auth/email-already-in-use': 'This email is already registered. Please log in.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Invalid email format.',
    'auth/missing-email': 'Enter your email first.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'No internet connection.',
    'auth/unauthorized-domain': 'This domain is not yet allowed in Firebase Auth (Authorized domains).',
  },
};

export function createI18n(lang) {
  const { locale } = LANGUAGES[lang];

  const t = (key, params = {}) => {
    const message = MESSAGES[lang][key] ?? key;
    if (typeof message === 'function') return message(params);
    return message.replace(/\{(\w+)\}/g, (match, name) => params[name] ?? match);
  };

  return {
    lang,
    t,
    has: (key) => key in MESSAGES[lang],
    formatSec: (ms) => t('units.sec', { n: (ms / 1000).toLocaleString(locale, { maximumFractionDigits: 1 }) }),
    formatDateLabel: (key) => {
      const [y, m, d] = key.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
    },
    formatDateTime: (timestamp) =>
      new Date(timestamp).toLocaleString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
  };
}

export function loadLang() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved in LANGUAGES ? saved : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

export function saveLang(lang) {
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    /* mode private / storage diblokir: abaikan */
  }
}
