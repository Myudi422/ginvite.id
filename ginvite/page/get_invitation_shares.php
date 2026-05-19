<?php
// page/get_invitation_shares.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

require __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$invitation_id = isset($_GET['invitation_id']) ? (int)$_GET['invitation_id'] : null;
$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;

if (!$invitation_id || !$user_id) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Parameter tidak lengkap'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Cek apakah user adalah owner undangan di content_user
    $checkLegacy = $pdo->prepare("SELECT user_id FROM content_user WHERE id = ? AND user_id = ?");
    $checkLegacy->execute([$invitation_id, $user_id]);
    $isLegacy = (bool)$checkLegacy->fetch();

    $isBuilder = false;
    if (!$isLegacy) {
        $checkBuilder = $pdo->prepare("SELECT user_id FROM builder_pages WHERE id = ? AND user_id = ?");
        $checkBuilder->execute([$invitation_id, $user_id]);
        $isBuilder = (bool)$checkBuilder->fetch();
    }

    if (!$isLegacy && !$isBuilder) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Tidak memiliki akses'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $invitation_type = $isBuilder ? 'builder' : 'legacy';

    // Get shared users for this invitation
    $sql = "SELECT id, shared_email, can_edit, can_manage, created_at 
            FROM invitation_shares 
            WHERE invitation_id = ? AND invitation_type = ? AND owner_user_id = ? 
            ORDER BY created_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$invitation_id, $invitation_type, $user_id]);
    $shares = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'data' => $shares], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>