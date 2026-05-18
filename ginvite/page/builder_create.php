<?php
// page/builder_create.php
// Creates a new "builder" type invitation page

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php';

function err($code, $msg) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    err(405, 'Method harus POST.');
}

$input     = json_decode(file_get_contents('php://input'), true) ?: [];
$user_id   = isset($input['user_id'])    ? (int)$input['user_id']          : 0;
$slug      = isset($input['slug'])       ? trim($input['slug'])             : '';
$eventType = isset($input['event_type']) ? trim($input['event_type'])       : 'custom';
$pageTitle = isset($input['page_title']) ? trim($input['page_title'])       : $slug;
$page      = isset($input['page'])       ? $input['page']                   : [];

if (!$user_id || $slug === '') {
    err(400, 'Parameter tidak valid. user_id dan slug diperlukan.');
}

// Validate slug format
if (!preg_match('/^[a-z0-9][a-z0-9-]{0,98}[a-z0-9]$/', $slug) && strlen($slug) < 2) {
    err(400, 'Slug tidak valid. Gunakan huruf kecil, angka, dan tanda hubung.');
}

// Check duplicate slug in builder_pages
$check = $pdo->prepare("SELECT COUNT(*) FROM builder_pages WHERE user_id = ? AND slug = ?");
$check->execute([$user_id, $slug]);
if ($check->fetchColumn() > 0) {
    err(409, 'Slug sudah digunakan. Coba nama lain.');
}

// Encode page data
$pageJson = json_encode($page, JSON_UNESCAPED_UNICODE);

// Expiry 3 days
$expired = date('Y-m-d H:i:s', strtotime('+3 days'));

$stmt = $pdo->prepare(
    "INSERT INTO builder_pages
        (user_id, slug, event_type, page_title, page_data, status, expired, created_at, updated_at)
     VALUES
        (?, ?, ?, ?, ?, 0, ?, NOW(), NOW())"
);

$ok = $stmt->execute([$user_id, $slug, $eventType, $pageTitle, $pageJson, $expired]);

if (!$ok) {
    err(500, 'Gagal membuat halaman builder.');
}

$id = $pdo->lastInsertId();

echo json_encode([
    'status'  => 'success',
    'message' => 'Halaman builder berhasil dibuat.',
    'id'      => $id,
    'slug'    => $slug,
], JSON_UNESCAPED_UNICODE);
?>
