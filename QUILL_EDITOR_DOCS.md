# Quill.js Rich Text Editor Implementation

## Overview
Rich Text Editor menggunakan Quill.js dengan fitur upload gambar terintegrasi untuk blog system.

## Features
✅ **Rich Text Editing** - WYSIWYG editor dengan toolbar lengkap
✅ **Image Upload** - Upload gambar via toolbar dan drag & drop
✅ **Copy Paste Images** - Paste gambar langsung dari clipboard
✅ **Auto Save** - Konten tersimpan otomatis saat mengetik
✅ **Responsive Design** - Bekerja dengan baik di mobile dan desktop
✅ **Custom Styling** - Pink theme yang konsisten dengan design system
✅ **SSR Safe** - Dynamic import untuk menghindari server-side rendering issues

## Implementation Details

### File Structure
```
components/
└── QuillRichTextEditor.tsx    # Main rich text editor component

app/panel/blog-admin/
├── UploadBlogForm.tsx          # Create blog form
├── EditBlogForm.tsx            # Edit blog form
└── page.tsx                    # Blog admin page

api/
├── image_upload.php            # Image upload handler
├── blog_admin.php              # Blog CRUD API
└── uploads/
    └── editor/                 # Rich text editor images
```

### Component Usage

#### Basic Usage
```tsx
import RichTextEditor from '@/components/QuillRichTextEditor';

function BlogForm() {
  const [content, setContent] = useState('');

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Tulis konten artikel di sini..."
      height={400}
    />
  );
}
```

