<?php
// themelist.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php'; // Adjust the path if necessary

function error($code, $msg) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

// Query to select all themes and join with category name
$sql = "SELECT 
            t.*, 
            kt.nama AS kategory_theme_nama 
        FROM theme t
        LEFT JOIN kategory_theme kt ON t.kategory_theme_id = kt.id"; // LEFT JOIN to handle themes without categories
$stmt = $pdo->prepare($sql);
$stmt->execute();
$themes = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$themes) {
    error(404, 'Themes not found.');
}

// Strukturkan ulang output agar sesuai dengan kebutuhan (opsional)
$formattedThemes = [];
foreach ($themes as $theme) {
    $formattedThemes[] = [
        'id' => $theme['id'],
        'name' => $theme['name'],
        'text_color' => $theme['text_color'],
        'accent_color' => $theme['accent_color'],
        'default_bg_image' => $theme['default_bg_image'],
        'default_bg_image1' => $theme['default_bg_image1'],
        'decorations_top_left' => $theme['decorations_top_left'],
        'decorations_top_right' => $theme['decorations_top_right'],
        'decorations_bottom_left' => $theme['decorations_bottom_left'],
        'decorations_bottom_right' => $theme['decorations_bottom_right'],
        'image_theme' => $theme['image_theme'],
        'kategory_theme_id' => $theme['kategory_theme_id'],
        'kategory_theme_nama' => $theme['kategory_theme_nama'] ?? null, // Use null coalescing operator to avoid errors
    ];
}

echo json_encode(['status' => 'success', 'data' => $formattedThemes], JSON_UNESCAPED_UNICODE);
?>