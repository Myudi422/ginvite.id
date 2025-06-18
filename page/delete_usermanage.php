<?php
// page/delete_usermanage.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed'], JSON_UNESCAPED_SLASHES);
    exit;
}

require __DIR__ . '/../db.php';

function error($code, $msg) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_UNESCAPED_SLASHES);
    exit;
}

// Mengambil input dari body dalam format JSON
$input = json_decode(file_get_contents("php://input"), true);
if (!isset($input['id']) || !isset($input['type'])) {
    error(400, 'Parameter tidak valid. Diperlukan: id(int), type(string)');
}

$id = (int)$input['id'];
$type = $input['type'];

if ($id <= 0) {
    error(400, 'ID tidak valid.');
}

// Menentukan tabel berdasarkan tipe data yang akan dihapus
if ($type === 'rsvp') {
    $table = 'rsmp';
} elseif ($type === 'transfer') {
    $table = 'bank_transfer';
} elseif ($type === 'qr_attendance') { // Add handling for QR attendance
    $table = 'attendance';
} else {
    error(400, 'Type tidak valid. Hanya "rsvp", "transfer", atau "qr_attendance" yang diperbolehkan.');
}

try {
    $sql = "DELETE FROM $table WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'status'  => 'success',
            'message' => "Data $type dengan id $id telah dihapus"
        ], JSON_UNESCAPED_SLASHES);
    } else {
        error(404, 'Data tidak ditemukan.');
    }
} catch (PDOException $e) {
    error(500, 'Terjadi kesalahan database: ' . $e->getMessage());
}
?>