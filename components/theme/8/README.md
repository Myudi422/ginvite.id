# Theme 8 - Plasmic Integration Guide

Tema 8 adalah tema khusus yang didesain secara visual menggunakan **Plasmic Studio**. Dokumentasi ini berisi daftar data (props) yang tersedia untuk dihubungkan (binding) ke desain kamu.

## 🔗 Cara Menghubungkan (Binding) Data
1. Buka **Plasmic Studio**.
2. Klik komponen utama (`Theme8` atau `Theme8Opening`).
3. Di panel kanan (Props), daftarkan **Prop Name** sesuai tabel di bawah dengan **Type** yang sesuai.
4. Klik elemen (teks/gambar) di desain kamu, lalu klik ikon **Dynamic Value** dan pilih prop yang sesuai.

---

## 📋 Daftar Prop Tersedia

### 1. Informasi Utama & Keluarga (Type: Text)
| Prop Name | Deskripsi | Contoh Isi |
| :--- | :--- | :--- |
| `coupleName` | Nama lengkap pasangan (gabung) | Syifa & Yudi |
| `coupleNickname` | Nama panggilan pasangan (gabung) | Syifa & Yudi |
| `nickname1` | Nama panggilan pengantin pria/anak 1 | Syifa |
| `nickname2` | Nama panggilan pengantin wanita/anak 2 | Yudi |
| `guestName` | Nama tamu dari URL (?to=...) | Bapak Antigravity |
| `groomName` | Nama lengkap pengantin pria | Muhammad Yudi |
| `brideName` | Nama lengkap pengantin wanita | Siti Syifa |
| `groomFather` | Nama ayah pengantin pria | Bapak Fulano |
| `groomMother` | Nama ibu pengantin pria | Ibu Fulana |
| `brideFather` | Nama ayah pengantin wanita | Bapak Suta |
| `brideMother` | Nama ibu pengantin wanita | Ibu Suti |
| `eventLabel` | "Wedding Invitation" / "Walimatul Khitan" | Otomatis pilih sesuai kategori |
| `eventSubtitle` | "The Wedding Of" / "Khitannya" | Otomatis pilih sesuai kategori |
| `parentLabel` | "Putra/i dari..." / "Putra dari..." | Otomatis pilih sesuai kategori |
| `groomInstagram` | Username Instagram pria | @yudi_digital |
| `brideInstagram` | Username Instagram wanita | @syifa_wedding |
| `groomParentText` | Teks gabungan orang tua pria | Putra dari Bapak A & Ibu B |
| `brideParentText` | Teks gabungan orang tua wanita | Putri dari Bapak C & Ibu D |

### 2. Waktu & Konten (Type: Text)
| Prop Name | Deskripsi | Contoh Isi |
| :--- | :--- | :--- |
| `weddingDate` | Tanggal acara (format rapi) | 28 Maret 2026 |
| `calendarUrl` | Link Google Calendar | https://google.com/... |
| `countdownDate` | Tanggal untuk timer (ISO format) | 2026-03-28T09:00:00 |
| `daysLeft` | Sisa hari (teks) | 12 |
| `hoursLeft` | Sisa jam (teks) | 05 |
| `minutesLeft` | Sisa menit (teks) | 45 |

| `invitationText` | Kata pengantar undangan | Tanpa mengurangi rasa hormat... |

| `quote` | Teks kutipan/ayat | Dan di antara tanda-tanda... |
| `quoteSource` | Sumber kutipan | QS Ar-Rum: 21 |

