<?php
// update_invitation.php

// Atur header CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Tangani permintaan preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Pastikan ini adalah permintaan POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    exit(json_encode(['status' => 'error', 'message' => 'Metode tidak diizinkan']));
}

require './db.php';

// Ambil data dari body request
$data = json_decode(file_get_contents('php://input'), true);

// Validasi parameter wajib
$required_params = ['id', 'user_id', 'title', 'status', 'waktu_acara'];
foreach ($required_params as $param) {
    if (!isset($data[$param]) || empty($data[$param])) {
        http_response_code(400);
        exit(json_encode(['status' => 'error', 'message' => "Parameter wajib: " . implode(', ', $required_params)]));
    }
}

if (!is_numeric($data['id']) || !is_numeric($data['user_id']) || !is_numeric($data['status'])) {
    http_response_code(400);
    exit(json_encode(['status' => 'error', 'message' => 'Parameter id, user_id, dan status harus berupa angka']));
}

$id = (int)$data['id'];
$userId = (int)$data['user_id'];
$title = trim($data['title']);
$status = (int)$data['status'];
$waktuAcara = trim($data['waktu_acara']);

// Handle content (opsional)
$content = isset($data['content']) ? json_encode($data['content']) : null;

// Lakukan update ke database
$sql = "UPDATE content_user
        SET title = :title,
            status = :status,
            waktu_acara = :waktu_acara,
            updated_at = NOW()";

if ($content !== null) {
    $sql .= ", content = :content";
}

$sql .= " WHERE id = :id AND user_id = :user_id";

$stmt = $pdo->prepare($sql);

$stmt->bindParam(':title', $title);
$stmt->bindParam(':status', $status);
$stmt->bindParam(':waktu_acara', $waktuAcara);
$stmt->bindParam(':id', $id);
$stmt->bindParam(':user_id', $userId);

if ($content !== null) {
    $stmt->bindParam(':content', $content);
}

if ($stmt->execute()) {
    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Data undangan berhasil diperbarui']);
    } else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Data undangan tidak ditemukan atau Anda tidak memiliki izin untuk mengubahnya']);
    }
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan saat memperbarui data di database']);
}
?>
