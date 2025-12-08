# Database Schema dan Implementasi Theme 2

## Struktur Database Theme

### Tabel `theme`
```sql
CREATE TABLE theme (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    text_color VARCHAR(7) NOT NULL,           -- Format: #ffffff
    accent_color VARCHAR(7) NOT NULL,         -- Format: #e50914 (untuk Netflix theme)
    default_bg_image VARCHAR(500),            -- URL gambar background utama
    background VARCHAR(500),                  -- URL background alternatif
    default_bg_image1 VARCHAR(500),           -- URL gambar background kedua
    decorations_top_left VARCHAR(500),        -- URL dekorasi kiri atas
    decorations_top_right VARCHAR(500),       -- URL dekorasi kanan atas
    decorations_bottom_left VARCHAR(500),     -- URL dekorasi kiri bawah
    decorations_bottom_right VARCHAR(500),    -- URL dekorasi kanan bawah
    image_theme VARCHAR(500) NOT NULL,        -- URL preview theme
    kategory_theme_id INT NOT NULL,           -- Foreign key ke kategory_theme
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabel `kategory_theme`
```sql
CREATE TABLE kategory_theme (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert kategori theme
INSERT INTO kategory_theme (id, nama) VALUES 
(1, 'Pernikahan'),
(2, 'Khitanan'), 
(3, 'Ulang Tahun'),
(4, 'Aqiqah'),
(5, 'Wisuda'),
(6, 'Seminar');
```

## Implementasi Theme 2 di Database

### 1. Menambahkan Theme 2 (Netflix Style)

```sql
-- Insert Theme 2 - Netflix Style untuk Pernikahan
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
    'Netflix Theme - Pernikahan',                    -- name
    '#ffffff',                                       -- text_color (putih)
    '#e50914',                                       -- accent_color (merah Netflix)
    'https://ccgnimex.backblazeb2.com/papunda/theme/1/netflix/default_bg.jpg',      -- default_bg_image
    'https://ccgnimex.backblazeb2.com/papunda/theme/1/netflix/background.jpg',      -- background  
    'https://ccgnimex.backblazeb2.com/papunda/theme/1/netflix/default_bg_1.jpg',    -- default_bg_image1
    'https://ccgnimex.backblazeb2.com/papunda/theme/1/netflix/decor_tl.png',        -- decorations_top_left
    'https://ccgnimex.backblazeb2.com/papunda/theme/1/netflix/decor_tr.png',        -- decorations_top_right
    'https://ccgnimex.backblazeb2.com/papunda/theme/1/netflix/decor_bl.png',        -- decorations_bottom_left
    'https://ccgnimex.backblazeb2.com/papunda/theme/1/netflix/decor_br.png',        -- decorations_bottom_right
    'https://ccgnimex.backblazeb2.com/papunda/theme/1/netflix/preview.jpg',         -- image_theme
    1                                                -- kategory_theme_id (Pernikahan)
);

-- Insert Theme 2 - Netflix Style untuk Khitanan
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
    'Netflix Theme - Khitanan',                      -- name
    '#ffffff',                                       -- text_color (putih)
    '#e50914',                                       -- accent_color (merah Netflix)
    'https://ccgnimex.backblazeb2.com/papunda/theme/2/netflix/default_bg.jpg',      -- default_bg_image
    'https://ccgnimex.backblazeb2.com/papunda/theme/2/netflix/background.jpg',      -- background
    'https://ccgnimex.backblazeb2.com/papunda/theme/2/netflix/default_bg_1.jpg',    -- default_bg_image1
    'https://ccgnimex.backblazeb2.com/papunda/theme/2/netflix/decor_tl.png',        -- decorations_top_left
    'https://ccgnimex.backblazeb2.com/papunda/theme/2/netflix/decor_tr.png',        -- decorations_top_right
    'https://ccgnimex.backblazeb2.com/papunda/theme/2/netflix/decor_bl.png',        -- decorations_bottom_left
    'https://ccgnimex.backblazeb2.com/papunda/theme/2/netflix/decor_br.png',        -- decorations_bottom_right
    'https://ccgnimex.backblazeb2.com/papunda/theme/2/netflix/preview.jpg',         -- image_theme
    2                                                -- kategory_theme_id (Khitanan)
);
```

### 2. Atau Upload via API

Anda juga bisa menggunakan endpoint `theme_upload.php` yang sudah ada:

```bash
curl -X POST https://ccgnimex.my.id/v2/android/ginvite/index.php?action=theme_upload \
  -F "name=Netflix Theme - Pernikahan" \
  -F "text_color=#ffffff" \
  -F "accent_color=#e50914" \
  -F "category_id=1" \
  -F "default_bg_image=@/path/to/default_bg.jpg" \
  -F "background=@/path/to/background.jpg" \
  -F "default_bg_image1=@/path/to/default_bg_1.jpg" \
  -F "image_theme=@/path/to/preview.jpg"
