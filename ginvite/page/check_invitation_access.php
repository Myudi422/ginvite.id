<?php
// page/check_invitation_access.php
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
$user_email = isset($_GET['user_email']) ? trim($_GET['user_email']) : null;
$access_type = isset($_GET['access_type']) ? $_GET['access_type'] : 'edit'; // 'edit' or 'manage'

if (!$invitation_id || !$user_email) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Parameter tidak lengkap'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Check if user is owner
    $checkOwner = $pdo->prepare("
        SELECT c.user_id 
        FROM content_user c 
        JOIN users u ON c.user_id = u.id 
        WHERE c.id = ? AND u.email = ?
    ");
    $checkOwner->execute([$invitation_id, $user_email]);
    $owner = $checkOwner->fetch();
    
    if ($owner) {
        echo json_encode([
            'status' => 'success', 
            'access' => true, 
            'access_type' => 'owner',
            'can_edit' => true,
            'can_manage' => true
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Check if user has shared access
    $checkShare = $pdo->prepare("
        SELECT can_edit, can_manage 
        FROM invitation_shares 
        WHERE invitation_id = ? AND shared_email = ?
    ");
    $checkShare->execute([$invitation_id, $user_email]);
    $share = $checkShare->fetch();
    
    if ($share) {
        $has_access = ($access_type === 'edit' && $share['can_edit']) || 
                      ($access_type === 'manage' && $share['can_manage']);
        
        echo json_encode([
            'status' => 'success', 
            'access' => $has_access,
            'access_type' => 'shared',
            'can_edit' => (bool)$share['can_edit'],
            'can_manage' => (bool)$share['can_manage']
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            'status' => 'success', 
            'access' => false,
            'access_type' => 'none',
            'can_edit' => false,
            'can_manage' => false
        ], JSON_UNESCAPED_UNICODE);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>