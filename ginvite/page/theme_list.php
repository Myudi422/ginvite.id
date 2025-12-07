<?php
// php/page/theme_list.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require __DIR__ . '/../db.php'; // sesuaikan path ke file koneksi PDO Anda

try {
    $stmt = $pdo->query("
        SELECT 
            id,
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
        FROM theme
        ORDER BY id DESC
    ");
    $themes = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $themes[] = [
            'id'                      => (int) $row['id'],
            'name'                    => $row['name'],
            'text_color'              => $row['text_color'],
            'accent_color'            => $row['accent_color'],
            'default_bg_image'        => $row['default_bg_image'],
            'background'              => $row['background'],
            'default_bg_image1'       => $row['default_bg_image1'],
            'decorations_top_left'    => $row['decorations_top_left'],
            'decorations_top_right'   => $row['decorations_top_right'],
            'decorations_bottom_left' => $row['decorations_bottom_left'],
            'decorations_bottom_right'=> $row['decorations_bottom_right'],
            'image_theme'             => $row['image_theme'],
            'kategory_theme_id'       => (int) $row['kategory_theme_id']
        ];
    }
    echo json_encode([
        'status' => 'success',
        'data'   => $themes
    ], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo json_encode([
        'status'  => 'error',
        'message' => "Gagal mengambil data: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
