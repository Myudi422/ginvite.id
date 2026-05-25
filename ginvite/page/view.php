<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require __DIR__ . '/../db.php';

function error($code, $msg) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

// Baca raw JSON body
$body = file_get_contents('php://input');
$data = json_decode($body, true);

if (!isset($data['content_user_id']) || !is_numeric($data['content_user_id'])) {
    error(400, 'Field content_user_id (numeric) dibutuhkan.');
}

$content_user_id = (int) $data['content_user_id'];
$invitation_type = isset($data['invitation_type']) ? trim($data['invitation_type']) : 'legacy';

try {
    if ($invitation_type === 'builder') {
        // 1) Tambah view di builder_pages
        $upd = "UPDATE builder_pages
                SET view = COALESCE(view,0) + 1
                WHERE id = ?";
        $stmt = $pdo->prepare($upd);
        $stmt->execute([$content_user_id]);

        if ($stmt->rowCount() === 0) {
            error(404, 'Record builder_pages dengan id tersebut tidak ditemukan.');
        }

        // 2) (Opsional) ambil view terbaru
        $sel = "SELECT view FROM builder_pages WHERE id = ? LIMIT 1";
        $stmt2 = $pdo->prepare($sel);
        $stmt2->execute([$content_user_id]);
        $view = $stmt2->fetchColumn();
    } else {
        // 1) Tambah view di content_user (legacy)
        $upd = "UPDATE content_user
                SET view = COALESCE(view,0) + 1
                WHERE id = ?";
        $stmt = $pdo->prepare($upd);
        $stmt->execute([$content_user_id]);

        if ($stmt->rowCount() === 0) {
            error(404, 'Record dengan id tersebut tidak ditemukan.');
        }

        // 2) (Opsional) ambil view terbaru
        $sel = "SELECT view FROM content_user WHERE id = ? LIMIT 1";
        $stmt2 = $pdo->prepare($sel);
        $stmt2->execute([$content_user_id]);
        $view = $stmt2->fetchColumn();
    }

    echo json_encode([
        'status'           => 'success',
        'content_user_id'  => $content_user_id,
        'view'             => (int) $view,
        'invitation_type'  => $invitation_type
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    error(500, 'Kesalahan database: ' . $e->getMessage());
}
