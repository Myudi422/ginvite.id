<?php
// page/add_invitation_share.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

require __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$invitation_id = isset($body['invitation_id']) ? (int)$body['invitation_id'] : null;
$owner_user_id = isset($body['owner_user_id']) ? (int)$body['owner_user_id'] : null;
$shared_email = isset($body['shared_email']) ? trim($body['shared_email']) : null;
$can_edit = isset($body['can_edit']) ? (int)$body['can_edit'] : 1;
$can_manage = isset($body['can_manage']) ? (int)$body['can_manage'] : 1;

if (!$invitation_id || !$owner_user_id || !$shared_email) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Data tidak lengkap'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!filter_var($shared_email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Format email tidak valid'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Cek apakah user adalah owner undangan
    $checkOwner = $pdo->prepare("SELECT user_id FROM content_user WHERE id = ? AND user_id = ?");
    $checkOwner->execute([$invitation_id, $owner_user_id]);
    if (!$checkOwner->fetch()) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Tidak memiliki akses untuk share undangan ini'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Insert invitation share
    $sql = "INSERT INTO invitation_shares (invitation_id, owner_user_id, shared_email, can_edit, can_manage) 
            VALUES (?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE can_edit = VALUES(can_edit), can_manage = VALUES(can_manage), updated_at = CURRENT_TIMESTAMP";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$invitation_id, $owner_user_id, $shared_email, $can_edit, $can_manage]);

    echo json_encode(['status' => 'success', 'message' => 'Berhasil menambahkan akses'], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>