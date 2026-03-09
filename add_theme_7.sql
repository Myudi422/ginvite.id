-- Script SQL untuk menambahkan Theme 7 (Simple Rustic 2) ke database

-- Theme 7 untuk Pernikahan (Kategori ID: 1)
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
    'Simple Rustic 2 - Pernikahan',
    '#FAE9DD',
    '#A6522B',
    'https://app.wevitation.com/storage/v2/cover/00c36738-c228-4c22-ab18-24f15d16c7a7_background_2.png',
    'https://app.wevitation.com/storage/v2/cover/00c36738-c228-4c22-ab18-24f15d16c7a7_background_1.png',
    'https://app.wevitation.com/storage/v2/cover/00c36738-c228-4c22-ab18-24f15d16c7a7_background_2.png',
    'https://www.wevitation.com/themes/mildness/img/corner-1.png',
    NULL,
    'https://www.wevitation.com/themes/mildness/img/corner-2.png',
    'https://www.wevitation.com/themes/mildness/img/flower-1.png',
    'https://app.wevitation.com/storage/v2/cover/00c36738-c228-4c22-ab18-24f15d16c7a7_background_2.png',
    1
);

-- Note: Ensure that the inserted row corresponds to ID=7 or that the application's `themeCategory` field maps to this newly created theme correctly so it points to components/theme/7.
