# 📋 Papunda Page Builder — Roadmap & Dokumentasi Fitur

> File ini berisi dokumentasi teknis, status fitur, dan rencana pengembangan builder undangan.
> Update file ini setiap kali ada fitur baru yang ditambahkan atau diubah.

---

## ✅ Fitur yang Sudah Jadi

### Arsitektur
- [x] Route builder: `/admin/builder/{userId}/{slug}` dengan validasi kepemilikan
- [x] Layout builder fullscreen (escape dari sidebar admin via `fixed inset-0 z-[9999]`)
- [x] Scroll canvas berfungsi (`min-h-0` + `overflow-y-auto` di 3-kolom layout)
- [x] Tampil di URL undangan: `/undang/{userId}/{slug}` — cek builder dulu, fallback ke tema lama
- [x] Undangan builder muncul di dashboard `/admin` bersama undangan lama
- [x] Badge "✨ Builder" di kartu dashboard untuk membedakan dari undangan formulir

### Backend (PHP)
- [x] `builder_create.php` — buat undangan builder baru
- [x] `builder_save.php` — simpan JSON state
- [x] `builder_get.php` — load untuk editor (perlu auth)
- [x] `builder_get_public.php` — load untuk viewer publik (tanpa auth)
- [x] `get_invitations.php` — UNION dari `content_user` + `builder_pages` dengan collation fix

### Database
- [x] Tabel `builder_pages` — lihat `create_builder_pages_table.sql`
  - Kolom: `id`, `user_id`, `slug`, `event_type`, `page_title`, `page_data` (JSON), `status`, `expired`

### Section Types (14 section)
| Tipe | Editor | Preview | Keterangan |
|------|--------|---------|------------|
| `hero` | ✅ | ✅ | Cover/header utama |
| `countdown` | ✅ | ✅ | Hitung mundur acara |
| `couple` | ✅ | ✅ | Info mempelai |
| `event_details` | ✅ | ✅ | Detail acara |
| `gallery` | ✅ | ✅ | Grid foto |
| `our_story` | ✅ | ✅ | Timeline cerita |
| `rsvp` | ✅ | ✅ | Form konfirmasi kehadiran |
| `gift` | ✅ | ✅ | Info transfer/amplop digital |
| `maps` | ✅ | ✅ | Embed Google Maps |
| `music` | ✅ | ✅ | Background music player |
| `quote` | ✅ | ✅ | Kutipan/ayat |
| `text_block` | ✅ | ✅ | Teks bebas |
| `divider` | ✅ | ✅ | Pemisah dekoratif |
| `social_links` | ✅ | ✅ | Link sosial media |

---

## 🚧 Fitur yang Sedang / Baru Ditambahkan

### Hero Section — Enhanced (v3)
**Tanggal:** 2026-05-18

Props baru yang ditambahkan ke HeroEditor & HeroPreview (v3):

| Prop | Tipe | Default | Keterangan |
|------|------|---------|------------|
| `height` | `string` | `"480"` | Tinggi cover: angka (px), `"100vh"`, atau nilai CSS bebas |
| `bg_blur` | `number` | `0` | Blur background image (0–20px). Pakai scale 1.05 trick untuk hindari tepi putih |
| `overlay_type` | `"none" \| "solid" \| "gradient" \| "pattern"` | `"solid"` | Tipe overlay di atas background (Ditambahkan `pattern` di v3) |
| `overlay_opacity` | `number` | `0.4` | Transparansi overlay (0–1) |
| `overlay_color` | `string` (hex) | `"#000000"` | Warna overlay solid, atau warna pertama gradient |
| `overlay_color2` | `string` (hex) | `"#9333ea"` | Warna kedua gradient |
| `overlay_angle` | `number` | `135` | Sudut gradient (0–360 derajat) |
| `overlay_pattern` | `string` | `""` | URL kustom gambar overlay / pattern PNG (Baru di v3) |
| `rounded_type` | `"all" \| "custom"` | `"all"` | Tipe border radius (Baru di v3) |
| `rounded_all` | `number` | `0` | Border radius semua sisi jika type = all (Baru di v3) |
| `rounded_tl` | `number` | `0` | Border radius Top-Left jika type = custom (Baru di v3) |
| `rounded_tr` | `number` | `0` | Border radius Top-Right jika type = custom (Baru di v3) |
| `rounded_bl` | `number` | `0` | Border radius Bottom-Left jika type = custom (Baru di v3) |
| `rounded_br` | `number` | `0` | Border radius Bottom-Right jika type = custom (Baru di v3) |

