<?php
// page/result.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require __DIR__ . '/../db.php';

function error($code, $msg)
{
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

// 1) Ambil parameter user, title, dan category_type (optional)
$userId = null;
if (isset($_GET['user_id']) && is_numeric($_GET['user_id'])) {
    $userId = (int) $_GET['user_id'];
} elseif (isset($_GET['user']) && is_numeric($_GET['user'])) {
    $userId = (int) $_GET['user'];
}
$title = isset($_GET['title']) && trim($_GET['title']) !== ''
    ? trim($_GET['title'])
    : null;
$categoryTypeId = isset($_GET['category_type']) && is_numeric($_GET['category_type'])
    ? (int) $_GET['category_type']
    : null;

if (!$userId || !$title) {
    error(400, 'Parameter user (atau user_id) dan title wajib');
}

// 2) Validasi user & expired
$stmt = $pdo->prepare("SELECT id AS uid, first_name, pictures_url FROM users WHERE id = ? AND expired > NOW()");
$stmt->execute([$userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$user) {
    error(404, 'User tidak ditemukan atau sudah expired');
}

// 3) Ambil content_user sesuai user_id + title
$stmt = $pdo->prepare(
    "SELECT *, CASE WHEN status = 1 THEN 'aktif' ELSE 'tidak' END AS status_teks
     FROM content_user
     WHERE user_id = ? AND title = ?
     LIMIT 1"
);
$stmt->execute([$userId, $title]);
$cu = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$cu) {
    error(404, 'Undangan tidak ditemukan untuk user ini');
}

// 4) Parse content JSON
$userContent = json_decode($cu['content'], true);
if (!is_array($userContent)) {
    error(500, 'Gagal mem-parsing data content');
}
// Pisahkan event agar tidak ganda
$eventData = $userContent['event'] ?? [];
unset($userContent['event']);

// Tentukan agama berdasarkan quoteCategory
// Hanya rename 'akad' → 'pemberkatan' kalau kategori mengandung kata "kristen"
// Kategori lain (Islam, Global, kosong) tetap pakai key 'akad'
$quoteCategory = strtolower(trim($userContent['quoteCategory'] ?? ''));
$isKristen = strpos($quoteCategory, 'kristen') !== false;
if ($isKristen && isset($eventData['akad'])) {
    $eventData['pemberkatan'] = $eventData['akad'];
    unset($eventData['akad']);
}

// 5) Ambil template dan nama kategori berdasarkan category_type
$templateCategoryId = (int) $cu['category_id'];
$stmt = $pdo->prepare("SELECT content_template, name AS category_type_name FROM category_type WHERE id = ?");
$stmt->execute([$templateCategoryId]);
$templateRow = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$templateRow) {
    error(404, "Kategori template ID={$templateCategoryId} tidak ditemukan");
}
$templateJson = $templateRow['content_template'];
$categoryTypeName = $templateRow['category_type_name'];
$template = json_decode($templateJson, true);

// 6) Merge template + userContent, sisipkan ID untuk frontend
$content = array_merge($template, $userContent);
$content['our_story'] = $content['our_story'] ?? [];
$content['themeCategoryTemplate'] = $templateCategoryId;
$content['themeCategory'] = (int) $cu['kategory_theme_id'];
$content['theme'] = (int) $cu['theme_id'];

// 7) Ambil data theme berdasarkan theme_id
$themeId = (int) $cu['theme_id'];
$stmt = $pdo->prepare("SELECT * FROM theme WHERE id = ?");
$stmt->execute([$themeId]);
$theme = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$theme) {
    error(404, "Theme ID={$themeId} tidak ditemukan");
}
// Ambil override warna dari content_user.font
$fontColor = $content['font']['color'] ?? [];
$textColor = (!empty($fontColor['text_color']) ? $fontColor['text_color'] : $theme['text_color']);
$accentColor = (!empty($fontColor['accent_color']) ? $fontColor['accent_color'] : $theme['accent_color']);

// 8) Bangun response JSON\ n
$result = [
    'user' => [
        'id' => $user['uid'],
        'first_name' => $user['first_name'],
        'pictures_url' => $user['pictures_url'],
    ],
    'category_type' => [
        'id' => $templateCategoryId,
        'name' => $categoryTypeName,
    ],
    'theme' => [
        'idtheme' => $theme['id'],
        'textColor' => $textColor,
        'accentColor' => $accentColor,
        'defaultBgImage' => $theme['default_bg_image'],
        'background' => $theme['background'] ?? '',
        'defaultBgImage1' => $theme['default_bg_image1'],
        'custom' => $theme['custom'] ?? null,
    ],
    'decorations' => [
        'topLeft' => $theme['decorations_top_left'],
        'topRight' => $theme['decorations_top_right'],
        'bottomLeft' => $theme['decorations_bottom_left'],
        'bottomRight' => $theme['decorations_bottom_right'],
    ],
    'content_user_id' => (int) $cu['id'],
    'content' => $content,
    'event' => $eventData,
    'status' => $cu['status_teks'],
];

echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>