<?php
// page/get_manage.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php';

function error($code, $msg) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

$user_id = (int)($_GET['user_id'] ?? 0);
$title   = trim($_GET['title'] ?? '');
$current_user_email = trim($_GET['current_user_email'] ?? '');

if (!$user_id || $title === '') {
    error(400, 'Parameter tidak valid. Diperlukan: user_id(int), title(string) di URL.');
}

try {
    // Query untuk mendapatkan 'id' dan 'content' dari tabel content_user berdasarkan user_id dan title
    $sql_content_user = "
        SELECT id, content
        FROM content_user
        WHERE user_id = ? AND title = ?
    ";
    $stmt_content_user = $pdo->prepare($sql_content_user);
    $stmt_content_user->execute([$user_id, $title]);
    $content_user_data = $stmt_content_user->fetch(PDO::FETCH_ASSOC);

    if (!$content_user_data) {
        error(404, 'Data content_user tidak ditemukan.');
    }

    $content_user_id = $content_user_data['id'];
    
    // Check access: owner or shared user with manage permission
    if ($current_user_email) {
        // Check if user is owner
        $checkOwner = $pdo->prepare("SELECT u.email FROM users u WHERE u.id = ?");
        $checkOwner->execute([$user_id]);
        $owner = $checkOwner->fetch();
        
        $hasAccess = false;
        if ($owner && $owner['email'] === $current_user_email) {
            // User is owner
            $hasAccess = true;
        } else {
            // Check if user has shared access with manage permission
            $checkShare = $pdo->prepare("
                SELECT can_manage 
                FROM invitation_shares 
                WHERE invitation_id = ? AND shared_email = ?
            ");
            $checkShare->execute([$content_user_id, $current_user_email]);
            $share = $checkShare->fetch();
            
            if ($share && $share['can_manage']) {
                $hasAccess = true;
            }
        }
        
        if (!$hasAccess) {
            error(403, 'Anda tidak memiliki akses untuk mengelola undangan ini.');
        }
    }
    // If no current_user_email provided, allow access (backward compatibility)
    
    $content_json_string = $content_user_data['content'] ?? '{}'; // Get content and default to empty JSON object

    // Initialize QR to false
    $QR = false;

    // Decode the content JSON
    $content_data = json_decode($content_json_string, true);

    // Check if JSON decoding was successful and necessary keys exist
    if (json_last_error() === JSON_ERROR_NONE) {
        $is_qrcode_enabled = false;
        if (isset($content_data['plugin']) && isset($content_data['plugin']['qrcode'])) {
            $is_qrcode_enabled = $content_data['plugin']['qrcode'] === true;
        }

        // Get 'dibayar' value from the top level of the content JSON
        $dibayar_value = $content_data['dibayar'] ?? 0;

        // Set QR to true only if qrcode is enabled AND dibayar is not 0 or 40000
        if ($is_qrcode_enabled && ($dibayar_value !== 0 && $dibayar_value !== 40000)) {
            $QR = true;
        }
    }

    // Query untuk menghitung jumlah yang hadir dan tidak hadir dari tabel rsmp
    $sql_rsmp_count = "
        SELECT
            SUM(CASE WHEN konfirmasi = 'hadir' THEN 1 ELSE 0 END) AS jumlah_hadir,
            SUM(CASE WHEN konfirmasi = 'tidak hadir' THEN 1 ELSE 0 END) AS jumlah_tidak_hadir
        FROM rsmp
        WHERE content_id = ?
    ";
    $stmt_rsmp_count = $pdo->prepare($sql_rsmp_count);
    $stmt_rsmp_count->execute([$content_user_id]);
    $rsmp_count_data = $stmt_rsmp_count->fetch(PDO::FETCH_ASSOC);

    $jumlah_hadir = $rsmp_count_data['jumlah_hadir'] ?? 0;
    $jumlah_tidak_hadir = $rsmp_count_data['jumlah_tidak_hadir'] ?? 0;

    // Query untuk menjumlahkan nominal dari tabel bank_transfer berdasarkan id dari content_user
    $sql_bank_transfer = "
        SELECT SUM(nominal) AS total_nominal
        FROM bank_transfer
        WHERE content_user_id = ?
    ";
    $stmt_bank_transfer = $pdo->prepare($sql_bank_transfer);
    $stmt_bank_transfer->execute([$content_user_id]);
    $bank_transfer_result = $stmt_bank_transfer->fetch(PDO::FETCH_ASSOC);

    $total_nominal = $bank_transfer_result['total_nominal'] ?? 0;

    // Query untuk mendapatkan nilai 'view' dari tabel content_user
    $sql_view = "
        SELECT view
        FROM content_user
        WHERE id = ?
    ";
    $stmt_view = $pdo->prepare($sql_view);
    $stmt_view->execute([$content_user_id]);
    $view_result = $stmt_view->fetch(PDO::FETCH_ASSOC);
    $view_data = $view_result['view'] ?? null;

    $response = [
        'status' => 'success',
        'data' => [
            'id_content_user' => $content_user_id,
            'view' => $view_data,
            'total_nominal_bank_transfer' => (float)$total_nominal,
            'jumlah_konfirmasi' => [
                'hadir' => (int)$jumlah_hadir,
                'tidak_hadir' => (int)$jumlah_tidak_hadir
            ],
            'QR' => $QR // Added the QR variable here
        ]
    ];

    echo json_encode($response, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    error(500, 'Terjadi kesalahan database: ' . $e->getMessage());
}
?>