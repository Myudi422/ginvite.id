<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 2) Response JSON
header('Content-Type: application/json');

// 3) Hapus cookie 'token'
setcookie('token', '', [
    'expires' => time() - 3600, // Set waktu kedaluwarsa ke masa lalu
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Lax'
]);

// 4) Kirim response sukses
echo json_encode(['status' => 'success', 'message' => 'Logout berhasil']);
exit;