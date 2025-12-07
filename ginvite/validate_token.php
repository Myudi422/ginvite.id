<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json');
require 'db.php';
require '../../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Ambil token: prioritas dari header Authorization, fallback cookie
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    $jwt = $matches[1];
} elseif (isset($_COOKIE['token'])) {
    $jwt = $_COOKIE['token'];
} else {
    http_response_code(401);
    exit(json_encode(['status'=>'error','message'=>'Token not provided']));
}

$secretKey = 'very-secret-key';  // gunakan key yang sama dengan google.php

try {
    // Decode dan verifikasi
    $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));
    // Cek expiry
    $now = time();
    if ($decoded->exp < $now) {
        throw new Exception('Token expired');
    }

    // Cek di database, ambil type_user juga
    $userId = $decoded->data->userId;
    $stmt = $pdo->prepare("SELECT id, email, expired, type_user FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$user) {
        throw new Exception('User not found');
    }
    if (strtotime($user['expired']) < $now) {
        throw new Exception('User session expired');
    }

    // Sukses, kirim type_user juga
    echo json_encode([
        'status' => 'success',
        'data'   => [
            'userId'    => $userId,
            'email'     => $decoded->data->email,
            'type_user' => $user['type_user']
        ]
    ]);
    exit;

} catch (\Firebase\JWT\ExpiredException $e) {
    http_response_code(401);
    exit(json_encode(['status'=>'error','message'=>'Token expired']));
} catch (\Exception $e) {
    http_response_code(401);
    exit(json_encode(['status'=>'error','message'=>$e->getMessage()]));
}
