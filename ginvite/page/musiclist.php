<?php
// musiclist.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php'; // Sesuaikan path jika perlu

function error($code, $msg) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

// Query untuk mengambil semua daftar musik
$sql = "SELECT Nama_lagu, link_lagu, kategori FROM musik";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$musics = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$musics) {
    error(404, 'Musik tidak ditemukan.');
}

echo json_encode(['status' => 'success', 'data' => $musics], JSON_UNESCAPED_UNICODE);

?>