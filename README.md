<div align="center">

  # 🇮🇩 Jejak Nusantara
  ### *Interactive Historical Timeline & Cultural Web Application*

  [![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-Vanilla_Design-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![Web Audio API](https://img.shields.io/badge/Web_Audio_API-Synthesizer-FF5500?style=for-the-badge&logo=soundcloud&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
  [![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Ready-222222?style=for-the-badge&logo=githubpages&logoColor=white)](#-github-pages-deployment)

  <p align="center">
    <b>Sebuah karya aplikasi web edukasi interaktif untuk menyusuri ±2 juta tahun perjalanan sejarah Indonesia — dari manusia purba Sangiran hingga Pemindahan Ibu Kota Nusantara (IKN).</b>
  </p>

  [🌐 Preview Live Demo](https://b88191055038c9.lhr.life) •
  [✨ Fitur Utama](#-fitur-unggulan) •
  [🛠️ Teknologi](#%EF%B8%8F-teknologi--arsitektur) •
  [🚀 Deploy ke GitHub Pages](#-github-pages-deployment)

</div>

---

## 📖 Tentang Proyek

**Jejak Nusantara** adalah aplikasi web *Single-Page Application* (SPA) berkinerja tinggi yang menggabungkan estetika desain *Glassmorphic Modern*, mikro-interaksi dinamis, serta mesin audio generatif (*Web Audio API*) untuk menyajikan 38 titik sejarah Indonesia terbagi dalam 6 babak secara mendalam dan menyenangkan.

Aplikasi ini dirancang sebagai **Showcase Portofolio Front-End Web Development** yang menonjolkan kemampuan manipulasi DOM tingkat lanjut, algoritma perhitungan linimasa logaritmik, sintesis suara tanpa aset file audio luar, serta aksesibilitas (*a11y*) berstandar tinggi.

---

## ✨ Fitur Unggulan

### 1. 🔍 Instant Search & Chapter Filter Bar
- **Pencarian Real-time**: Menggunakan *fuzzy string matching* untuk menyaring peristiwa sejarah berdasarkan kata kunci (contoh: *Majapahit*, *1945*, *Demak*, *Soekarno*).
- **Filter Chip Per Babak**: Navigasi cepat menyaring linimasa dari Babak I (Prasejarah) hingga Babak VI (Indonesia Merdeka).

### 2. 🎵 Web Audio Ambient Synthesizer (Pelog/Slendro Drone)
- **Mesin Suara Generatif**: Menggunakan `AudioContext`, `BiquadFilterNode`, dan `OscillatorNode` untuk memproduksi musik ambient khas gamelan pentatonis secara langsung di browser tanpa mengunduh file MP3 eksternal.
- **Efek Suara Chimes**: Lonceng frekuensi tinggi saat berinteraksi dengan elemen linimasa.

### 3. 🏆 Interactive Trivia Quiz Engine
- **Kuis Sejarah 8 Pertanyaan**: Dilengkapi pelacakan skor real-time, perbandingan jawaban benar/salah, serta penjelasan historis pada setiap pertanyaan.

### 4. ⭐ LocalStorage Bookmarks & Tautan Langsung
- **Fitur Favorit**: Menyimpan titik sejarah pilihan pengguna ke `localStorage` dengan penanda lencana (*badge counter*) pada header.
- **Salin Tautan (Direct Anchor Share)**: Berbagi URL jangkar spesifik (contoh: `#era-10` untuk Kerajaan Majapahit) hanya dengan sekali klik.

### 5. ⏱️ Head-Up Display (HUD) & Logarithmic Year Reader
- **Pengukur Progres Melingkar (SVG Gauge)**: Menampilkan persentase pembacaan secara real-time.
- **Penghitung Tahun Kontinu**: Menghitung estimasi tahun secara logaritmik dari 2.000.000 SM hingga masa kini saat pengguna menggeser halaman.

### 6. 🎨 Desain Premium & Aksesibilitas
- **Pola Batik Vektor Custom**: Pembatas SVG bermotif Kawung dan Parang khas Indonesia.
- **Parallax 3D & Frame Tilt**: Efek kemiringan 3D pada bingkai ilustrasi mengikuti pergerakan kursor (*fine pointer*).
- **Aksesibilitas Tinggi**: Mendukung `prefers-reduced-motion`, `aria-live="polite"`, navigasi keyboard, dan *skip link*.

---

## 🛠️ Teknologi & Arsitektur

```
Jejak Nusantara/
├── index.html              # Struktur HTML5 Semantik & SVG Definitions
├── package.json            # Vite & NPM Config
├── vite.config.js          # Vite Config (Base relative path for GitHub Pages)
├── .github/
│   └── workflows/
│       └── deploy.yml      # Automated GitHub Actions Workflow for Pages
└── src/
    ├── style.css           # Vanilla CSS Design System, Glassmorphism, Modals
    ├── main.js             # IntersectionObserver, Logarithmic Math, DOM Control
    ├── audio.js            # Web Audio API Synthesizer & Sound Effects Engine
    ├── quiz.js             # Trivia Quiz Modal Engine & Score Tracker
    └── search.js           # Real-time Filter, Bookmarks & Toast System
```

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Core UI** | HTML5 / CSS3 / ES6+ | Vanilla Web Stack tanpa ketergantungan library luar |
| **Bundler & Dev** | Vite | Lightning-fast HMR & optimized production build |
| **Audio Engine** | Web Audio API | Pure Code Sound Synthesizer (Zero MP3 Assets) |
| **Storage** | LocalStorage API | Persistence data favorit pengguna |
| **Deployment** | GitHub Actions | Automated CI/CD build & deploy to GitHub Pages |

---

## 🚀 Jalankan di Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) v18+ & NPM

### Langkah-Langkah

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/<username>/jejak-nusantara.git
   cd jejak-nusantara
   ```

2. **Install Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Server Lokal**:
   ```bash
   npm run dev
   ```
   Aplikasi akan aktif di `http://localhost:3000/`.

4. **Build untuk Produksi**:
   ```bash
   npm run build
   ```

---

## 🌐 GitHub Pages Deployment

Proyek ini telah dilengkapi dengan **GitHub Actions Workflow** (`.github/workflows/deploy.yml`) untuk otomatis melakukan *build* dan *deploy* setiap kali ada commit baru ke branch `main`.

### Cara Mengaktifkan di Repositori GitHub Anda:

1. Buat repositori baru di GitHub bernama `jejak-nusantara`.
2. Hubungkan folder lokal dan push ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit jejak-nusantara portfolio"
   git branch -M main
   git remote add origin https://github.com/<username>/jejak-nusantara.git
   git push -u origin main
   ```
3. Buka repositori Anda di GitHub -> **Settings** -> **Pages**.
4. Pada bagian **Source**, pilih **GitHub Actions**.
5. Tunggu proses workflow selesai (±1 menit). Website Anda akan otomatis tayang di:
   `https://<username>.github.io/jejak-nusantara/`

---

## 👤 Pengembang & Hak Cipta

Dibuat dengan rasa bangga sebagai bagian dari portofolio pengembangan web modern Indonesia.

- **Lisensi**: MIT License
- **Font**: Google Fonts (*Fraunces*, *Plus Jakarta Sans*, *JetBrains Mono*)
