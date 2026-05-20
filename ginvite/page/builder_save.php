<?php
// page/builder_save.php
// Saves builder page data (sections, styles, etc.) as JSON

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

$input   = json_decode(file_get_contents('php://input'), true) ?: [];
$user_id = isset($input['user_id']) ? (int)$input['user_id'] : 0;
$slug    = isset($input['slug'])    ? trim($input['slug'])    : '';

if (!$user_id || $slug === '') {
    err(400, 'user_id dan slug diperlukan.');
}

// Extract updatable fields
$pageTitle = isset($input['page_title']) ? trim($input['page_title']) : null;
$eventType = isset($input['event_type']) ? trim($input['event_type']) : null;

// The whole page object (minus user_id which is stored separately) is saved as JSON
$pageData = $input;
unset($pageData['user_id']); // don't duplicate in JSON

$pageJson = json_encode($pageData, JSON_UNESCAPED_UNICODE);

// Build dynamic SET
$setParts = ['page_data = ?', 'updated_at = NOW()'];
$params   = [$pageJson];

if ($pageTitle !== null) {
    $setParts[] = 'page_title = ?';
    $params[]   = $pageTitle;
}
if ($eventType !== null) {
    $setParts[] = 'event_type = ?';
    $params[]   = $eventType;
}

$params[] = $user_id;
$params[] = $slug;

$sql  = 'UPDATE builder_pages SET ' . implode(', ', $setParts) . ' WHERE user_id = ? AND slug = ?';
$stmt = $pdo->prepare($sql);

if (!$stmt->execute($params)) {
    err(500, 'Gagal menyimpan data builder.');
}

if ($stmt->rowCount() === 0) {
    // Row doesn't exist yet – insert it
    $insertStmt = $pdo->prepare(
        "INSERT INTO builder_pages
            (user_id, slug, event_type, page_title, page_data, status, expired, created_at, updated_at)
         VALUES
            (?, ?, ?, ?, ?, 0, DATE_ADD(NOW(), INTERVAL 3 DAY), NOW(), NOW())"
    );
    $insertStmt->execute([
        $user_id,
        $slug,
        $eventType ?: 'custom',
        $pageTitle ?: $slug,
        $pageJson,
    ]);
}

// Perbarui status penggunaan gambar di builder_images
try {
    $imgStmt = $pdo->prepare("SELECT id, file_url FROM builder_images WHERE user_id = ?");
    $imgStmt->execute([$user_id]);
    $trackedImages = $imgStmt->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($trackedImages)) {
        foreach ($trackedImages as $img) {
            // Jika URL gambar ada di dalam JSON halaman yang disimpan, tandai is_used = 1, jika tidak tandai 0
            $isUsed = (strpos($pageJson, $img['file_url']) !== false) ? 1 : 0;
            $upStmt = $pdo->prepare("UPDATE builder_images SET is_used = ? WHERE id = ?");
            $upStmt->execute([$isUsed, $img['id']]);
        }
    }
} catch (Exception $e) {
    // Fail-safe: jangan gagalkan proses simpan jika pencatatan gambar gagal
}

echo json_encode([
    'status'  => 'success',
    'message' => 'Halaman builder berhasil disimpan.',
], JSON_UNESCAPED_UNICODE);
?>
