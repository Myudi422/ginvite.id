# Rich Text Editor Blog System Documentation

## Fitur Utama

### 1. Rich Text Editor dengan TinyMCE
- **Editor WYSIWYG** (What You See Is What You Get)
- **Toolbar lengkap** dengan formatting options
- **Responsive design** dengan styling pink theme
- **Auto-save** konten saat typing

### 2. Upload Gambar Terintegrasi
- **Upload via toolbar** - klik tombol gambar
- **Drag & Drop** - seret gambar langsung ke editor
- **Copy Paste** - paste gambar dari clipboard
- **Auto resize** dan optimisasi gambar

### 3. Database Management
- **Tracking gambar** yang diupload
- **Blog ID linking** untuk gambar per artikel
- **Featured image** marking
- **Usage tracking** untuk cleanup

## API Endpoints

### Image Upload API
**File:** `api/image_upload.php`
**URL:** `POST /api/image_upload.php`

**Parameters:**
- `file` (File) - Image file to upload
- `blog_id` (Optional) - Blog ID for linking

**Response:**
```json
{
  "success": true,
  "location": "https://ccgnimex.my.id/v2/android/ginvite/page/uploads/editor/filename.jpg",
  "image_id": 123,
  "filename": "unique_filename.jpg"
}
```

### Blog Images Management API
**File:** `api/blog_images.php`

#### List Images
```
GET /api/blog_images.php?action=list&blog_id=123
```

#### Delete Image
```
DELETE /api/blog_images.php?action=delete&id=123
```

#### Mark as Featured
```
POST /api/blog_images.php?action=mark_featured
Body: id=123&blog_id=456
```

#### Mark Unused Images
```
POST /api/blog_images.php?action=mark_unused
Body: blog_id=123&content=<html_content>
```

#### Cleanup Unused Images
```
POST /api/blog_images.php?action=cleanup
```

## Database Schema

### blogs Table
```sql
CREATE TABLE blogs (
  id int(11) NOT NULL AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  slug varchar(255) NOT NULL UNIQUE,
  content longtext NOT NULL,
  image_url varchar(500) DEFAULT NULL,
  category varchar(100) NOT NULL,
  status enum('draft','published') DEFAULT 'draft',
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

### blog_images Table
```sql
CREATE TABLE blog_images (
  id int(11) NOT NULL AUTO_INCREMENT,
  blog_id int(11) DEFAULT NULL,
  filename varchar(255) NOT NULL,
  original_name varchar(255) NOT NULL,
  file_path varchar(500) NOT NULL,
  file_url varchar(500) NOT NULL,
  file_size int(11) NOT NULL,
  mime_type varchar(100) NOT NULL,
  is_featured tinyint(1) DEFAULT 0,
  is_used tinyint(1) DEFAULT 1,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE SET NULL
);
```

## React Components

### 1. RichTextEditor
**File:** `components/RichTextEditor.tsx`

**Props:**
- `value` (string) - HTML content
- `onChange` (function) - Content change handler
- `placeholder` (string) - Placeholder text
- `height` (number) - Editor height in pixels
- `blogId` (string|number) - Optional blog ID

**Usage:**
```jsx
<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Tulis konten artikel di sini..."
  height={400}
  blogId={blogId}
/>
```

### 2. BlogImageManager
**File:** `components/BlogImageManager.tsx`

**Props:**
- `blogId` (string|number) - Blog ID filter
- `onImageSelect` (function) - Image selection callback
- `showControls` (boolean) - Show management controls

**Usage:**
```jsx
<BlogImageManager
  blogId={blogId}
  onImageSelect={(url) => console.log(url)}
  showControls={true}
/>
```

## Configuration

### TinyMCE Config
```javascript
{
  height: 400,
  menubar: false,
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
    'emoticons', 'paste', 'importcss'
  ],
  toolbar: [
    'undo redo | blocks | bold italic underline strikethrough | forecolor backcolor',
    'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
    'removeformat | link image media table | emoticons charmap | code fullscreen preview'
  ],
  images_upload_url: 'https://ccgnimex.my.id/v2/android/ginvite/page/image_upload.php',
  paste_data_images: true
}
```

## File Structure

```
api/
├── blog_admin.php          # Main blog CRUD API
├── image_upload.php        # Image upload handler
├── blog_images.php         # Image management API
├── create_blogs_table.sql  # Database schema
└── uploads/
    ├── blog/              # Featured images
    └── editor/            # Rich text editor images

components/
├── RichTextEditor.tsx     # Main editor component
└── BlogImageManager.tsx   # Image management UI

