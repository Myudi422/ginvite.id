-- Script SQL untuk menambahkan Netflix Theme (Theme 2) ke database

-- ======================================================
-- 1. PASTIKAN TABEL KATEGORY_THEME ADA DAN TERISI
-- ======================================================

-- Cek dan buat tabel kategory_theme jika belum ada
CREATE TABLE IF NOT EXISTS kategory_theme (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert kategori jika belum ada
INSERT IGNORE INTO kategory_theme (id, nama) VALUES 
(1, 'Pernikahan'),
(2, 'Khitanan'), 
(3, 'Ulang Tahun'),
(4, 'Aqiqah'),
(5, 'Wisuda'),
(6, 'Seminar');

-- ======================================================
-- 2. MENAMBAHKAN NETFLIX THEME UNTUK SETIAP KATEGORI
-- ======================================================

-- Netflix Theme untuk Pernikahan (Kategori ID: 1)
INSERT INTO theme (
    name, 
    text_color, 
    accent_color, 
    default_bg_image, 
    background, 
    default_bg_image1, 
    decorations_top_left, 
    decorations_top_right, 
    decorations_bottom_left, 
    decorations_bottom_right, 
    image_theme, 
    kategory_theme_id
) VALUES (
    'Netflix Dark - Pernikahan',
    '#ffffff',
    '#e50914',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1920&h=1080&fit=crop',
    NULL, -- decorations bisa diisi nanti
    NULL,
    NULL,
    NULL,
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop', -- preview
    1
);

-- Netflix Theme untuk Khitanan (Kategori ID: 2)
INSERT INTO theme (
    name, 
    text_color, 
    accent_color, 
    default_bg_image, 
    background, 
    default_bg_image1, 
    decorations_top_left, 
    decorations_top_right, 
    decorations_bottom_left, 
    decorations_bottom_right, 
    image_theme, 
    kategory_theme_id
) VALUES (
    'Netflix Dark - Khitanan',
    '#ffffff',
    '#e50914',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1920&h=1080&fit=crop',
    NULL,
    NULL,
    NULL,
    NULL,
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    2
);

-- Netflix Theme untuk Ulang Tahun (Kategori ID: 3)
INSERT INTO theme (
    name, 
    text_color, 
    accent_color, 
    default_bg_image, 
    background, 
    default_bg_image1, 
    decorations_top_left, 
    decorations_top_right, 
    decorations_bottom_left, 
    decorations_bottom_right, 
    image_theme, 
    kategory_theme_id
) VALUES (
    'Netflix Dark - Ulang Tahun',
    '#ffffff',
    '#e50914',
    'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=1920&h=1080&fit=crop',
    NULL,
    NULL,
    NULL,
    NULL,
    'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=400&h=300&fit=crop',
    3
);

-- ======================================================
-- 3. VERIFIKASI DATA YANG DIINSERT
-- ======================================================

-- Cek data theme Netflix yang baru diinsert
SELECT 
    t.id,
    t.name,
    t.text_color,
    t.accent_color,
    kt.nama AS kategori_nama,
    t.created_at
FROM theme t
LEFT JOIN kategory_theme kt ON t.kategory_theme_id = kt.id
WHERE t.name LIKE '%Netflix%'
ORDER BY t.id DESC;

-- ======================================================
-- 4. QUERY UNTUK UPDATE JIKA DIPERLUKAN
-- ======================================================

-- Contoh update accent color jika ingin mengubah
-- UPDATE theme 
-- SET accent_color = '#dc143c' 
-- WHERE name LIKE '%Netflix%';

-- Contoh update background image
-- UPDATE theme 
-- SET default_bg_image = 'URL_BARU' 
-- WHERE id = [ID_THEME_NETFLIX];

-- ======================================================
-- 5. THEME MAPPING UNTUK DEVELOPMENT
-- ======================================================

-- Untuk development, Anda bisa menambahkan kolom component_version
-- untuk mapping ke component yang tepat
-- ALTER TABLE theme ADD COLUMN component_version INT DEFAULT 1;

-- Set Netflix themes menggunakan component version 2
-- UPDATE theme 
-- SET component_version = 2 
-- WHERE name LIKE '%Netflix%';

-- ======================================================
-- 6. BACKUP QUERY (ROLLBACK)
-- ======================================================

-- Jika perlu rollback, simpan ID theme yang diinsert
-- DELETE FROM theme WHERE name LIKE '%Netflix%' AND created_at > '2025-12-08';

-- ======================================================
-- NOTES:
-- ======================================================
-- 1. URL gambar menggunakan Unsplash sebagai placeholder
-- 2. Ganti dengan URL Backblaze B2 yang sebenarnya setelah upload
-- 3. Decorations (top_left, top_right, etc) bisa diisi nanti
-- 4. Preview image (image_theme) harus menunjukkan tampilan theme
-- 5. Component version bisa ditambahkan untuk mapping otomatis

-- ======================================================
-- TESTING QUERY
-- ======================================================

-- Test ambil theme berdasarkan kategori
SELECT * FROM theme WHERE kategory_theme_id = 1; -- Pernikahan
SELECT * FROM theme WHERE kategory_theme_id = 2; -- Khitanan

-- Test ambil semua theme dengan kategori
SELECT 
    t.*,
    kt.nama AS kategory_theme_nama
FROM theme t
LEFT JOIN kategory_theme kt ON t.kategory_theme_id = kt.id
ORDER BY kt.nama, t.name;