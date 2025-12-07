<?php
// page/remove_invitation_share.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

require __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (!in_array($_SERVER['REQUEST_METHOD'], ['DELETE', 'POST'])) {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$share_id = isset($body['share_id']) ? (int)$body['share_id'] : null;
$user_id = isset($body['user_id']) ? (int)$body['user_id'] : null;

if (!$share_id || !$user_id) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Data tidak lengkap'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Cek apakah user adalah owner dari share ini
    $checkOwner = $pdo->prepare("SELECT owner_user_id FROM invitation_shares WHERE id = ? AND owner_user_id = ?");
    $checkOwner->execute([$share_id, $user_id]);
    if (!$checkOwner->fetch()) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Tidak memiliki akses untuk menghapus share ini'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Delete share
    $sql = "DELETE FROM invitation_shares WHERE id = ? AND owner_user_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$share_id, $user_id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Berhasil menghapus akses'], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus akses'], JSON_UNESCAPED_UNICODE);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>