<?php
// ginvite/page/template_save.php
// Saves (create or update) a builder template JSON layout

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php';

function err($code, $msg) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    err(405, 'Method harus POST.');
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];

$id          = isset($input['id']) ? (int)$input['id'] : 0;
$name        = isset($input['name']) ? trim($input['name']) : '';
$eventType   = isset($input['event_type']) ? trim($input['event_type']) : 'pernikahan';
$textColor   = isset($input['text_color']) ? trim($input['text_color']) : '#000000';
$accentColor = isset($input['accent_color']) ? trim($input['accent_color']) : '#ec4899';
$imageTheme  = isset($input['image_theme']) ? trim($input['image_theme']) : '';
$pageData    = isset($input['page_data']) ? $input['page_data'] : null;

if ($name === '') {
    err(400, 'Nama template diperlukan.');
}

if (!$id && !$pageData) {
    err(400, 'Data halaman (page_data) kosong.');
}

try {
    $pageJson = is_array($pageData) ? json_encode($pageData, JSON_UNESCAPED_UNICODE) : $pageData;

    if ($id > 0) {
        // Edit template
        if ($pageData) {
            $sql = "UPDATE builder_templates 
                    SET name = ?, event_type = ?, text_color = ?, accent_color = ?, image_theme = ?, page_data = ?, updated_at = NOW()
                    WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$name, $eventType, $textColor, $accentColor, $imageTheme ?: null, $pageJson, $id]);
        } else {
            $sql = "UPDATE builder_templates 
                    SET name = ?, event_type = ?, text_color = ?, accent_color = ?, image_theme = ?, updated_at = NOW()
                    WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$name, $eventType, $textColor, $accentColor, $imageTheme ?: null, $id]);
        }
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Template berhasil diperbarui.',
            'id' => $id
        ], JSON_UNESCAPED_UNICODE);
    } else {
        // Create template
        $sql = "INSERT INTO builder_templates 
                (name, event_type, text_color, accent_color, image_theme, page_data, usage_count, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, 0, NOW(), NOW())";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $eventType, $textColor, $accentColor, $imageTheme ?: null, $pageJson]);
        $newId = $pdo->lastInsertId();
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Template berhasil dibuat.',
            'id' => (int)$newId
        ], JSON_UNESCAPED_UNICODE);
    }

} catch (PDOException $e) {
    err(500, 'Gagal menyimpan template: ' . $e->getMessage());
}
?>
