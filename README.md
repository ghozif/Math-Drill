# Math Drill

Web app latihan hitung cepat (+ − × ÷) dengan login dan riwayat harian.
Stack: React (Vite) + Firebase Auth + Firestore, dibuat sebagai PWA supaya bisa di-install ke home screen iPhone/Android.

## Fitur
- Pilih operasi (boleh campur), jumlah digit X dan Y (1–5 digit)
- Pengurangan tidak pernah negatif, pembagian selalu bulat
- Mode sesi: jumlah soal atau waktu
- Jawaban lanjut otomatis kalau benar; kalau jumlah digit sudah pas tapi salah → dikosongkan, ulangi soal yang sama
- Akurasi dihitung dari percobaan pertama
- Keypad angka di layar (bisa dimatikan), keyboard fisik juga bisa
- Login Google atau email/password, riwayat per hari + grafik 14 hari

## Struktur folder
```
src/
  firebase.js            koneksi Firebase (config dari .env)
  App.jsx                status login + perpindahan layar
  lib/generator.js       pembuat soal (aturan tanpa negatif / bagi bulat)
  lib/stats.js           ringkasan sesi, grup per hari, format angka
  lib/settings.js        setting default + simpan di localStorage
  lib/sessions.js        simpan/ambil riwayat di Firestore
  components/            Login, Home (setting), Drill, Keypad, Result, History
tests/generator.test.js  uji 174.000 soal acak
firestore.rules          aturan keamanan database
```

## Setup (sekali saja)

### 1. Buat project Firebase
1. Buka https://console.firebase.google.com → **Add project** (Google Analytics boleh dimatikan).
2. Paket **Spark (gratis)** sudah cukup, tidak perlu kartu kredit.

### 2. Aktifkan login
1. Menu **Build → Authentication → Get started**.
2. Tab **Sign-in method**: aktifkan **Google** dan **Email/Password**.

### 3. Buat database
1. Menu **Build → Firestore Database → Create database**.
2. Pilih lokasi **asia-southeast2 (Jakarta)**, mode **production**.

### 4. Daftarkan web app
1. **Project settings** (ikon gerigi) → **Your apps** → ikon `</>`.
2. Salin nilai `firebaseConfig`.
3. Di folder proyek: salin `.env.example` jadi `.env`, lalu isi nilainya.

### 5. Jalankan di laptop
```bash
npm install
npm test        # cek generator soal
npm run dev     # buka http://localhost:5173
```

### 6. Deploy ke Firebase Hosting (gratis)
```bash
npm install -g firebase-tools
firebase login
firebase use --add            # pilih project yang tadi dibuat
npm run build
firebase deploy               # upload aturan Firestore + website
```
Alamatnya: `https://<project-id>.web.app`. Domain ini otomatis diizinkan untuk login Google.
Kalau nanti pakai domain lain (mis. Vercel), tambahkan di **Authentication → Settings → Authorized domains**.

### 7. Pasang di HP
- **iPhone (Safari)**: buka alamatnya → tombol Share → **Add to Home Screen**.
- **Android (Chrome)**: menu ⋮ → **Install app** / **Add to Home screen**.

## Catatan
- Setting latihan disimpan per perangkat (localStorage); riwayat disimpan di Firestore per akun.
- Yang disimpan per sesi hanya ringkasan (bukan tiap soal) supaya hemat kuota gratis.
- Saat offline, latihan tetap jalan; riwayat terkirim otomatis begitu online lagi.
