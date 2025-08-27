# Blog Image Management System

Sistem manajemen gambar untuk blog dengan fitur auto-cleanup dan tracking penggunaan gambar.

## Fitur Utama

### 1. Rich Text Editor dengan Upload Gambar
- **Quill.js Editor**: Editor teks kaya dengan toolbar lengkap
- **Upload Gambar**: Drag & drop atau klik untuk upload
- **Paste Gambar**: Copy-paste gambar langsung dari clipboard
- **Auto Resize**: Gambar otomatis di-resize untuk web

### 2. Smart Image Tracking
- **Real-time Tracking**: Melacak gambar yang digunakan dalam artikel
- **Auto Sync**: Otomatis sinkronisasi saat save/update artikel
- **Deletion Detection**: Mendeteksi gambar yang dihapus dari editor

### 3. Auto Image Cleanup
- **Scheduled Cleanup**: Otomatis menghapus gambar yang tidak terpakai
- **Orphan Detection**: Mendeteksi file yang tidak terdaftar di database
- **Safe Deletion**: Hanya menghapus gambar yang sudah tidak digunakan > 2 jam

## Cara Menggunakan

### Upload Artikel Baru
1. Buka form "Buat Artikel Baru"
2. Isi judul, konten dengan rich text editor
3. Upload gambar dengan:
   - Klik tombol gambar di toolbar
   - Copy-paste dari clipboard
   - Drag & drop ke editor
4. Save artikel - gambar otomatis di-link ke artikel

### Edit Artikel
1. Buka artikel yang ingin diedit
2. Edit konten dengan rich text editor
3. Hapus/tambah gambar sesuai kebutuhan
4. Update artikel - sistem otomatis sync gambar

### Auto Cleanup
- Gambar yang dihapus dari editor akan ditandai "unused"
- Setelah 2 jam, file fisik akan dihapus otomatis
- Cron job berjalan setiap jam untuk cleanup

## API Endpoints

### Image Upload
```
POST: /api/page/image_upload.php
- file: File gambar
- blog_id: (optional) ID blog
```

### Sync Blog Images
```
POST: /api/page/sync_blog_images.php
- blog_id: ID blog
- content: HTML content artikel
```

### Cleanup Unused Images
```
POST: /api/page/cleanup_unused_images.php
- action: mark_unused_single|mark_unused_bulk|list_unused|cleanup_old
```

### Auto Cleanup (Cron Job)
```
GET: /api/page/auto_cleanup_images.php
```

## Database Schema

### Table: blog_images
```sql
CREATE TABLE blog_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    file_path VARCHAR(500),
    file_size INT,
    mime_type VARCHAR(100),
    blog_id INT,
    is_used TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_filename (filename),
    INDEX idx_blog_id (blog_id),
    INDEX idx_is_used (is_used),
    INDEX idx_updated_at (updated_at)
);
```

## Setup Cron Job

Tambahkan cron job untuk auto cleanup:

```bash
# Cleanup setiap jam
0 * * * * /usr/bin/php /path/to/auto_cleanup_images.php
```

## Monitoring

### Log Files
- **Cleanup Log**: `/logs/image_cleanup.log`
- **Error Log**: Server error logs

### Manual Cleanup
```php
// Get list unused images
GET: /api/page/cleanup_unused_images.php?action=list_unused

// Manual cleanup
POST: /api/page/cleanup_unused_images.php
action=cleanup_old
```

## Troubleshooting

### Double Editor Issue
- **Penyebab**: Multiple useEffect initialization
- **Solusi**: Menggunakan ref untuk prevent double init

### Images Not Deleting
- **Penyebab**: File permissions atau path salah
- **Solusi**: Check file permissions dan path di auto_cleanup_images.php

### Memory Issues
- **Penyebab**: Banyak gambar besar
- **Solusi**: Implementasi image compression di upload

## Security Features

1. **File Type Validation**: Hanya accept image files
2. **File Size Limit**: Max 5MB per image
3. **Path Security**: Prevent directory traversal
4. **Database Sanitization**: Prepared statements
5. **CORS Protection**: Configured headers

## Performance Optimization

1. **Lazy Loading**: Images loaded on demand
2. **CDN Ready**: Files stored with CDN-friendly structure
3. **Database Indexing**: Optimized queries
4. **Batch Operations**: Efficient bulk operations
5. **Background Processing**: Cleanup runs in background

## Future Enhancements

- [ ] Image compression during upload
- [ ] Multiple image formats support (WebP, AVIF)
- [ ] Image optimization based on device
- [ ] Advanced image editing tools
- [ ] Image CDN integration
- [ ] Real-time collaboration editing
