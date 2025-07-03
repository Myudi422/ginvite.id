<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/db.php';

function log_wa_update($msg) {
    file_put_contents(__DIR__ . '/update_wa.log', date('[Y-m-d H:i:s] ') . $msg . PHP_EOL, FILE_APPEND);
}

$input = json_decode(file_get_contents('php://input'), true);
$user_id = isset($input['user_id']) ? (int)$input['user_id'] : 0;
$nomor_wa = isset($input['nomor_wa']) ? trim($input['nomor_wa']) : '';

log_wa_update("Input: " . json_encode($input));

if (!$user_id || !$nomor_wa) {
    log_wa_update("Error: user_id atau nomor_wa kosong");
    echo json_encode(['status' => 'error', 'message' => 'user_id dan nomor_wa diperlukan']);
    exit;
}

// Validasi sederhana nomor WA
if (!preg_match('/^08[0-9]{8,12}$/', $nomor_wa)) {
    log_wa_update("Error: Format nomor WA tidak valid ($nomor_wa)");
    echo json_encode(['status' => 'error', 'message' => 'Format nomor WA tidak valid']);
    exit;
}

$stmt = $pdo->prepare("UPDATE users SET nomor_wa = ? WHERE id = ?");
if ($stmt->execute([$nomor_wa, $user_id])) {
    log_wa_update("SUKSES update user_id=$user_id nomor_wa=$nomor_wa");
    echo json_encode(['status' => 'ok']);
} else {
    $err = $stmt->errorInfo();
    log_wa_update("DB ERROR: " . json_encode($err));
    echo json_encode(['status' => 'error', 'message' => 'Gagal update nomor WA']);
}
