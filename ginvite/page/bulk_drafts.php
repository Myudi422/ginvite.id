<?php
// page/bulk_drafts.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php';

function error($code, $msg) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// Get parameters based on method
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $user_id = (int)($input['user_id'] ?? 0);
    $invitation_title = trim($input['invitation_title'] ?? '');
} else {
    $user_id = (int)($_GET['user_id'] ?? 0);
    $invitation_title = trim($_GET['invitation_title'] ?? '');
}

if (!$user_id || !$invitation_title) {
    error(400, 'Parameter user_id dan invitation_title diperlukan');
}

try {
    if ($method === 'POST') {
        // Save draft (input sudah di-decode di atas)
        $names_list = $input['names_list'] ?? '';
        $template_text = $input['template_text'] ?? '';
        $checklist_data = $input['checklist_data'] ?? '';
        
        // Check if record exists
        $checkSql = "SELECT id FROM bulk_invitations WHERE user_id = ? AND invitation_title = ?";
        $checkStmt = $pdo->prepare($checkSql);
        $checkStmt->execute([$user_id, $invitation_title]);
        $exists = $checkStmt->fetch();
        
        if ($exists) {
            // Update existing record
            $sql = "UPDATE bulk_invitations 
                    SET names_list = ?, template_text = ?, checklist_data = ?, updated_at = CURRENT_TIMESTAMP 
                    WHERE user_id = ? AND invitation_title = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$names_list, $template_text, $checklist_data, $user_id, $invitation_title]);
        } else {
            // Insert new record
            $sql = "INSERT INTO bulk_invitations (user_id, invitation_title, names_list, template_text, checklist_data) 
                    VALUES (?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$user_id, $invitation_title, $names_list, $template_text, $checklist_data]);
        }
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Draft berhasil disimpan'
        ], JSON_UNESCAPED_UNICODE);
        
    } else if ($method === 'GET') {
        // Load draft
        $sql = "SELECT names_list, template_text, checklist_data, updated_at 
                FROM bulk_invitations 
                WHERE user_id = ? AND invitation_title = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user_id, $invitation_title]);
        $draft = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($draft) {
            echo json_encode([
                'status' => 'success',
                'data' => $draft
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode([
                'status' => 'success',
                'data' => null
            ], JSON_UNESCAPED_UNICODE);
        }
    }
    
} catch (PDOException $e) {
    error(500, 'Database error: ' . $e->getMessage());
}
?>