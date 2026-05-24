<?php
// ginvite/page/template_get.php
// Returns a single template JSON page data by ID

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if (!$id) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID template diperlukan.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM builder_templates WHERE id = ? LIMIT 1");
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Template tidak ditemukan.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $pageData = json_decode($row['page_data'], true);
    if (!$pageData) {
        $pageData = [];
    }

    // Merge meta fields
    $pageData['id']          = (int)$row['id'];
    $pageData['template_id'] = (int)$row['id'];
    $pageData['name']        = $row['name'];
    $pageData['event_type']  = $row['event_type'];
    $pageData['image_theme'] = $row['image_theme'];
    $pageData['text_color']  = $row['text_color'];
    $pageData['accent_color']= $row['accent_color'];

    echo json_encode([
        'status' => 'success',
        'data' => $pageData
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Gagal mengambil data template: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