### 3. Media & Style (Type: Text / Object)
| Prop Name | Type | Deskripsi |
| :--- | :--- | :--- |
| `coverImage` | Text (URL) | URL foto utama untuk sampul |
| `groomProfile`| Text (URL) | URL foto pengantin pria |
| `brideProfile`| Text (URL) | URL foto pengantin wanita |
| `themeColor` | Text (Hex) | Warna tema (#A6522B) |
| `galleryImages`| Object (Array)| Digunakan untuk komponen Galeri |
| `story` | Object (Array)| Data untuk timeline perjalanan cinta (Detail di bawah) |

### 4. Event & Lokasi (Helper untuk Visibility)
Gunakan prop `has...` untuk mengatur **Visibility** box acara agar otomatis sembunyi jika data tidak ada.

| Prop Name | Type | Deskripsi |
| :--- | :--- | :--- |
| `hasStory` | Toggle | `true` jika fitur Love Story aktif & ada datanya |
| `hasAkad` | Toggle | `true` jika data Akad ada |
| `akadTitle` | Text | Judul acara (contoh: "Akad Nikah") |
| `akadDate` | Text | Tanggal (contoh: "12 April 2026") |
| `akadTime` | Text | Jam (contoh: "08:00 - Selesai") |
| `akadLocation` | Text | Alamat lokasi |
| `akadMaps` | Text | Link Google Maps |
| | | |
| `hasResepsi` | Toggle | `true` jika data Resepsi ada |
| `resepsiTitle` | Text | Judul acara (contoh: "Resepsi") |
| `resepsiDate` | Text | Tanggal |
| `resepsiTime` | Text | Jam |
| `resepsiLocation`| Text | Alamat lokasi |
| `resepsiMaps` | Text | Link Google Maps |
| | | |
| `hasPemberkatan`| Toggle | `true` jika data Pemberkatan ada |
| `hasUnduhMantu` | Toggle | `true` jika data Unduh Mantu ada |
| `hasKhitanEvent`| Toggle | `true` jika data Khitanan ada |

### 5. Logic & Visibility (Type: Toggle / Boolean)
| Prop Name | Deskripsi |
| :--- | :--- |
| `isWedding` | Bernilai `true` jika kategori pernikahan |
| `isKhitan` | Bernilai `true` jika kategori khitanan |
| `showQrPlugin` | Bernilai `true` jika fitur QR aktif & link dipersonalisasi (?to=...) |
| `quoteEnabled` | Bernilai `true` jika data kutipan/quotes tersedia |
| `hasGroomProfile`| Bernilai `true` jika foto pengantin pria tersedia |
| `hasBrideProfile`| Bernilai `true` jika foto pengantin wanita tersedia |
| `hasAnyProfile`  | Bernilai `true` jika salah satu atau kedua pengantin punya foto |

---

## 🖼️ Cara Menampilkan/Menyembunyikan Foto Profil
Jika kamu ingin mendukung desain dengan/tanpa foto (seperti pada screenshot):

### Opsi A: Menggunakan Visibility (Paling Mudah)
1. Pilih elemen **Image** atau **Container foto** di Plasmic Studio.
2. Pada panel kanan, cari bagian **Visibility**.
3. Klik ikon petir (Dynamic Value) -> Pilih **`hasGroomProfile`** (untuk pria) atau **`hasBrideProfile`** (untuk wanita).
4. Klik pada elemen Gambarnya sendiri, lalu bind **`Src`** ke prop **`groomProfile`** atau **`brideProfile`**.

### Opsi B: Menggunakan Variant
1. Buat variant di komponen kamu, misalnya `withImage` (boolean variant).
2. Bind aktivasi variant tersebut ke prop **`hasGroomProfile`** atau **`hasBrideProfile`**.
3. Atur desain di dalam variant tersebut (munculkan foto, atur layout).

---

## ⚡ Interaction: Tombol Buka Undangan
Agar desain kamu bisa dibuka, daftarkan prop ini di komponen **`Theme8Opening`**:
- **Name**: `onOpen`
- **Type**: `Function`

Pada tombol di desain kamu:
- **Interactions** -> **On click** -> **Trigger component event** -> **onOpen**.

## 📱 Interaction: Tombol Scan QR
Daftarkan prop ini di komponen **`NewPage`** atau **`WeddingPage`**:
- **Name**: `onShowQr`
- **Type**: `Function`

Pada tombol/icon QR di desain kamu:
- **Visibility** -> Bind ke prop **`showQrPlugin`**.
- **Interactions** -> **On click** -> **Trigger component event** -> **onShowQr**.

---

## 🗺️ Interaction: Google Maps
Agar tombol lokasi bisa membuka Maps, daftarkan prop ini (sesuai kebutuhan acara):
- **Name**: `onAkadMaps`, `onResepsiMaps`, `onPemberkatanMaps`, `onUnduhMantuMaps`, atau `onKhitanMaps`
- **Type**: `Function`

Pada tombol "Buka Peta" di desain kamu:
- **Interactions** -> **On click** -> **Trigger component event** -> Pilih sesuai acara (misal: `onAkadMaps`).

---

## ⌛ Komponen: Countdown Timer
1. Tekan `Ctrl + I` di Plasmic Studio, cari komponen **`CountdownTimer`**.
2. Masukkan ke dalam desain.
3. Di panel kanan (Props), bind **`targetDate`** ke prop **`countdownDate`**.
4. Gunakan `accentColor`, `numberClassName`, dan `labelClassName` untuk mengatur tampilan (mendukung class Tailwind).

---

## 📏 Tips: Full Screen & Responsive
Agar desain menutup seluruh layar tanpa sisa putih/hitam:
1. Pilih **Root Box** (elemen paling atas).
2. **Width**: Set ke `Stretch` (100%).
3. **Height**: Set ke `Hug` (Content) dan **Min-Height**: `100vh`.
4. Jika menggunakan **Position: Free** pada background: Pastikan elemen background tersebut di-**Pin** ke 4 sisi (Top, Right, Bottom, Left) dengan offset `0`.

---

---

## 📖 Struktur Data: Our Story
Jika kamu menggunakan komponen **Repeater** atau **List** di Plasmic untuk menampilkan perjalanan cinta, hubungkan ke prop **`story`**. Setiap item di dalam array tersebut memiliki struktur:

| Field Name | Type | Deskripsi |
| :--- | :--- | :--- |
| `title` | Text | Judul cerita (contoh: "Pertama Bertemu") |
| `description` | Text | Isi cerita / detail kejadian |
| `pictures` | Array | Daftar foto untuk cerita tersebut (Gunakan `pictures[0]` jika hanya butuh satu) |

**Tips Plasmic**:
1. Gunakan elemen **Repeater**.
2. Bind **Items** ke prop **`story`**.
3. Di dalam item, bind elemen Judul ke `item.title` dan Deskripsi ke `item.description`.

---

## 🛠️ Developer Notes
Data ini disuntikkan melalui file `components/theme/8/page.tsx`. Jika membutuhkan data tambahan dari API PHP, silakan tambahkan mapping-nya di file tersebut.
