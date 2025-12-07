<?php
// get_rsmp.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php';  // sesuaikan path ke koneksi database

function sendError(int $code, string $message) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError(405, 'Method harus GET.');
}

// Ambil dan validasi content_id
$content_id = isset($_GET['content_id'])
    ? filter_var($_GET['content_id'], FILTER_VALIDATE_INT)
    : null;

if (!$content_id || $content_id <= 0) {
    sendError(400, 'Parameter tidak valid. Diperlukan: content_id (angka positif).');
}

try {
    // Query RSVP berdasarkan content_id
    $stmt = $pdo->prepare("
        SELECT nama, wa, ucapan, konfirmasi, created_at
        FROM rsmp
        WHERE content_id = ?
        ORDER BY created_at DESC
    ");
    $stmt->execute([$content_id]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data'   => $results
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    sendError(500, 'Kesalahan database: ' . $e->getMessage());
}
