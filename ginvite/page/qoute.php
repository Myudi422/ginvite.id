<?php
// quotes.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php'; // sesuaikan path ke koneksi PDO-mu

function error($code, $msg) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

// Ambil semua kutipan
$sql = "SELECT quote, kategory FROM quote";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$rows) {
    error(404, 'Tidak ada kutipan ditemukan.');
}

// Kelompokkan berdasarkan kategori
$data = [];
foreach ($rows as $r) {
    $cat = $r['kategory'] ?? 'Uncategorized';
    if (!isset($data[$cat])) {
        $data[$cat] = [];
    }
    $data[$cat][] = $r['quote'];
}

// Bentuk output array of { category, quotes: [] }
$output = [];
foreach ($data as $cat => $quotes) {
    $output[] = [
        'category' => $cat,
        'quotes'   => $quotes,
    ];
}

echo json_encode(['status' => 'success', 'data' => $output], JSON_UNESCAPED_UNICODE);
