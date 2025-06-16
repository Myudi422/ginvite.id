<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

require __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$user_id = isset($body['user_id']) && is_numeric($body['user_id']) ? (int)$body['user_id'] : null;
$id = isset($body['id']) && is_numeric($body['id']) ? (int)$body['id'] : null;

if (!$user_id || !$id) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Parameter user_id dan id wajib diisi',
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

// Pastikan undangan milik user
$stmt = $pdo->prepare("SELECT id FROM content_user WHERE id = ? AND user_id = ?");
$stmt->execute([$id, $user_id]);
if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode([
        'status' => 'error',
        'message' => 'Undangan tidak ditemukan atau bukan milik user',
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

// Hapus undangan
$del = $pdo->prepare("DELETE FROM content_user WHERE id = ? AND user_id = ?");
$del->execute([$id, $user_id]);
if ($del->rowCount() > 0) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Undangan berhasil dihapus',
    ], JSON_UNESCAPED_SLASHES);
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Gagal menghapus undangan',
    ], JSON_UNESCAPED_SLASHES);
}
exit;
