<?php
// rsmp_send.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php'; // sesuaikan path

function error($code, $msg) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error(405, 'Method harus POST.');
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];

$content_id = isset($input['content_id']) ? filter_var($input['content_id'], FILTER_VALIDATE_INT) : null;
$nama       = isset($input['nama'])       ? trim($input['nama'])                              : '';
$wa         = isset($input['wa'])         ? trim($input['wa'])                                : '';
$ucapan     = isset($input['ucapan'])     ? trim($input['ucapan'])                            : '';
$konfirmasi = isset($input['konfirmasi']) ? trim($input['konfirmasi'])                        : '';

if (
    $content_id === null || $content_id <= 0 ||
    $nama === '' ||
    $wa === '' ||
    $ucapan === '' ||
    !in_array($konfirmasi, ['hadir', 'tidak hadir'])
) {
    error(400, 'Parameter tidak valid. Diperlukan content_id, nama, wa, ucapan, konfirmasi.');
}

try {
    // Simpan ke tabel rsmp
    $stmt = $pdo->prepare("INSERT INTO rsmp (content_id, nama, wa, ucapan, konfirmasi) VALUES (?, ?, ?, ?, ?)");
    $ok   = $stmt->execute([$content_id, $nama, $wa, $ucapan, $konfirmasi]);
    if (!$ok) {
        error(500, 'Gagal menyimpan data RSVP.');
    }

    // Ambil setting notifikasi WA dari content_user
    $stmt2 = $pdo->prepare("SELECT content FROM content_user WHERE id = ?");
    $stmt2->execute([$content_id]);
    $row = $stmt2->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        echo json_encode([
            'status'  => 'success',
            'message' => 'Data tersimpan, tapi konfigurasi notifikasi tidak ditemukan.'
        ]);
        exit;
    }

    $content       = json_decode($row['content'], true) ?: [];
    $plugin        = $content['plugin'] ?? [];
    $waNotifActive = !empty($plugin['whatsapp_notif']);
    $waNumber      = $plugin['whatsapp_number'] ?? '';

    if (!$waNotifActive || !$waNumber) {
        echo json_encode([
            'status'  => 'success',
            'message' => 'Data tersimpan, tanpa notifikasi WA.'
        ]);
        exit;
    }

    // Kirim pesan WA via Fonnte
    $token   = 'UE2xWLvTjf3mXmTxgUP1'; // ganti ke .env jika diperlukan
    $message = "Hai, ada ucapan dari {$nama} ({$wa}): \"{$ucapan}\". Konfirmasi: {$konfirmasi}.";

    $curl = curl_init('https://api.fonnte.com/send');
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => [
            'target'  => $waNumber,
            'message' => $message
        ],
        CURLOPT_HTTPHEADER     => ["Authorization: {$token}"],
        CURLOPT_TIMEOUT        => 30,
    ]);

    $waResponse = curl_exec($curl);
    $waError    = curl_errno($curl) ? curl_error($curl) : null;
    curl_close($curl);

    if ($waError) {
        echo json_encode([
            'status'  => 'partial_success',
            'message' => 'Data tersimpan, gagal kirim WA: ' . $waError
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode([
        'status'      => 'success',
        'message'     => 'Data tersimpan dan notifikasi WA terkirim.',
        'wa_response' => $waResponse
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    error(500, 'Error server: ' . $e->getMessage());
}
