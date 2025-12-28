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

// Query to get top 4 popular themes first, then random order for the rest
$sql = "SELECT 
            t.*, 
            kt.nama AS kategory_theme_nama,
            COALESCE(cu.usage_count, 0) AS usage_count,
            CASE 
                WHEN COALESCE(cu.usage_count, 0) >= 5 THEN 1
                ELSE 0
            END AS is_top_popular
        FROM theme t
        LEFT JOIN kategory_theme kt ON t.kategory_theme_id = kt.id
        LEFT JOIN (
            SELECT theme_id, COUNT(*) as usage_count 
            FROM content_user 
            WHERE theme_id IS NOT NULL 
            GROUP BY theme_id
        ) cu ON t.id = cu.theme_id
        ORDER BY 
            is_top_popular DESC,
            CASE WHEN is_top_popular = 1 THEN cu.usage_count END DESC,
            CASE WHEN is_top_popular = 0 THEN RAND() END
        LIMIT 1000"; // Show top popular first, then random
$stmt = $pdo->prepare($sql);
$stmt->execute();
$themes = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$themes) {
    error(404, 'Themes not found.');
}

// Strukturkan ulang output agar sesuai dengan kebutuhan (opsional)
$formattedThemes = [];
$popularCount = 0;
foreach ($themes as $theme) {
    $isPopular = (int)$theme['usage_count'] >= 5 && $popularCount < 4;
    if ($isPopular) {
        $popularCount++;
    }
    
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
        'usage_count' => (int)$theme['usage_count'], // Include usage count for popularity
        'is_popular' => $isPopular, // Only mark top 4 as popular
    ];
}

echo json_encode(['status' => 'success', 'data' => $formattedThemes], JSON_UNESCAPED_UNICODE);
?>