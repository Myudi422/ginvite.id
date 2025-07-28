<?php
// page/toggle_status.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

require __DIR__ . '/../db.php';
require __DIR__ . '/../../../../vendor/autoload.php';

// Konfigurasi Midtrans
\Midtrans\Config::$serverKey = 'Mid-server-lznd51okcQRKsqxVcokhkpS0'; // Ganti dengan server key Anda
\Midtrans\Config::$isProduction = true;

function error($code, $msg) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_UNESCAPED_SLASHES);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];

$user_id = (int)($input['user_id'] ?? 0);
$inv_id  = (int)($input['id']      ?? 0);
$title   = trim($input['title']   ?? '');
$newStatus = isset($input['status']) ? (int)$input['status'] : null;

if (!$user_id || !$inv_id || $title === '' || $newStatus === null || !in_array($newStatus, [0, 1], true)) {
    error(400, 'Parameter tidak valid. Diperlukan: user_id(int), id(int), title(string), status(0 atau 1) di body.');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error(405, 'Method harus POST.');
}

$sql = "UPDATE content_user SET status = ?, updated_at = NOW()
            WHERE user_id = ? AND id = ? AND title = ?";
$stmt = $pdo->prepare($sql);
$ok = $stmt->execute([$newStatus, $user_id, $inv_id, $title]);

if (!$ok) {
    error(500, 'Gagal mengubah status.');
}

echo json_encode([
    'status'  => 'success',
    'message' => 'Status berhasil diubah.',
    'data'    => ['status'=>$newStatus]
]);
?>