<?php
// page/get_usermanage.php

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
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_UNESCAPED_SLASHES);
    exit;
}

$user_id = (int)($_GET['user_id'] ?? 0);
$title   = trim($_GET['title'] ?? '');

if (!$user_id || $title === '') {
    error(400, 'Parameter tidak valid. Diperlukan: user_id(int), title(string) di URL.');
}

try {
    // Ambil id dari tabel content_user
    $sql_content_user = "SELECT id FROM content_user WHERE user_id = ? AND title = ?";
    $stmt_content_user = $pdo->prepare($sql_content_user);
    $stmt_content_user->execute([$user_id, $title]);
    $content_user_data = $stmt_content_user->fetch(PDO::FETCH_ASSOC);
    
    if (!$content_user_data) {
        error(404, 'Data content_user tidak ditemukan.');
    }
    
    $content_user_id = $content_user_data['id'];
    
    // Pagination: maksimal 20 data per halaman untuk masing-masing tabel
    $limit = 20;
    $rsvp_page = isset($_GET['rsvp_page']) ? (int)$_GET['rsvp_page'] : 1;
    $transfer_page = isset($_GET['transfer_page']) ? (int)$_GET['transfer_page'] : 1;
    $qr_attendance_page = isset($_GET['qr_attendance_page']) ? (int)$_GET['qr_attendance_page'] : 1;
    $offset_rsvp = ($rsvp_page - 1) * $limit;
    $offset_transfer = ($transfer_page - 1) * $limit;
    $offset_qr_attendance = ($qr_attendance_page - 1) * $limit;
    
    // Query untuk tabel rsmp (RSVP) dengan pagination
    $sql_rsmp = "SELECT * FROM rsmp WHERE content_id = ? LIMIT ? OFFSET ?";
    $stmt_rsmp = $pdo->prepare($sql_rsmp);
    $stmt_rsmp->bindValue(1, $content_user_id, PDO::PARAM_INT);
    $stmt_rsmp->bindValue(2, $limit, PDO::PARAM_INT);
    $stmt_rsmp->bindValue(3, $offset_rsvp, PDO::PARAM_INT);
    $stmt_rsmp->execute();
    $rsmp_data = $stmt_rsmp->fetchAll(PDO::FETCH_ASSOC);
    
    // Query untuk tabel bank_transfer dengan pagination
    $sql_bank_transfer = "SELECT * FROM bank_transfer WHERE content_user_id = ? LIMIT ? OFFSET ?";
    $stmt_bank_transfer = $pdo->prepare($sql_bank_transfer);
    $stmt_bank_transfer->bindValue(1, $content_user_id, PDO::PARAM_INT);
    $stmt_bank_transfer->bindValue(2, $limit, PDO::PARAM_INT);
    $stmt_bank_transfer->bindValue(3, $offset_transfer, PDO::PARAM_INT);
    $stmt_bank_transfer->execute();
    $bank_transfer_data = $stmt_bank_transfer->fetchAll(PDO::FETCH_ASSOC);
    
    // Query untuk tabel attendance dengan pagination
    $sql_qr_attendance = "SELECT * FROM attendance WHERE content_id = ? LIMIT ? OFFSET ?";
    $stmt_qr_attendance = $pdo->prepare($sql_qr_attendance);
    $stmt_qr_attendance->bindValue(1, $content_user_id, PDO::PARAM_INT);
    $stmt_qr_attendance->bindValue(2, $limit, PDO::PARAM_INT);
    $stmt_qr_attendance->bindValue(3, $offset_qr_attendance, PDO::PARAM_INT);
    $stmt_qr_attendance->execute();
    $qr_attendance_data = $stmt_qr_attendance->fetchAll(PDO::FETCH_ASSOC);
    
    // Query agregat total nominal dari bank_transfer (seluruh data tanpa pagination)
    $sql_total_nominal = "SELECT IFNULL(SUM(nominal),0) as total_nominal FROM bank_transfer WHERE content_user_id = ?";
    $stmt_total_nominal = $pdo->prepare($sql_total_nominal);
    $stmt_total_nominal->execute([$content_user_id]);
    $total_nominal_data = $stmt_total_nominal->fetch(PDO::FETCH_ASSOC);
    $total_nominal = $total_nominal_data['total_nominal'] ?? 0;
    
    // Query agregat untuk menghitung total RSVP, hadir, dan tidak hadir
    $sql_rsvp_counts = "
        SELECT 
            COUNT(*) AS total,
            SUM(CASE WHEN konfirmasi = 'hadir' THEN 1 ELSE 0 END) AS hadir,
            SUM(CASE WHEN konfirmasi = 'tidak hadir' THEN 1 ELSE 0 END) AS tidak_hadir
        FROM rsmp
        WHERE content_id = ?
    ";
    $stmt_rsvp_counts = $pdo->prepare($sql_rsvp_counts);
    $stmt_rsvp_counts->execute([$content_user_id]);
    $rsvp_counts = $stmt_rsvp_counts->fetch(PDO::FETCH_ASSOC);
    
    // Query untuk menghitung total QR attendance (tanpa pagination)
    $sql_qr_attendance_total = "SELECT COUNT(*) as total FROM attendance WHERE content_id = ?";
    $stmt_qr_attendance_total = $pdo->prepare($sql_qr_attendance_total);
    $stmt_qr_attendance_total->execute([$content_user_id]);
    $qr_attendance_total_data = $stmt_qr_attendance_total->fetch(PDO::FETCH_ASSOC);
    $qr_attendance_total = $qr_attendance_total_data['total'] ?? 0;
    
    $response = [
        'status' => 'success',
        'data' => [
            'content_user'  => $content_user_data,
            'rsmp'          => $rsmp_data,
            'bank_transfer' => $bank_transfer_data,
            'qr_attendance' => $qr_attendance_data,
            'qr_attendance_total' => $qr_attendance_total, // Add total count to response
            'pagination'    => [
                'rsvp_page'     => $rsvp_page,
                'transfer_page' => $transfer_page,
                'qr_attendance_page' => $qr_attendance_page,
                'limit'         => $limit,
            ],
            'aggregates'    => [
                'bank_transfer_total_nominal' => $total_nominal,
                'rsvp_counts' => $rsvp_counts
            ]
        ]
    ];
    
    echo json_encode($response, JSON_UNESCAPED_SLASHES);
    
} catch (PDOException $e) {
    error(500, 'Terjadi kesalahan database: ' . $e->getMessage());
}
?>