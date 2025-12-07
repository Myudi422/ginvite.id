<?php
require __DIR__ . '/../db.php'; // pastikan db.php mendefinisikan
require '../../../../vendor/autoload.php'; // Sesuaikan path ke autoloader Composer

use Aws\S3\S3Client;
use Aws\Exception\AwsException;

// Konfigurasi Backblaze B2 via S3 API
define('B2_ENDPOINT_URL', 'https://s3.us-east-005.backblazeb2.com');
define('B2_ACCESS_KEY', '0057ba6d7a5725c0000000002');
define('B2_SECRET_KEY', 'K005XvUqydtIZQvuNBYCM/UDhXfrWLQ');
define('BUCKET_NAME', 'ccgnimex');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$user_id = isset($body['user_id']) && is_numeric($body['user_id']) ? (int)$body['user_id'] : null;
$id      = isset($body['id'])      && is_numeric($body['id'])      ? (int)$body['id']      : null;

if (!$user_id || !$id) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Parameter user_id dan id wajib diisi']);
    exit;
}

// Ambil record untuk kepemilikan dan isi content
$stmt = $pdo->prepare("SELECT id, content FROM content_user WHERE id = ? AND user_id = ?");
$stmt->execute([$id, $user_id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Undangan tidak ditemukan atau bukan milik user']);
    exit;
}

// Decode content JSON dan cari semua URL Backblaze
$contentJson = $row['content'];
$data = json_decode($contentJson, true);
$urls = [];

// Ambil gallery items
if (!empty($data['gallery']['items']) && is_array($data['gallery']['items'])) {
    foreach ($data['gallery']['items'] as $u) {
        $urls[] = $u;
    }
}

// Ambil profile image di children
if (!empty($data['children']) && is_array($data['children'])) {
    foreach ($data['children'] as $child) {
        if (!empty($child['profile'])) {
            $urls[] = $child['profile'];
        }
    }
}

// Ambil pictures di our_story
if (!empty($data['our_story']) && is_array($data['our_story'])) {
    foreach ($data['our_story'] as $story) {
        if (!empty($story['pictures']) && is_array($story['pictures'])) {
            foreach ($story['pictures'] as $pic) {
                $urls[] = $pic;
            }
        }
    }
}

// Jika nanti ada field URL lain, tambahkan di sini (tidak termasuk music.url)

// Hapus masing-masing object di Backblaze B2
if (!empty($urls)) {
    // Disable deprecation warnings
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);
ini_set('display_errors', 'Off');

// Initialize S3 client with suppress flag
$s3 = new S3Client([
        'version'     => 'latest',
        'region'      => 'us-east-005',
        'endpoint'    => B2_ENDPOINT_URL,
        'credentials' => [
            'key'    => B2_ACCESS_KEY,
            'secret' => B2_SECRET_KEY,
        ],
    ]);
    foreach ($urls as $imageUrl) {
        $pathParts = parse_url($imageUrl);
        if (!empty($pathParts['path'])) {
            $objectKey = ltrim($pathParts['path'], '/');
            try {
                $s3->deleteObject(['Bucket' => BUCKET_NAME, 'Key' => $objectKey]);
            } catch (AwsException $e) {
                error_log('Backblaze delete error: ' . $e->getMessage());
            }
        }
    }
}

// Hapus record dari database
$del = $pdo->prepare('DELETE FROM content_user WHERE id = ? AND user_id = ?');
$del->execute([$id, $user_id]);

if ($del->rowCount() > 0) {
    echo json_encode(['status' => 'success', 'message' => 'Undangan dan semua gambar berhasil dihapus']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus undangan']);
}
exit;
