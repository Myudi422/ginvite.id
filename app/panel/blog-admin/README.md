# AI Blog Generator

Fitur AI Blog Generator menggunakan Google Gemini API untuk menghasilkan konten blog secara otomatis.

## Fitur yang Tersedia

### 1. Generate Blog AI
- **Lokasi**: Tombol "Generate Blog AI" di halaman blog admin
- **Fungsi**: Membuat artikel blog baru berdasarkan topik yang diberikan
- **Output**: Judul, slug, dan konten artikel (minimal 500 kata)
- **Status**: Artikel disimpan sebagai draft

### 2. Bulk Generate
- **Lokasi**: Tombol "Bulk Generate" di halaman blog admin  
- **Fungsi**: Membuat beberapa artikel sekaligus dari daftar topik
- **Fitur**: 
  - Progress bar real-time
  - Error handling per artikel
  - Delay antar request untuk menghindari rate limiting

### 3. Regenerate Artikel
- **Lokasi**: Tombol sparkle (⭐) di setiap BlogCard
- **Fungsi**: Memperbaiki dan memperluas konten artikel yang sudah ada
- **Output**: Konten diperbaiki dengan minimal 800 kata

### 4. AI Statistics
- **Lokasi**: Panel statistik di atas daftar blog
- **Info**: 
  - Total artikel
  - Jumlah artikel AI generated
  - Artikel AI hari ini
  - Artikel AI minggu ini
  - Persentase coverage AI

## API Configuration

### Gemini API Key
```typescript
const API_KEY = 'AIzaSyAxd3bXoh0MnwufqV1B3vtEFSMWBPDTunE';
```

### Endpoint
```typescript
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
```

## Struktur File

```
app/panel/blog-admin/
├── page.tsx              # Halaman utama blog admin
├── BlogCard.tsx          # Card artikel dengan tombol regenerate
├── AutoGenerateBlog.tsx  # Komponen generate single blog
├── BulkGenerateBlog.tsx  # Komponen bulk generate
└── AIStats.tsx           # Komponen statistik AI

lib/
└── gemini.ts             # Utility functions untuk Gemini API
```

## Format Output AI

AI menghasilkan konten dalam format JSON:

```json
{
  "title": "Judul artikel yang menarik",
  "content": "Konten HTML dengan formatting lengkap"
}
```

### HTML Tags yang Digunakan
- `<h2>`, `<h3>` untuk subjudul
- `<p>` untuk paragraf
- `<ul>`, `<li>` untuk daftar
- `<strong>`, `<em>` untuk penekanan
- Format HTML lainnya untuk struktur yang baik

## Error Handling

### Generate Blog
- Validasi input topik
- Error handling API call
- Feedback user dengan alert

### Bulk Generate  
- Progress tracking
- Individual error handling per artikel
- Summary report di akhir proses

### Regenerate
- Konfirmasi sebelum regenerate
- Preservasi metadata artikel (kategori, status, gambar)
- Error feedback

## Penggunaan

### Generate Single Blog
1. Klik tombol "Generate Blog AI"
2. Masukkan topik atau ide artikel
3. Klik "Generate"
4. Artikel akan tersimpan sebagai draft

### Bulk Generate
1. Klik tombol "Bulk Generate"  
2. Tambah topik-topik artikel
3. Klik "Generate Semua"
4. Monitor progress dan tunggu selesai

### Regenerate Artikel
1. Klik tombol sparkle (⭐) di artikel
2. Konfirmasi regenerate
3. Artikel akan diperbaiki dan diperbarui

## Rate Limiting

- Delay 2 detik antar request pada bulk generate
- Single request untuk generate dan regenerate
- Error handling untuk rate limit exceeded

## Default Settings

- **Kategori**: General (untuk artikel AI generated)
- **Status**: Draft (artikel baru)
- **Image**: Kosong (tidak ada gambar default)
- **Slug**: Auto-generated dari judul

## Tips Penggunaan

1. **Topik Spesifik**: Gunakan topik yang spesifik untuk hasil terbaik
2. **Review Content**: Selalu review konten AI sebelum publish
3. **Edit Manual**: Lakukan editing manual jika diperlukan
4. **Bulk Wisely**: Jangan bulk generate terlalu banyak sekaligus
5. **Monitor Stats**: Pantau statistik AI usage
