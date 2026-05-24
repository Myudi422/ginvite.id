<?php
// ginvite/page/template_delete.php
// Deletes a builder template by ID

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php';

$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;

if (!$id) {
    // try to get from json body
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $id = isset($input['id']) ? (int)$input['id'] : 0;
}

if (!$id) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID template diperlukan.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM builder_templates WHERE id = ?");
    $stmt->execute([$id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Template berhasil dihapus.'
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Template tidak ditemukan atau sudah dihapus.'
        ], JSON_UNESCAPED_UNICODE);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Gagal menghapus template: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
