# Sample Undangan Digital - RAHMA & MARTIN

## Deskripsi
Sample undangan pernikahan digital tanpa API untuk testing dan development. Sample ini menggunakan tema 1 dengan data statis.

## Data Undangan
- **Mempelai Wanita**: SITI RAHMAWATI AULIAH (RAHMA)  
  Putri pertama dari Bpk Rahman & Ibu Sopi
  
- **Mempelai Pria**: MARTIN (MARTIN)  
  Putra bungsu dari Bpk Inan & Ibu Tini

### Jadwal Acara
- **AKAD**: Jum'at, 16 Januari 2026 (Rumah mempelai wanita)
- **RESEPSI**: Minggu, 18 Januari 2026

### Lokasi
Kp. Sukamaju rt03/rw06, Des. Cibuntu, Kec. Ciampea, Kab. Bogor
[Google Maps](https://maps.app.goo.gl/i1jQCniwymKSBRwU9?g_st=aw)

### Rekening Digital
- **DANA**: 085813603655 A/N SITI RAHMAWATI AULIAH
- **DANA**: +62 896-7397-0754 A/N MARTIN

## Gambar
Menggunakan gambar dari folder `/public/211/`:
- IMG_2504_263.jpg (Foto mempelai wanita)
- IMG_2504_264.jpg (Foto mempelai pria)
- IMG_2506_263.jpg, IMG_2507_263.jpg, IMG_2507_264.jpg (Gallery)

## Akses Sample
- **URL Development**: `http://localhost:3000/sample/rahma-martin`
- **URL Production**: `https://papunda.com/sample/rahma-martin`

## Tema
Menggunakan tema 1 (`/components/theme/1/`) dengan semua fitur:
- Opening Section
- Profile Section
- Quote Section
- Event Section
- Gallery Section
- Bank Section
- Footer Section

## Cara Testing
1. Pastikan development server berjalan: `npm run dev`
2. Buka browser dan akses: `http://localhost:3000/sample/rahma-martin`
3. Test responsiveness dan semua fitur

## Catatan Development
- Data static hardcoded di `page.tsx`
- Tidak memerlukan API atau database
- Ideal untuk testing tema dan layout
- Bisa digunakan sebagai template untuk undangan lainnya