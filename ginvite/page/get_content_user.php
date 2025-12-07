<?php
// page/get_content_user.php

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

if (!$user_id || $title === '') {
    error(400, 'Parameter tidak valid. Diperlukan: user_id(int), title(string) di URL.');
}

// Query hanya berdasarkan user_id dan title
$sql = "
    SELECT cu.*, ct.name AS category_name
    FROM content_user cu
    JOIN category_type ct ON cu.category_id = ct.id
    WHERE cu.user_id = ? AND cu.title = ?
";
$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id, $title]);
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$data) {
    error(404, 'Data tidak ditemukan.');
}

// Tambahkan field "jumlah": null dan "dibayar": null jika tidak ada
foreach ($data as &$row) {
    $content = json_decode($row['content'], true);
    if (!isset($content['jumlah'])) {
        $content['jumlah'] = null;
    }
    if (!isset($content['dibayar'])) {
        $content['dibayar'] = null;
    }
    $row['content'] = json_encode($content, JSON_UNESCAPED_UNICODE);
}

echo json_encode(['status' => 'success', 'data' => $data], JSON_UNESCAPED_UNICODE);
?>