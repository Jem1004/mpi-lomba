# Product Requirement Document (PRD): Media Pembelajaran Interaktif "Jaringan Dasar"

- **Versi:** 1.0
- **Tanggal:** 14 Oktober 2025
- **Penulis:** [Nama Anda]
- **Status:** Draf Final

---

## 1. Latar Belakang dan Visi Produk

### 1.1. Latar Belakang
Proyek ini adalah pembuatan Media Pembelajaran Interaktif (MPI) berbasis web untuk kompetisi digital. MPI ini ditujukan sebagai alat bantu belajar mandiri yang modern dan menarik bagi siswa Sekolah Menengah Kejuruan (SMK) jurusan Teknik Komputer Jaringan dan Telekomunikasi (TKJT).

### 1.2. Visi Produk
Menjadi media pembelajaran terdepan yang menggabungkan pengalaman pengguna yang imersif (immersive) dengan konten edukatif yang interaktif dan relevan, sehingga meningkatkan pemahaman siswa pada materi Dasar Jaringan Komputer secara signifikan.

### 1.3. Tujuan Utama (Goals)
- **Untuk Siswa:** Menyediakan platform belajar yang menyenangkan, tidak membosankan, dan efektif untuk memahami konsep dasar jaringan komputer.
- **Untuk Kompetisi:** Menghasilkan produk yang inovatif, fungsional, dan memiliki desain yang unggul untuk memenangkan kompetisi.

### 1.4. Target Audiens
- **Pengguna Primer:** Siswa SMK kelas X/XI jurusan TKJT.
- **Karakteristik Pengguna:** Familiar dengan teknologi, gemar bermain game atau menggunakan aplikasi modern, dan membutuhkan visualisasi serta praktik langsung untuk memahami materi teknis.

---

## 2. Persyaratan Teknis (Technical Stack)

- **Frontend:** HTML5, CSS3, JavaScript (ES6+).
- **CSS Preprocessor:** SASS.
- **Penyimpanan Sisi Klien:** Web Storage API (`localStorage`) untuk menyimpan nama siswa, progres belajar, dan skor.
- **Library Eksternal:**
  - **Swiper.js:** Untuk carousel pada materi pembelajaran.
  - **html2canvas & jsPDF:** Untuk fungsionalitas generate dan download sertifikat PDF.
- **API Eksternal:**
  - **Google AI (Gemini API):** Untuk fitur AI Tutor Virtual.

---

## 3. Fitur dan Fungsionalitas (User Stories)

### 3.1. Halaman Awal (Sesi Pembelajaran)
- **Deskripsi:** Halaman pertama yang dilihat pengguna. Tujuannya adalah untuk personalisasi pengalaman belajar.
- **Tampilan:** Antarmuka berbasis teks menyerupai Terminal/CLI (Command Line Interface) dengan latar belakang gelap dan font monospace (e.g., 'Fira Code').
- **Alur Pengguna:**
  1.  Halaman menampilkan teks dengan efek ketikan: `[root@smk-pembelajaran ~]# Inisialisasi sesi belajar...`
  2.  Sistem meminta input nama: `Masukkan 'callsign' Anda (nama panggilan): _` dengan kursor berkedip.
  3.  **Sebagai siswa**, saya harus bisa memasukkan nama saya dan menekan 'Enter'.
  4.  Setelah nama dimasukkan, nama tersebut disimpan ke `localStorage` (`localStorage.setItem('studentName', namaSiswa)`).
  5.  Sistem menampilkan pesan sambutan: `Selamat datang, [namaSiswa]! Sistem siap. Memuat menu navigasi...`
  6.  Jika siswa sudah pernah masuk sebelumnya (`localStorage` berisi `studentName`), sistem akan menampilkan: `Memuat ulang sesi untuk [namaSiswa]... Selamat datang kembali!` dan langsung melanjutkan ke transisi.

### 3.2. Transisi ke Menu Utama
- **Deskripsi:** Efek visual yang menjembatani halaman terminal dengan halaman menu grafis.
- **Spesifikasi:** Setelah pesan sambutan di terminal, layar menampilkan animasi transisi seperti *glitch effect* atau animasi *scan lines* selama 1-2 detik sebelum menampilkan Halaman Menu Utama.

### 3.3. Halaman Menu Utama
- **Deskripsi:** Pusat navigasi utama aplikasi.
- **Tampilan:**
  - **Layout:** Grid 3x3 atau 4x2 yang responsif.
  - **Tema Visual:** "Digital Circuit" / "Modern Tech Interface". Latar belakang gelap dengan pola sirkuit PCB atau grid digital.
  - **Menu Cards:** Kotak dengan sudut sedikit membulat, memiliki warna aksen neon yang berbeda untuk setiap kartu.
  - **Interaktivitas:** Saat *hover*, kartu akan sedikit membesar (`transform: scale(1.05);`) dan memancarkan efek `box-shadow` berwarna neon.
- **Konten:** Terdapat 7 menu card, masing-masing dengan ikon dan judul yang jelas.

### 3.4. Menu 1: Tujuan Pembelajaran
- **Deskripsi:** Menampilkan target kompetensi yang akan dicapai siswa.
- **Fungsionalitas:**
  1.  **Sebagai siswa**, saya ingin melihat daftar semua tujuan pembelajaran.
  2.  Tampilan berupa *interactive checklist*.
  3.  Sebuah tujuan akan otomatis tercentang (✅) ketika siswa menyelesaikan bab materi atau tes yang relevan.
  4.  Status centang harus disimpan di `localStorage` agar progres tidak hilang.