**Contoh JSON section hero v3:**
```json
{
  "type": "hero",
  "props": {
    "greeting": "The Wedding of",
    "name_primary": "Andi",
    "name_secondary": "Siti",
    "bg_image": "https://...",
    "couple_photo": "https://...",
    "height": "560",
    "bg_blur": 4,
    "overlay_type": "pattern",
    "overlay_opacity": 0.5,
    "overlay_pattern": "https://example.com/floral-pattern.png",
    "rounded_type": "custom",
    "rounded_tl": 24,
    "rounded_tr": 24,
    "rounded_bl": 0,
    "rounded_br": 0,
    "show_scroll_hint": true
  }
}
```

---

## 📅 Rencana Fitur Mendatang

### Prioritas Tinggi
- [ ] **Hapus undangan builder** dari dashboard (sekarang hanya bisa hapus legacy)
- [ ] **Toggle status** (draft/aktif) untuk undangan builder
- [ ] **Manage page** untuk builder — lihat RSVP, statistik view
- [ ] **Duplicate section** — salin section yang sudah diisi
- [ ] **Reorder section** via drag-and-drop (saat ini hanya via tombol panah)
- [ ] **Upload gambar** langsung dari builder (integrasi Backblaze yang sudah ada)

### Prioritas Sedang
- [ ] **Section: Opening** — halaman splash/amplop digital sebelum masuk ke undangan
- [ ] **Section: Dress Code** — panduan pakaian tamu
- [ ] **Section: Timeline/Rundown** — susunan acara
- [ ] **Section: Ucapan** — live wall ucapan dari tamu
- [ ] **Global font selector** — pilih font heading & body dari Google Fonts
- [ ] **Color scheme presets** — palette warna siap pakai (rose gold, navy, sage, dll)
- [ ] **Section locking** — kunci section agar tidak bisa diubah posisinya

### Prioritas Rendah / Eksperimental
- [ ] **Preview mobile frame** — tampilan di dalam frame smartphone
- [ ] **Export PDF** — undangan versi print/PDF
- [ ] **QR Code section** — QR dinamis untuk tamu spesifik
- [ ] **Multi-language** — konten dalam 2 bahasa (id/en)
- [ ] **Password protection** — undangan hanya bisa dibuka dengan kode unik
- [ ] **Analytics** — jumlah view per undangan builder

---

## 🏗️ Struktur File Penting

```
components/builder/
├── BuilderContext.tsx      # State management (useReducer + Context API)
├── BuilderDashboard.tsx    # Layout 3-kolom editor
├── BuilderCanvas.tsx       # Preview center (klik section untuk pilih)
├── BuilderViewer.tsx       # Render publik undangan builder
├── SectionPanel.tsx        # Panel kiri — list & manage sections
├── PropertiesPanel.tsx     # Panel kanan — editor props section terpilih
├── defaults.ts             # Default props & sections per event_type
├── types.ts                # TypeScript types (BuilderPage, BuilderSection, dll)
│
├── editors/                # Editor UI per section type
│   ├── HeroEditor.tsx
│   ├── CountdownEditor.tsx
│   └── ...
│
├── previews/               # Preview render per section type
│   ├── HeroPreview.tsx
│   ├── CountdownPreview.tsx
│   └── ...
│
└── ui/
    └── EditorFields.tsx    # Komponen UI reusable (Field, Input, Select, Toggle, dll)

app/admin/builder/
└── [userId]/[slug]/page.tsx  # Server component — auth + load data + render

ginvite/page/
├── builder_create.php
├── builder_save.php
├── builder_get.php
├── builder_get_public.php
└── create_builder_pages_table.sql
```

---

## 🔧 Setup & Konfigurasi

### Environment Variables
```env
JWT_SECRET=your-secret-key
API_BASE_URL=https://ccgnimex.my.id/v2/android/ginvite
```

### Database Migration
Jalankan SQL berikut di phpMyAdmin / MySQL server sebelum menggunakan builder:
```
ginvite/page/create_builder_pages_table.sql
```

### Dev Server
```bash
bun run dev
```

---

## 🐛 Known Issues & Notes

| Issue | Status | Catatan |
|-------|--------|---------|
| Collation mismatch UNION `content_user` + `builder_pages` | ✅ Fixed | Pakai `CONVERT(... USING utf8mb4) COLLATE utf8mb4_unicode_ci` |
| Sidebar admin muncul di builder | ✅ Fixed | `fixed inset-0 z-[9999]` di builder layout |
| Scroll canvas tidak bisa | ✅ Fixed | `min-h-0` di semua flex container |
| `builder_pages` table belum ada di server | ⚠️ Manual | Harus run SQL migration manual di server |
| Tombol hapus builder belum ada | 🔜 Todo | Hanya undangan legacy yang bisa dihapus dari dashboard |
