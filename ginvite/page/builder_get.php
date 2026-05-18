<?php
// page/builder_get.php
// Returns builder page data by user_id + slug

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
$slug    = isset($_GET['slug'])    ? trim($_GET['slug'])    : '';

if (!$user_id || $slug === '') {
    err(400, 'user_id dan slug diperlukan.');
}

$stmt = $pdo->prepare(
    "SELECT id, user_id, slug, event_type, page_title, page_data, status, expired, created_at, updated_at
     FROM builder_pages
     WHERE user_id = ? AND slug = ?
     LIMIT 1"
);
$stmt->execute([$user_id, $slug]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    err(404, 'Halaman builder tidak ditemukan.');
}

// Decode page_data JSON
$pageData = json_decode($row['page_data'], true);
if (!$pageData) {
    $pageData = [];
}

// Merge meta fields into page data
$pageData['id']         = (int)$row['id'];
$pageData['user_id']    = (int)$row['user_id'];
$pageData['slug']       = $row['slug'];
$pageData['event_type'] = $row['event_type'];
$pageData['page_title'] = $row['page_title'];
$pageData['status']     = (int)$row['status'];
$pageData['expired']    = $row['expired'];
$pageData['created_at'] = $row['created_at'];
$pageData['updated_at'] = $row['updated_at'];

echo json_encode([
    'status' => 'success',
    'data'   => $pageData,
], JSON_UNESCAPED_UNICODE);
?>
