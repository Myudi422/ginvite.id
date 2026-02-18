<?php
// page/get_invitations.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

require __DIR__ . '/../db.php'; // pastikan db.php mendefinisikan $pdo

// Jika ini preflight request, langsung akhiri
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Ambil & validasi user_id dari query string (GET) atau JSON body (POST)
$user_id = null;
if (isset($_GET['user_id']) && is_numeric($_GET['user_id'])) {
    $user_id = (int)$_GET['user_id'];
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (isset($body['user_id']) && is_numeric($body['user_id'])) {
        $user_id = (int)$body['user_id'];
    }
}

if (!$user_id || $user_id <= 0) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Parameter user_id tidak valid',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Jika POST: proses edit undangan
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);

    $inv_id = isset($body['id']) && is_numeric($body['id']) ? (int)$body['id'] : null;
    $title = isset($body['title']) && is_string($body['title']) && trim($body['title']) !== ''
        ? trim($body['title'])
        : null;
    $status = isset($body['status']) && in_array($body['status'], [0, 1], true)
        ? (int)$body['status']
        : null;
    $event_date = isset($body['event_date']) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $body['event_date'])
        ? $body['event_date']
        : null;

    if (!$inv_id || $title === null || $status === null || $event_date === null) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Parameter wajib: user_id, id, title, status, event_date (YYYY-MM-DD)',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Cek kepemilikan undangan
    $check = $pdo->prepare("SELECT id FROM content_user WHERE id = ? AND user_id = ?");
    $check->execute([$inv_id, $user_id]);
    if (!$check->fetch()) {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Undangan tidak ditemukan atau bukan milik user ini',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Update undangan
    $upd = $pdo->prepare(
        "UPDATE content_user
         SET title = ?, status = ?, waktu_acara = ?
         WHERE id = ? AND user_id = ?"
    );
    $upd->execute([$title, $status, $event_date, $inv_id, $user_id]);

    if ($upd->rowCount() === 0) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Gagal mengubah data undangan.',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Ambil data terbaru dengan category_type
    $sql = <<<SQL
SELECT
    c.id,
    c.title,
    c.status,
    c.waktu_acara AS event_date,
    c.expired,
    t.image_theme AS avatar_url,
    ct.name AS category_type
FROM content_user AS c
JOIN theme AS t ON c.theme_id = t.id
JOIN category_type AS ct ON c.category_id = ct.id
WHERE c.id = ? AND c.user_id = ?
SQL;
    $stm = $pdo->prepare($sql);
    $stm->execute([$inv_id, $user_id]);
    $row = $stm->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $row,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Jika GET: ambil daftar undangan dengan category_type (owned + shared)
// Get user email first
$userEmailQuery = "SELECT email FROM users WHERE id = ?";
$userEmailStmt = $pdo->prepare($userEmailQuery);
$userEmailStmt->execute([$user_id]);
$userEmailResult = $userEmailStmt->fetch(PDO::FETCH_ASSOC);
$userEmail = $userEmailResult ? $userEmailResult['email'] : '';

$sql = <<<SQL
SELECT DISTINCT
    c.id,
    c.user_id,
    c.title,
    c.status,
    c.waktu_acara AS event_date,
    c.expired,
    t.image_theme AS avatar_url,
    ct.name AS category_type,
    CASE 
        WHEN c.user_id = ? THEN 'owner'
        ELSE 'shared'
    END as access_type
FROM content_user AS c
JOIN theme AS t ON c.theme_id = t.id
JOIN category_type AS ct ON c.category_id = ct.id
LEFT JOIN invitation_shares AS s ON c.id = s.invitation_id
WHERE c.user_id = ? 
   OR (s.shared_email = ? AND (s.can_edit = 1 OR s.can_manage = 1))
ORDER BY c.waktu_acara DESC
SQL;

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user_id, $user_id, $userEmail]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Tambahkan preview_url ke setiap item
    foreach ($rows as &$row) {
        $slugTitle = urlencode(strtolower(str_replace(' ', '-', $row['title'])));
        $row['preview_url'] = "undang/{$row['user_id']}/{$slugTitle}";
    }

    echo json_encode([
        'status' => 'success',
        'data' => $rows,
    ], JSON_UNESCAPED_UNICODE);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
exit;