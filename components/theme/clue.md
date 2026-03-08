# Panduan Pembuatan Tema Baru Berdasarkan Arsitektur Tema

Tema ini telah direfaktor sepenuhnya agar berperilaku murni sebagai tampilan **Mobile-First / Mobile-Only**. Meskipun dibuka melalui perangkat Desktop (PC/Laptop), tampilan undangan akan diposisikan tepat di tengah layar dan dikunci dengan rasio menyerupai layar *Smartphone* (lebar `max 420px`).

Jika Anda bertugas membangun tema-tema baru (Tema 6, Tema 7, dsb.) menggunakan API dan basis yang sama dengan ini, perhatikan poin krusial berikut:

## 1. Integrasi Tema Terpusat (`theme.json`)
Seluruh kontrol visual (warna, font, dan placeholder aset) sekarang disatukan secara terpusat pada file pengaturan berformat JSON (contoh: `theme.json`). 
- Tema Anda **wajib** mengkonfigurasi file berstruktur serupa.
- Panggil data konfigurasi JSON ini ke variabel CSS lokal (Custom CSS Variables, seperti `--t5-text-primary`) langsung di `page.tsx`.
- Saat mendesain elemen antarmuka, **jangan** hardcode warna (`text-blue-500` atau `#000`). Gunakan format referensi variabel: `text-[var(--t5-text-primary)]`.
- Lingkup variabel tema dapat merujuk file lokal JSON sebagai fallback utama jika preferensi admin tidak didefinisikan secara khusus *on the fly*.

## 2. Aturan Dimensi & Layout (Wajib)
Layout tema telah beradaptasi agar tidak rusak / hancur / terlalu panjang pada dekstop:
- **Konstrain Maksimum**: Kontainer pembungkus (Wrapper), elemen yang mengambang statis (`Fixed Navbar`, `Fixed Cover`, Banner Alert, Modals) wajib memanggil class utilitas `max-w-[420px] mx-auto` agar posisinya terpusat.
- **Dilarang Ada Layout Desktop**: Karena ini menstimulasi perilaku HP murni, hindari secara total breakpoint layar Tailwind seperti `md:` atau `lg:`. Elemen flex/grid tidak boleh diubah susunannya menjadi side-by-side menyamping ketika berada di desktop. Buatlah elemen tertumpuk secara vertikal layaknya dalam frame `smartphone`.
- **Constraint Vertikal**: Hindari membuat jarak yang berlebihan (`margin`/`padding`) di area *Cover* dan area intro, karena elemen akan terdorong keluar layar (overflow `100vh`) jika dilihat dari *smartphone* ukuran kecil (seperti iPhone SE).

## 3. Komponen Fungsi yang Wajib Dipertahankan
Beberapa elemen telah memiliki ikatan kuat pada API Undangan dan interaksi pengunjung:
*   **QR Code**: Modalnya wajib dapat dirender (`<QRModal />`) dan **selalu ditempatkan di bagian Cover/Opening** bagi tamu yang diundang secara khusus (memiliki parameter '?to='). Jangan diletakkan di dalam isi undangan.
*   **Proteksi Mode Trial (Fitur Gembok)**: Evaluasi kondisi undangan dengan mengecek `data.status === "tidak"`. Terapkan status "Terkunci" atau Teralihkan pada fitur sensitif seperti Rekening Kado, RSVP konfirmasi kehadiran, dan popup *Trial Watermark* di elemen Cover.
*   **Music Player & Navigation**: Pasang komponen terpisah `<MusicPlayer>` dan bilah navigasi `<Navigation>` dengan menempatkan mereka secara mengambang (namun tetap terkekang di area aman `420px`, bukan memenuhi seluruh ujung ke ujung monitor dekstop).

## 4. Alur & Struktur Konten (Content Flow) Wajib
Tema baru (misal Tema 6, dst) harus mengikuti susunan arsitektur bagian konten dari atas ke bawah *secara konsisten* dengan urutan berikut:
1. **Opening / Cover**: Layer pertama yang memenuhi layar penuh (100vh) yang berisi judul undangan, nama tamu (dari param URL `?to=`), **QR code tamu (WAJIB selalu ada di cover/opening)**, dan tombol "Buka Undangan". Bagian ini akan menghilang/meluncur ke atas saat tombol diklik.
2. **Header (Visual Hero)**: Biasa berisi slideshow background foto/video, dihiasi aset floral dan menonjolkan Nama Pengantin besar-besar.
3. **Quotes**: Kutipan Ayat/Mutiara Kata Pengantin.
4. **Our Journey (Love Story)**: Rangkaian timeline cerita cinta.
5. **Data Pengantin (Profile)**: Menampilkan kedua Mempelai & informasi orang tuanya.
6. **Date & Event Details (Resepsi/Akad)**: Detail informasi tempat dan waktu Acara (bisa >1 acara).
7. **Countdown Timer**: Hitung mundur hari pernikahan.
8. **Turut Mengundang**: Daftar kerabat kehormatan/orang tua yang mengundang.
9. **Video**: Menampilkan sematan video pre-wedding atau momen spesial. (Render kondisional jika `content.plugin.youtube_link` tersedia)
10. **Gallery (Our Moments)**: Kolase foto pengantin.
11. **Wedding Gift**: Area rekening bank/dompet digital yang **wajib menggunakan overlay trial mask** jika data belum lunas.
12. **RSVP & Wishes**: Formulir kedatangan tamu dan ucapan. Tutup juga dengan overlay trial jika belum dibayar.
13. **Footer**: Penutup halaman/Credit Aplikasi.

## 5. Kompatibilitas Multi-Event (Pernikahan & Khitanan) Wajib
Setiap tema yang dibuat **tidak boleh hanya diasumsikan untuk pernikahan**. Aplikasi ini juga melayani pembuatan undangan **Khitanan / Sunatan**.
- Anda harus selalu mengekstrak variabel `isKhitan` di awal komponen:
  ```typescript
  const lowerCategory = (category_type?.name || '').toString().toLowerCase();
  const isKhitan = lowerCategory.includes('khitan');
  ```
- **Conditional Rendering Wajib**:
  - **Cover & Header**: Jika `isKhitan`, jangan tampilkan simbol `&` (Ampersand). Cukup tampilkan 1 nama anak (`nickname1`). Jika bukan khitan, tampilkan `nickname1 & nickname2`.
  - **Identitas**: Ubah teks pembuka profil dari "Putra dari" menjadi "Putra/Putri Kebanggaan dari" jika `isKhitan`.
  - **Quotes**: Gunakan Ayat spesifik Khitanan (contoh: *Q.S An-Najm: 42*) vs nikah (*Q.S Az-Zariyah: 49*).
  - **Judul Acara**: Gunakan "Walimatul Khitan" / "The Star" daripada "We Are Tying The Knot" / "Akad Nikah".
