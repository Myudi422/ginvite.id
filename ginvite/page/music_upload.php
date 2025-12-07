<?php
// php/page/music_upload.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
require __DIR__ . '/../db.php';
require __DIR__ . '/../../../../vendor/autoload.php';

use Aws\S3\S3Client;
use Aws\Exception\AwsException;


// Konfigurasi Backblaze B2 (S3-compatible)
define('B2_ENDPOINT_URL', 'https://s3.us-east-005.backblazeb2.com');
define('B2_ACCESS_KEY', '0057ba6d7a5725c0000000002');
define('B2_SECRET_KEY', 'K005XvUqydtIZQvuNBYCM/UDhXfrWLQ');
define('BUCKET_NAME', 'ccgnimex');

// Fungsi untuk mengembalikan error JSON
function errorResponse($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

// Validasi file MP3
function validateMusicFile($file) {
    $allowedExtensions = ['mp3'];
    $maxFileSize = 20 * 1024 * 1024; // 20 MB

    if ($file['error'] !== UPLOAD_ERR_OK) {
        return "Terjadi kesalahan saat upload file.";
    }

    $fileSize = $file['size'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if ($fileSize > $maxFileSize) {
        return "File terlalu besar (maks 20MB).";
    }
    if (!in_array($ext, $allowedExtensions)) {
        return "Format tidak valid. Hanya memperbolehkan file MP3.";
    }
    return true;
}

// Mendapatkan MIME type sesuai ekstensi
function getMusicMimeType($filename) {
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $map = [
        'mp3' => 'audio/mpeg',
    ];
    return $map[$ext] ?? 'application/octet-stream';
}

// Fungsi untuk upload ke Backblaze B2 via S3 API
function uploadMusicToBackblaze($file, $sanitizedFilename) {
    try {
        $s3 = new S3Client([
            'version' => 'latest',
            'region'  => 'us-east-005',
            'endpoint'=> B2_ENDPOINT_URL,
            'credentials' => [
                'key'    => B2_ACCESS_KEY,
                'secret' => B2_SECRET_KEY
            ],
            'http' => [ 'verify' => false ], // Jika perlu (bisa dihapus jika tidak bermasalah)
            'suppress_php_deprecation_warning' => true,
        ]);

        // Buat key unik: papunda/music/{sanitizedFilename}_{uniqid()}.mp3
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $uniqueId = uniqid();
        $key = "papunda/music/{$sanitizedFilename}_{$uniqueId}.{$ext}";

        $result = $s3->putObject([
            'Bucket'      => BUCKET_NAME,
            'Key'         => $key,
            'SourceFile'  => $file['tmp_name'],
            'ContentType' => getMusicMimeType($file['name']),
            'ACL'         => 'public-read'
        ]);

        // Kembalikan URL publik
        return $result['ObjectURL'];
    } catch (AwsException $e) {
        return "AWS Error: " . $e->getMessage();
    }
}

// Hanya terima POST dan pastikan ada file 'music'
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['music'])) {
    $file      = $_FILES['music'];
    $namaLagu  = isset($_POST['nama_lagu']) ? trim($_POST['nama_lagu']) : null;
    $kategori  = isset($_POST['kategori'])   ? trim($_POST['kategori'])   : null;

    if (!$namaLagu || !$kategori) {
        errorResponse("Field 'nama_lagu' dan 'kategori' wajib diisi.", 422);
    }

    // Validasi file
    $valid = validateMusicFile($file);
    if ($valid !== true) {
        errorResponse($valid, 422);
    }

    // Sanitasi nama file (tanpa karakter ilegal)
    $origName    = pathinfo($file['name'], PATHINFO_FILENAME);
    $sanitized   = preg_replace('/[^A-Za-z0-9_\-]/', '', $origName);

    // Upload ke Backblaze
    $uploadUrl = uploadMusicToBackblaze($file, $sanitized);
    if (strpos($uploadUrl, 'Error') === 0) {
        errorResponse($uploadUrl, 500);
    }

    // Simpan ke database (tabel 'musik')
    try {
        $sql = "INSERT INTO musik (Nama_lagu, link_lagu, kategori) VALUES (:nama, :link, :kategori)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nama'     => $namaLagu,
            ':link'     => $uploadUrl,
            ':kategori' => $kategori
        ]);
        $newId = $pdo->lastInsertId();
    } catch (PDOException $e) {
        errorResponse("Gagal menyimpan ke database: " . $e->getMessage(), 500);
    }

    // Berhasil
    echo json_encode([
        'success' => true,
        'message' => "Lagu berhasil diunggah.",
        'data'    => [
            'id'         => intval($newId),
            'Nama_lagu'  => $namaLagu,
            'link_lagu'  => $uploadUrl,
            'kategori'   => $kategori
        ]
    ], JSON_UNESCAPED_UNICODE);

} else {
    errorResponse("Request tidak valid.", 405);
}

?>
