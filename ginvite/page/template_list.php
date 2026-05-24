<?php
// ginvite/page/template_list.php
// Returns the list of advanced JSON templates for the builder

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php';

$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$categoriesStr = isset($_GET['categories']) ? trim($_GET['categories']) : '';
$sort = isset($_GET['sort']) ? trim($_GET['sort']) : 'usage';

try {
    $where = [];
    $params = [];

    if ($search !== '') {
        $where[] = 'name LIKE ?';
        $params[] = '%' . $search . '%';
    }

    if ($categoriesStr !== '') {
        $cats = explode(',', $categoriesStr);
        $inQuery = implode(',', array_fill(0, count($cats), '?'));
        $where[] = 'event_type IN (' . $inQuery . ')';
        foreach ($cats as $c) {
            $params[] = trim($c);
        }
    }

    $sql = "SELECT id, name, event_type, text_color, accent_color, image_theme, usage_count, created_at, updated_at FROM builder_templates";
    if (!empty($where)) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }

    if ($sort === 'latest') {
        $sql .= ' ORDER BY id DESC';
    } else {
        $sql .= ' ORDER BY usage_count DESC, id DESC';
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format output
    $formatted = [];
    foreach ($rows as $row) {
        $formatted[] = [
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'event_type' => $row['event_type'],
            'text_color' => $row['text_color'],
            'accent_color' => $row['accent_color'],
            'image_theme' => $row['image_theme'] ?: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&auto=format&fit=crop',
            'usage_count' => (int)$row['usage_count'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at']
        ];
    }

    echo json_encode([
        'status' => 'success',
        'data' => $formatted
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Gagal mengambil daftar template: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
