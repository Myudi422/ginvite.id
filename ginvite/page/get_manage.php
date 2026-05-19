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
    $sql_content_user = "SELECT id, content FROM content_user WHERE user_id = ? AND title = ?";
    $stmt_content_user = $pdo->prepare($sql_content_user);
    $stmt_content_user->execute([$user_id, $title]);
    $content_user_data = $stmt_content_user->fetch(PDO::FETCH_ASSOC);

    $is_builder = false;
    if (!$content_user_data) {
        // Coba cari di builder_pages
        $sql_builder = "SELECT id, page_data AS content, event_type, page_title FROM builder_pages WHERE user_id = ? AND slug = ?";
        $stmt_builder = $pdo->prepare($sql_builder);
        $stmt_builder->execute([$user_id, $title]);
        $content_user_data = $stmt_builder->fetch(PDO::FETCH_ASSOC);
        if ($content_user_data) {
            $is_builder = true;
        } else {
            error(404, 'Data undangan tidak ditemukan.');
        }
    }

    $content_user_id  = $content_user_data['id'];
    $content_json_str = $content_user_data['content'] ?? '{}';
    $content_data     = json_decode($content_json_str, true);
    if (!is_array($content_data)) $content_data = [];

    // Deteksi tipe undangan
    if ($is_builder) {
        $invitation_type = $content_user_data['event_type'] ?? 'pernikahan';
        if ($invitation_type === 'custom') {
            $invitation_type = 'pernikahan';
        }
    } else {
        $invitation_type = 'pernikahan';
        $event_keys = isset($content_data['event']) ? array_keys($content_data['event']) : [];
        if (in_array('khitanan', $event_keys)) {
            $invitation_type = 'khitanan';
        } elseif (!empty($event_keys) && !in_array('resepsi', $event_keys) && !in_array('akad', $event_keys)) {
            // Event ada tapi bukan resepsi/akad -> kemungkinan khitanan
            $quote_cat = strtolower(isset($content_data['quoteCategory']) ? $content_data['quoteCategory'] : '');
            if ($quote_cat === 'khitanan') {
                $invitation_type = 'khitanan';
            }
        }
    }

    // Check access: owner or shared user with manage permission
    if ($current_user_email) {
        $checkOwner = $pdo->prepare("SELECT u.email FROM users u WHERE u.id = ?");
        $checkOwner->execute([$user_id]);
        $owner = $checkOwner->fetch();

        $hasAccess = false;
        if ($owner && $owner['email'] === $current_user_email) {
            $hasAccess = true;
        } else {
            $checkShare = $pdo->prepare("
                SELECT can_manage
                FROM invitation_shares
                WHERE invitation_id = ? AND shared_email = ? AND invitation_type = ?
            ");
            $checkShare->execute([$content_user_id, $current_user_email, $is_builder ? 'builder' : 'legacy']);
            $share = $checkShare->fetch();
            if ($share && $share['can_manage']) {
                $hasAccess = true;
            }
        }

        if (!$hasAccess) {
            error(403, 'Anda tidak memiliki akses untuk mengelola undangan ini.');
        }
    }

    $QR = false;

    if (json_last_error() === JSON_ERROR_NONE) {
        if (isset($content_data['plugin']['qrcode']) && $content_data['plugin']['qrcode'] === true) {
            $QR = true;
        }
        $dibayar_value  = isset($content_data['dibayar'])           ? $content_data['dibayar']           : 0;
        $qrcode_enabled = isset($content_data['plugin']['qrcode'])  ? $content_data['plugin']['qrcode']  : false;
        if ($qrcode_enabled && ($dibayar_value !== 0 && $dibayar_value !== 40000)) {
            $QR = true;
        }
    }

    // Jumlah hadir / tidak hadir
    $stmt = $pdo->prepare("
        SELECT
            SUM(CASE WHEN konfirmasi = 'hadir' THEN 1 ELSE 0 END)       AS jumlah_hadir,
            SUM(CASE WHEN konfirmasi = 'tidak hadir' THEN 1 ELSE 0 END) AS jumlah_tidak_hadir
        FROM rsmp WHERE content_id = ?
    ");
    $stmt->execute([$content_user_id]);
    $rsmp = $stmt->fetch(PDO::FETCH_ASSOC);
    $jumlah_hadir       = isset($rsmp['jumlah_hadir'])       ? $rsmp['jumlah_hadir']       : 0;
    $jumlah_tidak_hadir = isset($rsmp['jumlah_tidak_hadir']) ? $rsmp['jumlah_tidak_hadir'] : 0;

    // Total nominal bank transfer
    $stmt = $pdo->prepare("SELECT SUM(nominal) AS total_nominal FROM bank_transfer WHERE content_user_id = ?");
    $stmt->execute([$content_user_id]);
    $bt = $stmt->fetch(PDO::FETCH_ASSOC);
    $total_nominal = isset($bt['total_nominal']) ? $bt['total_nominal'] : 0;

    // View count
    if ($is_builder) {
        $view_data = 0;
    } else {
        $stmt = $pdo->prepare("SELECT view FROM content_user WHERE id = ?");
        $stmt->execute([$content_user_id]);
        $vr = $stmt->fetch(PDO::FETCH_ASSOC);
        $view_data = isset($vr['view']) ? $vr['view'] : null;
    }

    echo json_encode([
        'status' => 'success',
        'data' => [
            'id_content_user'            => $content_user_id,
            'invitation_type'            => $invitation_type,
            'view'                       => $view_data,
            'total_nominal_bank_transfer'=> (float)$total_nominal,
            'jumlah_konfirmasi'          => [
                'hadir'       => (int)$jumlah_hadir,
                'tidak_hadir' => (int)$jumlah_tidak_hadir,
            ],
            'QR' => $QR,
            'source'                     => $is_builder ? 'builder' : 'legacy',
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    error(500, 'Terjadi kesalahan database: ' . $e->getMessage());
}
?>