<?php
// api/qr_attendance.php

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

// tangkap JSON body
$input = json_decode(file_get_contents('php://input'), true);
error_log("Data diterima: " . json_encode($input));
$nama = trim($input['nama'] ?? '');
$content_id = (int)($input['content_id'] ?? 0);

if (!$nama || !$content_id) {
    error(400, 'Parameter tidak valid. Diperlukan: nama(string), content_id(int).');
}

try {
    $sql = "INSERT INTO attendance (nama, content_id, tanggal) VALUES (?, ?, NOW())";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$nama, $content_id]);

    echo json_encode(['status' => 'success', 'message' => 'Absensi tercatat.'], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    error(500, 'Database error: ' . $e->getMessage());
}