```

## Struktur Folder di Backblaze B2

```
papunda/
├── theme/
│   ├── 1/                           -- Kategori Pernikahan
│   │   ├── netflix-theme/           -- Folder untuk Netflix theme
│   │   │   ├── default_bg_xxx.jpg
│   │   │   ├── background_xxx.jpg
│   │   │   ├── default_bg_image1_xxx.jpg
│   │   │   ├── decorations_top_left_xxx.png
│   │   │   ├── decorations_top_right_xxx.png
│   │   │   ├── decorations_bottom_left_xxx.png
│   │   │   ├── decorations_bottom_right_xxx.png
│   │   │   └── image_theme_xxx.jpg
│   │   └── classic-theme/           -- Theme lain
│   ├── 2/                           -- Kategori Khitanan
│   │   └── netflix-theme/
│   └── 3/                           -- Kategori Ulang Tahun
│       └── netflix-theme/
```

## Mapping Theme dengan Component

### Frontend Theme Selector

Di file `components/theme/[number]/page.tsx`, sistem akan:

1. **Load theme data dari API** (`ginvite/page/theme.php`)
2. **Check theme ID** untuk menentukan component mana yang digunakan
3. **Import component yang sesuai**:

```typescript
// Di aplikasi utama (Next.js)
const getThemeComponent = (themeId: number) => {
  switch(themeId) {
    case 1:
    case 2: // Theme lama (ID 1-10 misalnya)
      return Theme1; // Import dari /components/theme/1/page.tsx
    case 11:
    case 12: // Theme Netflix (ID 11+ misalnya)
      return Theme2; // Import dari /components/theme/2/page.tsx
    default:
      return Theme1;
  }
};

// Atau berdasarkan nama theme
const getThemeComponent = (themeName: string) => {
  if (themeName.includes('Netflix')) {
    return Theme2;
  }
  return Theme1;
};
```

## Update di Component Existing

### 1. Update Theme Selector

Di file seperti `ThemeSection.tsx`, tidak perlu perubahan karena sudah menggunakan struktur data yang sama:

```tsx
// Sudah existing - tidak perlu diubah
{themes
  .filter(t => t.kategory_theme_id === selectedCategory)
  .map(t => (
    <div key={t.id} className={`theme-card ${selectedTheme === t.id ? 'selected' : ''}`}>
      <img src={t.image_theme} alt={t.name} />
      <p>{t.name}</p>
    </div>
  ))
}
```

### 2. Update Rendering Logic

Di main invitation page:

```tsx
// Contoh implementasi di halaman undangan
import Theme1 from '@/components/theme/1/page';
import Theme2 from '@/components/theme/2/page';

const InvitationPage = ({ invitationData }) => {
  const { theme } = invitationData;
  
  // Tentukan theme component berdasarkan ID atau nama
  const ThemeComponent = theme.name?.includes('Netflix') ? Theme2 : Theme1;
  
  return <ThemeComponent data={invitationData} />;
};
```

## Keuntungan Struktur Ini

### ✅ **Backward Compatible**
- Theme lama (ID 1-10) tetap menggunakan component theme 1
- Theme baru (ID 11+) menggunakan component theme 2
- Data struktur tidak berubah

### ✅ **Scalable**
- Mudah menambah theme baru (theme 3, 4, dst)
- Setiap theme bisa punya component terpisah
- Database schema tetap konsisten

### ✅ **Flexible**
- Admin bisa upload theme via API
- User bisa pilih theme dari database
- Theme bisa dikategorikan (pernikahan, khitanan, dll)

## Langkah Implementasi

1. **Insert theme data ke database** (SQL di atas)
2. **Upload gambar-gambar theme** ke Backblaze B2
3. **Update theme selector** untuk include Theme 2
4. **Test theme switching** antara Theme 1 dan Theme 2
5. **Deploy component** Theme 2 yang sudah dibuat

Dengan struktur ini, Theme 2 (Netflix style) akan muncul sebagai pilihan di form pembuatan undangan, dan sistem akan otomatis menggunakan component yang sesuai berdasarkan theme yang dipilih user.