-- Update database untuk blog dengan rich text editor
-- Jalankan script ini di database MySQL/MariaDB Anda setelah tabel blogs sudah ada

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

-- Index untuk performa yang lebih baik
CREATE INDEX idx_blog_images_blog_id_used ON blog_images(blog_id, is_used);
CREATE INDEX idx_blog_images_created_at_desc ON blog_images(created_at DESC);

-- Membuat folder untuk upload (pastikan folder ini ada dan memiliki permission yang tepat)
-- Jalankan di command line:
-- mkdir -p uploads/editor/
-- chmod 755 uploads/editor/
-- mkdir -p uploads/blog/
-- chmod 755 uploads/blog/
