<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php';

function error($code, $msg) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg]);
    exit;
}

// Hanya terima POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error(405, 'Method harus POST.');
}

// Ambil JSON body
$input = json_decode(file_get_contents('php://input'), true) ?: [];

$nominal         = isset($input['nominal'])
    ? filter_var($input['nominal'], FILTER_VALIDATE_FLOAT)
    : null;
$contentUserId   = isset($input['user_id'])
    ? filter_var($input['user_id'], FILTER_VALIDATE_INT)
    : null;
$nama_pemberi    = isset($input['nama_pemberi'])
    ? trim($input['nama_pemberi'])
    : '';

if ($nominal === null || $nominal <= 0 || $contentUserId === null || $contentUserId <= 0 || $nama_pemberi === '') {
    error(400, 'Parameter tidak valid. Diperlukan: nominal (angka positif), user_id (content_user_id positif), nama_pemberi.');
}

try {
    // 1) Simpan ke bank_transfer
    $sql  = "INSERT INTO bank_transfer (nominal, content_user_id, nama_pemberi) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $ok   = $stmt->execute([$nominal, $contentUserId, $nama_pemberi]);

    if (!$ok) {
        error(500, 'Gagal menyimpan data transfer bank.');
    }

    // 2) Ambil data content_user untuk cek WA
    $stmt2 = $pdo->prepare("SELECT content FROM content_user WHERE id = ?");
    $stmt2->execute([$contentUserId]);
    $row = $stmt2->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        echo json_encode([
            'status'  => 'success',
            'message' => 'Transfer berhasil, namun content_user tidak ditemukan untuk notifikasi WA.'
        ]);
        exit;
    }

    // Parse JSON content
    $content = json_decode($row['content'], true);
    $plugin = $content['plugin'] ?? [];
    $whatsappNotif = $plugin['whatsapp_notif'] ?? false;
    $waNumber = $plugin['whatsapp_number'] ?? '';

    // Jika WA notif non-aktif atau nomor kosong, skip pengiriman WA
    if (!$whatsappNotif || !$waNumber) {
        echo json_encode([
            'status'  => 'success',
            'message' => 'Transfer berhasil, tanpa notifikasi WA.'
        ]);
        exit;
    }

    // 3) Kirim pesan via Fonnte
    $token = 'UE2xWLvTjf3mXmTxgUP1';
    $message = "Hai, papunda menginformasikan terkait tamu kamu {$nama_pemberi} mentransfer sebanyak Rp" .
               number_format($nominal, 0, ',', '.') . ".";

    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL            => 'https://api.fonnte.com/send',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS      => 10,
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST  => 'POST',
        CURLOPT_POSTFIELDS     => [
            'target'  => $waNumber,
            'message' => $message,
        ],
        CURLOPT_HTTPHEADER     => [
            "Authorization: $token"
        ],
    ]);

    $waResponse = curl_exec($curl);
    $waError    = curl_errno($curl) ? curl_error($curl) : null;
    curl_close($curl);

    if ($waError) {
        echo json_encode([
            'status'  => 'partial_success',
            'message' => 'Transfer tersimpan, tapi gagal kirim notifikasi WA: ' . $waError
        ]);
        exit;
    }

    // 4) Semua sukses
    echo json_encode([
        'status'  => 'success',
        'message' => 'Konfirmasi transfer bank berhasil disimpan dan notifikasi WA terkirim.',
        'wa_response' => $waResponse
    ]);

} catch (PDOException $e) {
    error(500, 'Terjadi kesalahan database: ' . $e->getMessage());
}
