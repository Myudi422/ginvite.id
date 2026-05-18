<?php
// page/builder_get_public.php
// Returns builder page data by user_id + slug (public, no auth needed for viewing)

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php';

$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
$slug    = isset($_GET['slug'])    ? trim($_GET['slug'])    : '';

if (!$user_id || $slug === '') {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'user_id dan slug diperlukan.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "SELECT id, user_id, slug, event_type, page_title, page_data, status, expired
         FROM builder_pages
         WHERE user_id = ? AND slug = ?
         LIMIT 1"
    );
    $stmt->execute([$user_id, $slug]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Tabel belum ada atau error DB lainnya → anggap not_found
    echo json_encode([
        'status'  => 'not_found',
        'debug'   => $e->getMessage(), // hapus di production jika perlu
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!$row) {
    // Kembalikan 200 agar Next.js bisa baca body JSON-nya
    // (jika 404, builderRes.ok = false dan json tidak diproses)
    echo json_encode(['status' => 'not_found'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Check expiry
if ($row['expired'] && strtotime($row['expired']) < time() && $row['status'] == 0) {
    echo json_encode(['status' => 'expired'], JSON_UNESCAPED_UNICODE);
    exit;
}

$pageData = json_decode($row['page_data'], true) ?: [];

// Merge meta
$pageData['id']         = (int)$row['id'];
$pageData['user_id']    = (int)$row['user_id'];
$pageData['slug']       = $row['slug'];
$pageData['event_type'] = $row['event_type'];
$pageData['page_title'] = $row['page_title'];
$pageData['status']     = (int)$row['status'];

echo json_encode([
    'status' => 'success',
    'type'   => 'builder',
    'data'   => $pageData,
], JSON_UNESCAPED_UNICODE);
?>
