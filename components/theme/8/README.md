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

### 2. Waktu & Konten (Type: Text)
| Prop Name | Deskripsi | Contoh Isi |
| :--- | :--- | :--- |
| `weddingDate` | Tanggal acara (format rapi) | 28 Maret 2026 |
| `calendarUrl` | Link Google Calendar | https://google.com/... |
| `invitationText` | Kata pengantar undangan | Tanpa mengurangi rasa hormat... |

| `quote` | Teks kutipan/ayat | Dan di antara tanda-tanda... |
| `quoteSource` | Sumber kutipan | QS Ar-Rum: 21 |

### 3. Media & Style (Type: Text / Object)
| Prop Name | Type | Deskripsi |
| :--- | :--- | :--- |
| `coverImage` | Text (URL) | URL foto utama untuk sampul |
| `themeColor` | Text (Hex) | Warna tema (#A6522B) |
| `galleryImages`| Object (Array)| Digunakan untuk komponen Galeri |
| `story` | Object (Array)| Data untuk timeline perjalanan cinta |

### 4. Logic & Visibility (Type: Toggle / Boolean)
| Prop Name | Deskripsi |
| :--- | :--- |
| `isWedding` | Bernilai `true` jika kategori pernikahan |
| `isKhitan` | Bernilai `true` jika kategori khitanan |

---

## ⚡ Interaction: Tombol Buka Undangan
Agar desain kamu bisa dibuka, daftarkan prop ini di komponen **`Theme8Opening`**:
- **Name**: `onOpen`
- **Type**: `Function`

Pada tombol di desain kamu:
- **Interactions** -> **On click** -> **Trigger component event** -> **onOpen**.

---

## 🛠️ Developer Notes
Data ini disuntikkan melalui file `components/theme/8/page.tsx`. Jika membutuhkan data tambahan dari API PHP, silakan tambahkan mapping-nya di file tersebut.
