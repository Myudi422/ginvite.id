<?php
// Nonaktifkan pelaporan error dan mulai output buffering
error_reporting(0);
ini_set('display_errors', '0');
ob_start();

// Konfigurasi CORS untuk akses dari semua asal
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Set header respons JSON
header('Content-Type: application/json');

// Bootstrapping: Sertakan koneksi DB dan autoload JWT
require 'db.php';
require '../../../vendor/autoload.php';
use Firebase\JWT\JWT;

// Aktifkan mode exception untuk PDO
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Ambil id_token dari body permintaan
$body = json_decode(file_get_contents('php://input'), true);
$idToken = $body['id_token'] ?? null;
if (!$idToken) {
    ob_end_clean();
    http_response_code(400);
    exit(json_encode(['status'=>'error','message'=>'id_token diperlukan']));
}

// Decode payload dari id_token
$parts = explode('.', $idToken);
if (count($parts) < 2) {
    ob_end_clean();
    http_response_code(400);
    exit(json_encode(['status'=>'error','message'=>'id_token tidak valid']));
}
$payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
if (!$payload || !isset($payload['email'])) {
    ob_end_clean();
    http_response_code(400);
    exit(json_encode(['status'=>'error','message'=>'Payload token tidak lengkap']));
}

// Ekstrak data dari payload
$email = $payload['email'];
$firstName = $payload['given_name'] ?? $payload['name'] ?? '';
$pictureUrl = $payload['picture'] ?? '';
$now = date('Y-m-d H:i:s');
$expired = date('Y-m-d H:i:s', strtotime('+30 days'));
$typeUserDefault = 1; // Nilai default untuk user baru
$themeId = 1;

// Variabel untuk menyimpan nilai type_user yang sebenarnya
$actualTypeUser = $typeUserDefault;

// Upsert user (Update jika ada, Insert jika tidak ada)
try {
    $stmt = $pdo->prepare("SELECT id, type_user FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Jika user ditemukan, update datanya dan ambil type_user dari database
        $upd = $pdo->prepare("
            UPDATE users
            SET first_name = :firstName,
                pictures_url = :pictureUrl,
                last_login = :now,
                expired = :expired
            WHERE id = :id
        ");
        $upd->execute([
            ':firstName' => $firstName,
            ':pictureUrl' => $pictureUrl,
            ':now' => $now,
            ':expired' => $expired,
            ':id' => $user['id']
        ]);
        $userId = (int)$user['id'];
        $actualTypeUser = (int)$user['type_user']; // Ambil type_user dari data user yang sudah ada
    } else {
        // Jika user tidak ditemukan, insert user baru
        $ins = $pdo->prepare("
            INSERT INTO users
              (first_name, email, pictures_url, last_login, expired, type_user, theme_id)
            VALUES
              (:firstName, :email, :pictureUrl, :now, :expired, :typeUser, :themeId)
        ");
        $ins->execute([
            ':firstName' => $firstName,
            ':email' => $email,
            ':pictureUrl' => $pictureUrl,
            ':now' => $now,
            ':expired' => $expired,
            ':typeUser' => $typeUserDefault,
            ':themeId' => $themeId
        ]);
        $userId = (int)$pdo->lastInsertId();
        // actualTypeUser sudah menggunakan nilai default untuk user baru
    }
} catch (PDOException $e) {
    ob_end_clean();
    http_response_code(500);
    exit(json_encode(['status'=>'error','message'=>'DB Error: '.$e->getMessage()]));
}

// Generate JWT aplikasi
$secretKey = 'very-secret-key'; // Ganti dengan kunci rahasia yang kuat dan aman
$iat = time();
$expTs = $iat + 86400; // Token berlaku 24 jam
$tokenPayload = [
    'iss' => 'https://papunda.com', // Issuer dari token Anda
    'iat' => $iat,
    'nbf' => $iat,
    'exp' => $expTs,
    'data' => [
        'userId'=>$userId,
        'email'=>$email,
        'type_user'=>$actualTypeUser // Menambahkan type_user ke dalam payload data
    ]
];
$appJwt = JWT::encode($tokenPayload, $secretKey, 'HS256');

// Set cookie dengan token JWT
setcookie('token', $appJwt, [
    'expires' => $expTs,
    'path' => '/',
    'secure' => true,
    'httponly' => true, // <-- Ubah ke true agar tidak bisa diakses JS
    'samesite' => 'Lax' // Mencegah CSRF
]);

// Bersihkan output buffer dan kirim respons JSON
ob_end_clean();
echo json_encode(['status'=>'success','token'=>$appJwt]);
exit;