app/panel/blog-admin/
├── UploadBlogForm.tsx     # Create blog form
├── EditBlogForm.tsx       # Edit blog form
└── page.tsx              # Blog admin page
```

## Usage Instructions

### Untuk User (Content Creator)

#### 1. Membuat Artikel Baru
1. Buka `/panel/blog-admin/create`
2. Isi judul artikel (slug auto-generate)
3. Pilih kategori dan status
4. Gunakan rich text editor untuk menulis konten:
   - **Formatting text**: Bold, italic, underline, dll
   - **Insert image**: Klik tombol image di toolbar
   - **Drag & drop**: Seret gambar ke editor
   - **Copy paste**: Paste gambar dari clipboard
5. Upload featured image (opsional)
6. Klik "Simpan Artikel"

#### 2. Mengedit Artikel
1. Buka `/panel/blog-admin/edit/[id]`
2. Edit konten menggunakan rich text editor
3. Gambar yang sudah ada akan tetap terjaga
4. Tambah gambar baru jika diperlukan
5. Klik "Perbarui Artikel"

#### 3. Upload Gambar ke Konten
**Metode 1: Via Toolbar**
- Klik tombol gambar di toolbar editor
- Pilih file dari komputer
- Gambar akan otomatis diinsert ke posisi cursor

**Metode 2: Drag & Drop**
- Drag file gambar dari explorer
- Drop ke area editor
- Gambar akan muncul di posisi drop

**Metode 3: Copy Paste**
- Copy gambar dari aplikasi lain
- Paste (Ctrl+V) di editor
- Gambar akan muncul di posisi cursor

### Untuk Admin (Image Management)

#### 1. Melihat Gambar Blog
- Gunakan komponen `BlogImageManager`
- Filter berdasarkan blog ID
- Lihat status featured dan usage

#### 2. Mengelola Gambar
- **Mark as Featured**: Set gambar sebagai featured
- **Delete**: Hapus gambar (file + database)
- **View**: Buka gambar di tab baru

#### 3. Cleanup Gambar Tidak Terpakai
- Jalankan API cleanup untuk hapus gambar lama yang tidak digunakan
- Sistem otomatis deteksi gambar yang tidak ada di konten

## Technical Features

### 1. Security
- **File type validation**: Hanya JPG, PNG, GIF, WebP
- **File size limit**: 10MB max untuk editor images
- **Unique filename**: Prevent conflicts
- **SQL injection protection**: PDO prepared statements

### 2. Performance
- **Lazy loading** images in manager
- **Optimized queries** with proper indexing
- **CDN ready** image URLs
- **Progressive upload** with progress bar

### 3. User Experience
- **Auto-save** content changes
- **Responsive** editor on mobile
- **Progress feedback** for uploads
- **Error handling** with user-friendly messages

### 4. Image Management
- **Auto-linking** images to blog when saved
- **Usage tracking** for cleanup
- **Featured image** system
- **Metadata storage** (size, type, original name)

## Setup Instructions

### 1. Database Setup
```sql
-- Run the SQL scripts
source api/create_blogs_table.sql;
source api/update_blog_images_table.sql;
```

### 2. Directory Permissions
```bash
mkdir -p api/uploads/blog
mkdir -p api/uploads/editor
chmod 755 api/uploads/blog
chmod 755 api/uploads/editor
```

### 3. Dependencies
```bash
npm install @tinymce/tinymce-react
```

### 4. CDN Configuration
Add to your HTML head:
```html
<script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/7/tinymce.min.js"></script>
```

## Troubleshooting

### Image Upload Gagal
1. Periksa permission folder uploads/
2. Periksa ukuran file (max 10MB)
3. Periksa format file (JPG, PNG, GIF, WebP)
4. Periksa koneksi database

### Editor Tidak Muncul
1. Pastikan TinyMCE CDN ter-load
2. Periksa console browser untuk error
3. Pastikan komponen ter-import dengan benar

### Gambar Tidak Muncul
1. Periksa URL gambar di database
2. Periksa permission file
3. Periksa path yang benar

### Database Error
1. Periksa koneksi database
2. Pastikan tabel blog_images sudah dibuat
3. Periksa foreign key constraints

## Best Practices

### 1. Content Creation
- Gunakan heading structure yang proper (H2, H3, dll)
- Optimize ukuran gambar sebelum upload
- Gunakan alt text yang descriptive
- Preview artikel sebelum publish

### 2. Image Management
- Hapus gambar yang tidak terpakai secara berkala
- Gunakan featured image untuk thumbnails
- Compress gambar untuk performance
- Gunakan format WebP jika memungkinkan

### 3. SEO Optimization
- Gunakan heading tags dengan proper
- Tambahkan alt text ke semua gambar
- Optimize gambar untuk web
- Gunakan internal linking

## API Error Codes

| Code | Message | Solution |
|------|---------|----------|
| 400 | Invalid file type | Use JPG, PNG, GIF, WebP |
| 413 | File too large | Reduce file size < 10MB |
| 500 | Database error | Check DB connection |
| 404 | Image not found | Check file exists |
| 403 | Permission denied | Check folder permissions |

## Future Enhancements

### Phase 1
- [ ] Image compression on upload
- [ ] WebP conversion
- [ ] Image cropping tool
- [ ] Bulk image upload

### Phase 2
- [ ] Video embed support
- [ ] GIF optimization
- [ ] Image CDN integration
- [ ] Advanced image effects

### Phase 3
- [ ] AI image tagging
- [ ] Auto alt text generation
- [ ] Image SEO optimization
- [ ] Performance analytics
