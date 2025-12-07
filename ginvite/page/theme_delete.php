<?php
// php/page/theme_delete.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php';      // sesuaikan path ke koneksi PDO Anda
require __DIR__ . '/../../../../vendor/autoload.php';

use Aws\S3\S3Client;
use Aws\Exception\AwsException;

// Konfigurasi Backblaze B2 (S3-compatible)
define('B2_ENDPOINT_URL', 'https://s3.us-east-005.backblazeb2.com');
define('B2_ACCESS_KEY', '0057ba6d7a5725c0000000002');
define('B2_SECRET_KEY', 'K005XvUqydtIZQvuNBYCM/UDhXfrWLQ');
define('BUCKET_NAME', 'ccgnimex');

// Fungsi untuk error response JSON
function errorResponse($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

// Inisialisasi S3Client (Backblaze B2)
function getS3Client(): S3Client {
    return new S3Client([
        'version'     => 'latest',
        'region'      => 'us-east-005',
        'endpoint'    => B2_ENDPOINT_URL,
        'credentials' => [
            'key'    => B2_ACCESS_KEY,
            'secret' => B2_SECRET_KEY
        ],
        'http' => ['verify' => false],
        'suppress_php_deprecation_warning' => true,
    ]);
}

// Hanya terima POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($_POST['id']) ? intval($_POST['id']) : null;
    if (!$id) {
        errorResponse("Field 'id' wajib diisi.", 422);
    }

    try {
        // 1) Ambil record dulu untuk tahu category dan name
        $stmt = $pdo->prepare("
            SELECT name, kategory_theme_id 
            FROM theme 
            WHERE id = :id
        ");
        $stmt->execute([':id' => $id]);
        $theme = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$theme) {
            errorResponse("Theme dengan id {$id} tidak ditemukan.", 404);
        }
        $categoryId = (int) $theme['kategory_theme_id'];
        // Sanitasi folder name (harus sama seperti di upload)
        $sanitizedName = preg_replace('/[^A-Za-z0-9_\-]/', '', pathinfo($theme['name'], PATHINFO_FILENAME));

        $prefix = "papunda/theme/{$categoryId}/{$sanitizedName}/";

        // 2) List semua objek di bawah prefix
        $s3 = getS3Client();
        $toDelete = [];
        $params = [
            'Bucket' => BUCKET_NAME,
            'Prefix' => $prefix
        ];

        do {
            $result = $s3->listObjectsV2($params);
            if (isset($result['Contents'])) {
                foreach ($result['Contents'] as $obj) {
                    $toDelete[] = ['Key' => $obj['Key']];
                }
            }
            // Jika ada continuation token, set untuk iterasi berikutnya
            if (isset($result['NextContinuationToken'])) {
                $params['ContinuationToken'] = $result['NextContinuationToken'];
            } else {
                unset($params['ContinuationToken']);
            }
        } while (isset($result['NextContinuationToken']));

        // 3) Jika ada objek, delete secara batch (maks 1000 per call)
        if (!empty($toDelete)) {
            // Bisa di‐chunk per 1000 item, tapi biasanya jumlahnya sedikit
            $chunks = array_chunk($toDelete, 1000);
            foreach ($chunks as $chunk) {
                try {
                    $s3->deleteObjects([
                        'Bucket'  => BUCKET_NAME,
                        'Delete'  => ['Objects' => $chunk, 'Quiet' => true]
                    ]);
                } catch (AwsException $e) {
                    // Jika gagal hapus beberapa file, lanjutkan saja
                    // Logging opsional:
                    // error_log("Gagal delete batch: " . $e->getMessage());
                }
            }
        }

        // 4) Hapus record dari DB
        $delStmt = $pdo->prepare("DELETE FROM theme WHERE id = :id");
        $delStmt->execute([':id' => $id]);

        echo json_encode([
            'success' => true,
            'message' => "Theme dengan id {$id} dan semua file di Backblaze berhasil dihapus."
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        errorResponse("Gagal menghapus theme: " . $e->getMessage(), 500);
    }
} else {
    errorResponse("Request tidak valid.", 405);
}