### 3.5. Menu 2: Materi Pembelajaran
- **Deskripsi:** Konten inti pembelajaran yang detail dan interaktif.
- **Fungsionalitas:**
  1.  **Sebagai siswa**, saya ingin bisa memilih bab materi yang ingin dipelajari (misal: "Model OSI Layer", "IP Addressing").
  2.  **Materi Model OSI:** Tampilkan diagram 7 layer OSI. Setiap layer bisa di-klik untuk menampilkan detail (fungsi, protokol, perangkat) dalam bentuk *modal/pop-up* atau panel samping.
  3.  **Materi IP Subnetting:** Sertakan **kalkulator subnetting interaktif** di dalam halaman. Siswa bisa memasukkan IP/CIDR dan melihat hasilnya secara langsung.
  4.  **Materi Perangkat Jaringan:** Gunakan **carousel (Swiper.js)** untuk menampilkan gambar dan deskripsi perangkat seperti Router, Switch, Hub.
  5.  **Mini-Lab (Praktik Langsung):**
     - Sediakan area *drag-and-drop* untuk membangun topologi jaringan sederhana (2 PC, 1 Switch).
     - Siswa dapat mengklik PC untuk membuka jendela simulasi konfigurasi IP.
     - Sediakan tombol "ping" untuk mensimulasikan konektivitas antar PC berdasarkan kebenaran konfigurasi IP.

### 3.6. Menu 3 & 4: Test Pengetahuan & Kuis
- **Deskripsi:** Modul evaluasi untuk mengukur pemahaman siswa.
- **Bank Soal:** Soal dan jawaban harus disimpan dalam file `soal.json` eksternal agar mudah dikelola.
- **Fungsionalitas Test Pengetahuan (Formatif):**
  1.  **Sebagai siswa**, saya ingin bisa mengerjakan latihan di setiap akhir bab materi tanpa batasan waktu.
  2.  Sistem harus memberikan *feedback* instan setelah saya menjawab (Benar/Salah dan penjelasannya).
  3.  Skor tidak direkam untuk sertifikat.
- **Fungsionalitas Kuis (Sumatif):**
  1.  **Sebagai siswa**, saya ingin mengerjakan ujian akhir yang mencakup semua materi.
  2.  Kuis harus memiliki **timer** yang berjalan mundur.
  3.  Sistem menampilkan satu soal per halaman dengan *progress bar*.
  4.  Skor akhir akan disimpan di `localStorage` (`localStorage.setItem('finalScore', skor)`) untuk digunakan di sertifikat.

### 3.7. Menu 5: Sertifikat
- **Deskripsi:** Memberikan penghargaan digital kepada siswa atas penyelesaian pembelajaran.
- **Fungsionalitas:**
  1.  **Sebagai siswa**, setelah menyelesaikan kuis, saya ingin bisa melihat dan mengunduh sertifikat pencapaian.
  2.  Sertifikat didesain menggunakan HTML & CSS dengan tema "Digital Circuit".
  3.  Data pada sertifikat (Nama Siswa, Nilai Akhir, Tanggal) harus diambil secara dinamis dari `localStorage`.
  4.  Terdapat **gelar pencapaian** berdasarkan skor (misal: 90-100 = "Network Architect").
  5.  Gunakan **html2canvas** dan **jsPDF** untuk mengonversi elemen HTML sertifikat menjadi file PDF yang dapat diunduh dengan nama file: `Sertifikat_[NamaSiswa].pdf`.

### 3.8. Menu 6: AI Tutor Virtual (Chatbot)
- **Deskripsi:** Fitur asisten cerdas untuk menjawab pertanyaan siswa seputar materi.
- **Fungsionalitas:**
  1.  **Sebagai siswa**, saya ingin bisa bertanya tentang konsep jaringan yang tidak saya mengerti kepada AI Tutor.
  2.  Antarmuka berupa jendela *chat* yang familiar.
  3.  Aplikasi menggunakan **JavaScript `fetch()`** untuk mengirim pertanyaan siswa ke **Google AI Gemini API**.
  4.  *Prompt* untuk AI harus dikonfigurasi agar jawaban yang diberikan relevan dengan konteks materi SMK TKJT.
  5.  Jawaban dari AI ditampilkan sebagai balasan di jendela *chat*.

### 3.9. Menu 7: Tentang Pengembang
- **Deskripsi:** Halaman informasi mengenai pembuat aplikasi.
- **Fungsionalitas:**
  - Tampilkan foto, bio singkat, dan tautan ke media sosial/portofolio (GitHub, LinkedIn) pengembang.

---

## 4. Desain & Pengalaman Pengguna (UI/UX)

- **Tema Umum:** Modern, Teknologis, "Hacker/Developer aesthetic" namun tetap bersih dan profesional.
- **Palet Warna:** Latar belakang dominan gelap (`#0A0A1A`, `#1E1E2E`). Warna aksen neon (`#00FF7F` - hijau, `#00BFFF` - cyan, `#FF00FF` - magenta).
- **Tipografi:** Gunakan font *monospace* (seperti 'Fira Code', 'Source Code Pro') untuk elemen terminal dan judul. Gunakan font sans-serif yang modern dan mudah dibaca (seperti 'Inter', 'Poppins') untuk konten isi.
- **Responsivitas:** Aplikasi **wajib** sepenuhnya responsif dan dapat diakses dengan baik di perangkat desktop maupun mobile (Mobile First).

---

## 5. Kriteria Keberhasilan (Success Metrics)

1.  Semua fitur yang dijelaskan dalam PRD ini berfungsi tanpa *bug* mayor.
2.  Pengalaman pengguna terasa lancar, intuitif, dan menarik.
3.  Waktu muat aplikasi cepat (< 3 detik).
4.  Desain visual konsisten dan sesuai dengan tema yang ditetapkan.
5.  Aplikasi mendapatkan penilaian positif dari juri kompetisi dan pengguna.