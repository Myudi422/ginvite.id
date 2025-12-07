<?php
// Daftar domain yang diizinkan
$allowedOrigins = [
    'http://localhost:3000',
    'https://papunda.com',
    'https://ginvite-id.vercel.app',
    'https://scaling-space-pancake-rp45qr5gq7x2x74r-3000.app.github.dev',
    'https://scaling-space-pancake-rp45qr5gq7x2x74r-3000.app.github.dev:3000'
];

// Periksa header Origin dari permintaan
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    if (in_array($origin, $allowedOrigins, true)) {
        // Jika domain ada dalam daftar yang diizinkan, set header Access-Control-Allow-Origin
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Credentials: true'); // Jika Anda perlu mengirim cookie lintas domain
        header('Access-Control-Max-Age: 86400');    // Berapa lama (dalam detik) hasil preflight dapat di-cache
    } else {
        // Jika domain tidak diizinkan, kirim respons error
        http_response_code(403); // Forbidden
        echo json_encode(['status' => 'error', 'message' => 'Akses ditolak dari domain ini.']);
        exit;
    }
} elseif (!isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['SERVER_NAME'] === 'localhost' && ($_SERVER['SERVER_PORT'] === '80' || $_SERVER['SERVER_PORT'] === '443')) {
    // Izinkan permintaan langsung dari localhost (tanpa port tertentu) jika tidak ada header Origin
    header('Access-Control-Allow-Origin: http://localhost');
} elseif (!isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['SERVER_NAME'] === 'localhost' && $_SERVER['SERVER_PORT'] === '3000') {
    // Izinkan permintaan langsung dari localhost:3000 jika tidak ada header Origin
    header('Access-Control-Allow-Origin: http://localhost:3000');
}

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

// Jika ini preflight request, langsung akhiri
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json');

// === JWT Validation Middleware ===
require '../../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Ambil header Authorization
$authHeader = $_SERVER['HTTP_AUTHORIZATION']
                ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(['status'=>'error','message'=>'Unauthorized: token not provided']);
    exit;
}
$jwt = $matches[1];

$secretKey = 'very-secret-key';  // pastikan sama dengan secret generate JWT
try {
    $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['status'=>'error','message'=>'Unauthorized: invalid token']);
    exit;
}
// === End JWT Validation ===

require __DIR__ . '/db.php';

$action = $_GET['action'] ?? 'main';
$action = preg_replace('/[^a-zA-Z0-9_]/', '', $action);

$endpointFile = __DIR__ . '/page/' . $action . '.php';

if (file_exists($endpointFile)) {
    include $endpointFile;
} else {
    http_response_code(404);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Endpoint not found: ' . $action
    ]);
}
?>