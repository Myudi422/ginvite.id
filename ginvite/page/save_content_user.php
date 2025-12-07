<?php
// Pastikan kolom `kategory_theme_id` sudah ditambahkan di database:
// ALTER TABLE content_user ADD COLUMN kategory_theme_id INT NULL AFTER theme_id;

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error(405, 'Method harus POST.');
}

$input             = json_decode(file_get_contents('php://input'), true) ?: [];
$user_id           = isset($input['user_id']) ? (int)$input['user_id'] : 0;
$inv_id            = isset($input['id']) ? (int)$input['id'] : 0;
$title             = isset($input['title']) ? trim($input['title']) : '';
$theme_id          = isset($input['theme_id']) ? (int)$input['theme_id'] : null;
$category_theme_id = isset($input['kategory_theme_id']) ? (int)$input['kategory_theme_id'] : null;
$contentRaw        = isset($input['content']) ? $input['content'] : '';

if (!$user_id || !$inv_id || $title === '' || $contentRaw === '') {
    error(400, 'Parameter tidak valid. user_id, id, title, content diperlukan.');
}

// Decode content JSON
$contentArr = json_decode($contentRaw, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    error(400, 'Format content JSON tidak valid.');
}

// Validasi jika saved kosong
if (isset($contentArr['saved']) && is_array($contentArr['saved']) && count($contentArr['saved']) === 0) {
    error(400, 'Field "saved" tidak boleh kosong.');
}

// Hapus title supaya tidak masuk ke content
unset($contentArr['title']);
// Jika di dalam event masih ada title, hapus juga
if (isset($contentArr['event']['title'])) {
    unset($contentArr['event']['title']);
}

// Hitung total pembayaran
$sql = "SELECT COALESCE(SUM(jumlah), 0) AS total_paid
        FROM payment
        WHERE id_user = ?
          AND id_content = ?
          AND status = 'settlement'";
$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id, $inv_id]);
$totalPaid = (float)$stmt->fetchColumn();

// Pastikan jumlah target ada
if (!isset($contentArr['jumlah'])) {
    error(500, 'Field "jumlah" tidak ada di content.');
}
$contentArr['dibayar'] = $totalPaid;

// Tentukan status baru berdasarkan gift/whatsapp_notif dan pembayaran
$isGift     = !empty($contentArr['plugin']['gift']);
$isWhatsapp = !empty($contentArr['plugin']['whatsapp_notif']);
if (($isGift || $isWhatsapp) && $totalPaid < (float)$contentArr['jumlah']) {
    $newStatus = 0;
} elseif ($totalPaid >= (float)$contentArr['jumlah']) {
    $newStatus = 1;
} else {
    $newStatus = 0;
}

// Encode content kembali ke JSON
$contentFinal = json_encode($contentArr, JSON_UNESCAPED_UNICODE);

// Susun query UPDATE
$sqlParts = [
    "UPDATE content_user SET title = ?, content = ?, status = ?"
];
$params = [$title, $contentFinal, $newStatus];

if ($theme_id !== null) {
    $sqlParts[] = "theme_id = ?";
    $params[]   = $theme_id;
}
if ($category_theme_id !== null) {
    $sqlParts[] = "kategory_theme_id = ?";
    $params[]   = $category_theme_id;
}
$sqlParts[] = "updated_at = NOW()";

$sql = implode(', ', $sqlParts) . " WHERE user_id = ? AND id = ?";
$params[] = $user_id;
$params[] = $inv_id;

$stmt = $pdo->prepare($sql);
if (!$stmt->execute($params)) {
    error(500, 'Gagal menyimpan data undangan.');
}

echo json_encode([
    'status'  => 'success',
    'message' => 'Data undangan berhasil disimpan.',
    'data'    => ['status' => $newStatus]
], JSON_UNESCAPED_UNICODE);
?>
