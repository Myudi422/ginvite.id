-- Script SQL untuk membuat tabel blogs
-- Jalankan script ini di database MySQL/MariaDB Anda

CREATE TABLE IF NOT EXISTS `blogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  `content` longtext NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `category` varchar(100) NOT NULL,
  `status` enum('draft','published') DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category` (`category`),
  KEY `status` (`status`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel untuk menyimpan metadata gambar yang diupload melalui rich text editor
CREATE TABLE IF NOT EXISTS `blog_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `blog_id` int(11) DEFAULT NULL,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `file_size` int(11) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_used` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `blog_id` (`blog_id`),
  KEY `filename` (`filename`),
  KEY `is_featured` (`is_featured`),
  KEY `is_used` (`is_used`),
  FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Menambahkan beberapa data contoh (opsional)
INSERT INTO `blogs` (`title`, `slug`, `content`, `category`, `status`) VALUES
('Tips Membuat Undangan Pernikahan yang Menarik', 'tips-membuat-undangan-pernikahan-menarik', 
'Undangan pernikahan adalah hal pertama yang akan dilihat oleh tamu undangan Anda. Oleh karena itu, penting untuk membuat undangan yang menarik dan berkesan. Berikut adalah beberapa tips untuk membuat undangan pernikahan yang menarik:\n\n1. Pilih tema yang sesuai dengan konsep pernikahan\n2. Gunakan warna yang harmonis\n3. Pilih font yang mudah dibaca\n4. Tambahkan sentuhan personal\n5. Pastikan informasi lengkap dan jelas', 
'wedding', 'published'),

('Cara Membuat Undangan Digital dengan Mudah', 'cara-membuat-undangan-digital-mudah',
'Di era digital ini, undangan digital semakin populer karena praktis dan ramah lingkungan. Berikut langkah-langkah membuat undangan digital:\n\n1. Tentukan platform yang akan digunakan\n2. Siapkan konten dan foto\n3. Pilih template yang sesuai\n4. Kustomisasi sesuai kebutuhan\n5. Test dan bagikan ke tamu',
'tutorial', 'published'),

('Inspirasi Tema Pernikahan 2024', 'inspirasi-tema-pernikahan-2024',
'Tahun 2024 membawa berbagai tren tema pernikahan yang menarik. Dari yang minimalis hingga yang mewah, berikut beberapa inspirasi tema pernikahan yang sedang trending di tahun 2024...',
'inspiration', 'draft');

-- Membuat index untuk performa yang lebih baik
CREATE INDEX idx_blogs_category_status ON blogs(category, status);
CREATE INDEX idx_blogs_created_at_desc ON blogs(created_at DESC);

-- Membuat folder untuk upload (pastikan folder ini ada dan memiliki permission yang tepat)
-- mkdir -p uploads/blog/
-- chmod 755 uploads/blog/
