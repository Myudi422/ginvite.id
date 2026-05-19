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
    // Auto-migrate: tambahkan kolom invitation_type jika belum ada
    try {
        $checkCol = $pdo->query("SHOW COLUMNS FROM invitation_shares LIKE 'invitation_type'");
        if (!$checkCol->fetch()) {
            $pdo->exec("ALTER TABLE invitation_shares ADD COLUMN invitation_type VARCHAR(20) DEFAULT 'legacy' AFTER invitation_id");
            $pdo->exec("ALTER TABLE invitation_shares DROP INDEX unique_share");
            $pdo->exec("ALTER TABLE invitation_shares ADD UNIQUE KEY unique_share (invitation_id, shared_email, invitation_type)");
        }
    } catch (Exception $e) {
        // Abaikan jika sudah ada atau ada error
    }

    // Cek apakah user adalah owner undangan di content_user
    $checkLegacy = $pdo->prepare("SELECT user_id FROM content_user WHERE id = ? AND user_id = ?");
    $checkLegacy->execute([$invitation_id, $owner_user_id]);
    $isLegacy = (bool)$checkLegacy->fetch();

    $isBuilder = false;
    if (!$isLegacy) {
        // Cek apakah user adalah owner undangan di builder_pages
        $checkBuilder = $pdo->prepare("SELECT user_id FROM builder_pages WHERE id = ? AND user_id = ?");
        $checkBuilder->execute([$invitation_id, $owner_user_id]);
        $isBuilder = (bool)$checkBuilder->fetch();
    }

    if (!$isLegacy && !$isBuilder) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Tidak memiliki akses untuk share undangan ini'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $invitation_type = $isBuilder ? 'builder' : 'legacy';

    // Insert invitation share
    $sql = "INSERT INTO invitation_shares (invitation_id, invitation_type, owner_user_id, shared_email, can_edit, can_manage) 
            VALUES (?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE can_edit = VALUES(can_edit), can_manage = VALUES(can_manage), updated_at = CURRENT_TIMESTAMP";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$invitation_id, $invitation_type, $owner_user_id, $shared_email, $can_edit, $can_manage]);

    echo json_encode(['status' => 'success', 'message' => 'Berhasil menambahkan akses'], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>