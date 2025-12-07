<?php
require '../../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function validateJWT($jwt) {
    $secretKey = 'very-secret-key';  // pastikan sama dengan secret generate JWT
    
    try {
        $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));
        
        // Cek expiry
        $now = time();
        if ($decoded->exp < $now) {
            throw new Exception('Token expired');
        }
        
        // Return decoded data
        return [
            'userId' => $decoded->data->userId,
            'email' => $decoded->data->email,
            'type_user' => $decoded->data->type_user ?? null
        ];
    } catch (Exception $e) {
        return false;
    }
}
?>