#### With Blog ID (for image linking)
```tsx
<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Tulis konten artikel di sini..."
  height={400}
  blogId={blogId} // Links uploaded images to this blog
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | HTML content value |
| `onChange` | `(content: string) => void` | - | Content change handler |
| `placeholder` | `string` | "Tulis konten artikel di sini..." | Placeholder text |
| `height` | `number` | 400 | Editor height in pixels |
| `blogId` | `string \| number` | - | Optional blog ID for image linking |

## Toolbar Features

### Text Formatting
- **Headers** - H1, H2, H3, Normal text
- **Bold** - Bold text formatting
- **Italic** - Italic text formatting
- **Underline** - Underlined text
- **Strikethrough** - Crossed out text

### Styling
- **Text Color** - Choose text color
- **Background Color** - Highlight background
- **Alignment** - Left, center, right, justify

### Lists & Structure
- **Ordered List** - Numbered lists
- **Bullet List** - Bulleted lists
- **Blockquote** - Quote blocks
- **Code Block** - Code formatting

### Media & Links
- **Link** - Insert hyperlinks
- **Image** - Upload and insert images
- **Clean** - Remove formatting

## Image Upload Features

### Method 1: Toolbar Upload
1. Click the image button in toolbar
2. Select image file from computer
3. Image uploads automatically and inserts at cursor position

### Method 2: Copy Paste
1. Copy image from any application
2. Paste (Ctrl+V) in editor
3. Image uploads and inserts automatically

### Supported Formats
- **JPG/JPEG** - Standard photo format
- **PNG** - Transparent images
- **GIF** - Animated images
- **WebP** - Modern web format

### File Size Limits
- **Maximum**: 10MB per image
- **Recommended**: Under 2MB for better performance

## API Integration

### Image Upload Endpoint
```
POST /api/image_upload.php
```

#### Parameters
```javascript
FormData {
  file: File,        // Image file
  blog_id?: string   // Optional blog ID
}
```

#### Response
```json
{
  "success": true,
  "location": "https://ccgnimex.my.id/v2/android/ginvite/page/uploads/editor/filename.jpg",
  "image_id": 123,
  "filename": "unique_filename.jpg"
}
```

### Error Handling
```json
{
  "error": "File size too large. Maximum 10MB allowed."
}
```

## Styling & Customization

### Custom CSS Classes
```css
.ql-toolbar.ql-snow {
  border: 1px solid #f9a8d4;
  background: linear-gradient(to right, #fce7f3, #fdf2f8);
  border-radius: 8px 8px 0 0;
}

.ql-container.ql-snow {
  border: 1px solid #f9a8d4;
  border-radius: 0 0 8px 8px;
}

.ql-editor {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.6;
}

.ql-editor img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

### Pink Theme
- **Primary Color**: #ec4899 (pink-500)
- **Light Background**: #fce7f3 (pink-100)
- **Border Color**: #f9a8d4 (pink-300)
- **Hover Color**: #f9a8d4 (pink-300)

## Technical Implementation

### Dynamic Loading
```typescript
const loadQuill = async () => {
  if (typeof window !== 'undefined' && !quillInstance.current) {
    const Quill = (await import('quill')).default;
    // Initialize Quill...
  }
};
```

### Event Handling
```typescript
// Text change events
quillInstance.current.on('text-change', () => {
  const content = quillInstance.current.root.innerHTML;
  onChange(content);
});

// Image paste events
quillInstance.current.root.addEventListener('paste', handlePaste);
```

### Image Insertion
```typescript
const range = quillInstance.current.getSelection(true);
quillInstance.current.insertEmbed(range.index, 'image', imageUrl);
quillInstance.current.setSelection(range.index + 1);
```

## Error Handling

### Common Issues

#### Editor Not Loading
```
Problem: Quill editor doesn't appear
Solution: Check if Quill CSS is loaded in layout.tsx
```

#### Image Upload Fails
```
Problem: Images don't upload
Solution: 
1. Check API endpoint is accessible
2. Verify file permissions on uploads/ folder
3. Check file size and format
```

#### Content Not Saving
```
Problem: Content doesn't trigger onChange
Solution: Verify onChange handler is properly connected
```

### Debug Mode
Add console logs to track editor state:
```typescript
quillInstance.current.on('text-change', () => {
  console.log('Content changed:', quillInstance.current.root.innerHTML);
  onChange(content);
});
```

## Performance Optimization

### Lazy Loading
- Quill loads dynamically to avoid SSR issues
- Only initializes when component mounts

### Image Optimization
- Automatic compression for large images
- WebP format support for modern browsers
- CDN-ready URLs for fast loading

### Memory Management
- Proper cleanup of event listeners
- Component unmounting handles cleanup

## Best Practices

### Content Creation
1. **Structure**: Use proper heading hierarchy (H1 > H2 > H3)
2. **Images**: Optimize images before upload
3. **Alt Text**: Add descriptive alt text for accessibility
4. **Links**: Use meaningful link text

### Performance
1. **Image Size**: Keep images under 2MB
2. **Content Length**: Break long articles into sections
3. **Preview**: Always preview before publishing

### SEO
1. **Headings**: Use heading tags for structure
2. **Images**: Include alt text for all images
3. **Links**: Use descriptive anchor text
4. **Content**: Write for both users and search engines

## Troubleshooting

### Installation Issues
```bash
# Remove old packages
npm uninstall react-quill

# Install Quill.js
npm install quill@latest
```

### CSS Issues
```html
<!-- Ensure Quill CSS is loaded -->
<link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
```

### SSR Issues
```typescript
// Use dynamic loading
const Quill = (await import('quill')).default;
```

## Future Enhancements

### Phase 1
- [ ] Table support
- [ ] Video embed
- [ ] Math formulas
- [ ] Code syntax highlighting

### Phase 2
- [ ] Collaborative editing
- [ ] Version history
- [ ] Auto-save drafts
- [ ] Spell checking

### Phase 3
- [ ] AI writing assistance
- [ ] Voice input
- [ ] Advanced image editing
- [ ] Custom toolbar configuration

## Dependencies

```json
{
  "quill": "^2.0.3"
}
```

## Browser Support
- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support
- **Mobile**: ✅ Responsive design

## Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and descriptions
- **Color Contrast**: WCAG 2.1 AA compliant
- **Focus Management**: Proper focus indicators

## Security
- **File Validation**: Type and size checking
- **XSS Protection**: Content sanitization
- **CSRF Protection**: Token-based requests
- **Upload Limits**: File size and type restrictions
