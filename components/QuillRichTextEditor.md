# Rich Text Editor dengan Quill.js

Fitur rich text editor menggunakan Quill.js untuk blog admin dengan kemampuan upload gambar terintegrasi.

## Fitur Utama

### 1. Rich Text Editing
- **Formatting**: Bold, Italic, Underline, Strike-through
- **Headers**: H1 - H6
- **Colors**: Text color dan background color
- **Lists**: Ordered dan unordered lists
- **Alignment**: Left, center, right, justify
- **Blockquotes**: Quote styling dengan background
- **Code blocks**: Syntax highlighting support
- **Links**: Insert dan edit links
- **Clean**: Remove formatting

### 2. Image Upload
- **Click to Upload**: Klik tombol gambar di toolbar
- **File Support**: JPG, JPEG, PNG, GIF, WebP
- **Max Size**: 10MB per gambar
- **Auto Insert**: Gambar otomatis dimasukkan ke posisi cursor
- **Responsive**: Gambar otomatis responsive dengan max-width 100%

### 3. Styling Kustom
- **Pink Theme**: Menggunakan tema pink sesuai branding
- **Border Radius**: Corner rounded untuk modern look
- **Box Shadow**: Shadow pada gambar untuk depth
- **Hover Effects**: Interactive button effects
- **Gradient Background**: Toolbar dengan gradient background

## Komponen

### QuillRichTextEditor.tsx
```typescript
interface RichTextEditorProps {
  value: string;                    // HTML content
  onChange: (content: string) => void; // Change handler
  placeholder?: string;             // Placeholder text
  height?: number;                  // Editor height (default: 400px)
  blogId?: string | null;          // Blog ID untuk upload gambar
}
```

### API Integration

#### Image Upload Endpoint
- **URL**: `https://ccgnimex.my.id/v2/android/ginvite/page/image_upload.php`
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Parameters**:
  - `file`: Image file
  - `blog_id`: (Optional) Blog ID untuk tracking

#### Response Format
```json
{
  "success": true,
  "location": "https://ccgnimex.my.id/v2/android/ginvite/page/uploads/editor/image.jpg",
  "image_id": 123,
  "filename": "unique_filename.jpg"
}
```

## Database Schema

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
  KEY blog_id (blog_id),
  FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE SET NULL
);
```

## Penggunaan

### Create Blog Form
```tsx
<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Tulis konten artikel di sini..."
  height={400}
  blogId={null} // Untuk blog baru
/>
```

### Edit Blog Form
```tsx
<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Tulis konten artikel di sini..."
  height={400}
  blogId={blogId} // ID blog yang sedang diedit
/>
```

## Upload Directory Structure

```
api/
├── uploads/
│   ├── blog/          # Featured images untuk blog
│   └── editor/        # Gambar dari rich text editor
│       ├── image1.jpg
│       ├── image2.png
│       └── ...
├── image_upload.php   # Upload handler untuk editor
├── blog_images.php    # Management API untuk gambar
└── blog_admin.php     # Main blog CRUD API
```

## Styling Customization

### CSS Variables
```css
--editor-border-color: #f9a8d4;
--editor-primary-color: #ec4899;
--editor-hover-color: #f9a8d4;
--editor-background: linear-gradient(to right, #fce7f3, #fdf2f8);
```

### Custom Toolbar
Toolbar dapat dikustomisasi melalui `modules.toolbar.container`:
```javascript
[
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'align': [] }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  ['blockquote', 'code-block'],
  ['link', 'image', 'video'],
  ['clean']
]
```

## Error Handling

### Upload Errors
- File type tidak didukung
- File size terlalu besar
- Network error
- Server error

### User Feedback
- Alert untuk error upload
- Visual feedback saat upload
- Progress indicator (opsional)

## Performance Optimization

### Dynamic Import
```typescript
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
```

### Image Optimization
- Auto resize gambar besar
- Compression untuk reduce file size
- CDN delivery untuk performance

## Security Features

### File Validation
- MIME type checking
- File extension validation
- File size limits
- Malicious file detection

### Upload Security
- Unique filename generation
- Directory traversal protection
- Access control

## Browser Support

### Compatible Browsers
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### Fallback
- Graceful degradation ke textarea
- Feature detection
- Error boundary

## Troubleshooting

### Common Issues

1. **Editor tidak muncul**
   - Pastikan Quill CSS dimuat
   - Check console untuk error
   - Verifikasi dynamic import

2. **Upload gambar gagal**
   - Check API endpoint
   - Verifikasi file permissions
   - Check file size/type

3. **Styling tidak sesuai**
   - Pastikan CSS custom dimuat
   - Check CSS specificity
   - Verifikasi theme loading

### Debug Mode
Enable debug dengan menambah:
```javascript
window.Quill.debug('info');
```

## Migration dari TinyMCE

### Breaking Changes
- API handler berbeda
- CSS classes berbeda
- Plugin system berbeda

### Migration Steps
1. Update imports
2. Update props interface
3. Update styling
4. Test functionality
5. Update documentation
