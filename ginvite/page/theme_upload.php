<?php
// php/page/theme_upload.php

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

// Validasi file gambar: hanya JPG/PNG, max 5MB
function validateImageFile($file) {
    $allowedExtensions = ['jpg', 'jpeg', 'png'];
    $maxFileSize = 5 * 1024 * 1024; // 5 MB

    if ($file['error'] !== UPLOAD_ERR_OK) {
        return "Terjadi kesalahan saat upload file.";
    }

    $fileSize = $file['size'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if ($fileSize > $maxFileSize) {
        return "File terlalu besar (maks 5MB).";
    }
    if (!in_array($ext, $allowedExtensions)) {
        return "Format tidak valid. Hanya JPG/PNG diperbolehkan.";
    }
    return true;
}

// Fungsi untuk mengembalikan MIME type
function getImageMimeType($filename) {
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $map = [
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png'  => 'image/png'
    ];
    return $map[$ext] ?? 'application/octet-stream';
}

// Upload satu file ke Backblaze, path: papunda/theme/{category}/{name}/{field}_{uniqid()}.{ext}
function uploadToBackblaze($file, $categoryId, $themeNameSanitized, $fieldKey) {
    try {
        $s3 = new S3Client([
            'version' => 'latest',
            'region'  => 'us-east-005',
            'endpoint'=> B2_ENDPOINT_URL,
            'credentials' => [
                'key'    => B2_ACCESS_KEY,
                'secret' => B2_SECRET_KEY
            ],
            'http' => ['verify' => false],
            'suppress_php_deprecation_warning' => true,
        ]);

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $uniqueId = uniqid();
        $key = "papunda/theme/{$categoryId}/{$themeNameSanitized}/{$fieldKey}_{$uniqueId}.{$ext}";

        $result = $s3->putObject([
            'Bucket'      => BUCKET_NAME,
            'Key'         => $key,
            'SourceFile'  => $file['tmp_name'],
            'ContentType' => getImageMimeType($file['name']),
            'ACL'         => 'public-read'
        ]);

        return $result['ObjectURL'];
    } catch (AwsException $e) {
        return "AWS Error: " . $e->getMessage();
    }
}

// ======================================================
// Proses POST: pastikan semua field dan file tersedia
// ======================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ambil field teks
    $name        = isset($_POST['name'])        ? trim($_POST['name'])        : null;
    $textColor   = isset($_POST['text_color'])  ? trim($_POST['text_color'])  : null;
    $accentColor = isset($_POST['accent_color'])? trim($_POST['accent_color']): null;
    $categoryId  = isset($_POST['category'])    ? intval($_POST['category'])  : null;

    // Ambil file
    $imageThemeFileData = $_FILES['image_theme']           ?? null;
    $defaultBgFileData  = $_FILES['default_bg_image']      ?? null;
    $backgroundFileData = $_FILES['background']            ?? null;
    $defaultBg1FileData = $_FILES['default_bg_image1']     ?? null;
    $decorTLFileData    = $_FILES['decorations_top_left']  ?? null;
    $decorTRFileData    = $_FILES['decorations_top_right'] ?? null;
    $decorBLFileData    = $_FILES['decorations_bottom_left']  ?? null;
    $decorBRFileData    = $_FILES['decorations_bottom_right'] ?? null;

    // Validasi field wajib
    if (!$name || !$textColor || !$accentColor || !$categoryId ||
        !$imageThemeFileData || !$defaultBgFileData || !$backgroundFileData || !$defaultBg1FileData) {
        errorResponse("Field 'name', 'text_color', 'accent_color', 'category', dan semua file background serta image_theme wajib diisi.", 422);
    }

    // Validasi masing-masing file utama
    foreach ([
        ['file'=>$imageThemeFileData, 'label'=>'image_theme'],
        ['file'=>$defaultBgFileData,  'label'=>'default_bg_image'],
        ['file'=>$backgroundFileData, 'label'=>'background'],
        ['file'=>$defaultBg1FileData, 'label'=>'default_bg_image1']
    ] as $item) {
        $valid = validateImageFile($item['file']);
        if ($valid !== true) {
            errorResponse("Error '{$item['label']}': {$valid}", 422);
        }
    }

    // Jika dekorasi di‐upload, validasi juga
    foreach ([
        ['file'=>$decorTLFileData,'label'=>'decorations_top_left'],
        ['file'=>$decorTRFileData,'label'=>'decorations_top_right'],
        ['file'=>$decorBLFileData,'label'=>'decorations_bottom_left'],
        ['file'=>$decorBRFileData,'label'=>'decorations_bottom_right']
    ] as $item) {
        if ($item['file'] && $item['file']['error'] !== UPLOAD_ERR_NO_FILE) {
            $valid = validateImageFile($item['file']);
            if ($valid !== true) {
                errorResponse("Error '{$item['label']}': {$valid}", 422);
            }
        }
    }

    // Sanitasi nama theme untuk path
    $sanitizedName = preg_replace('/[^A-Za-z0-9_\-]/', '', pathinfo($name, PATHINFO_FILENAME));

    // ======================================================
    // Upload setiap file ke Backblaze
    // ======================================================
    $imageThemeUrl = uploadToBackblaze($imageThemeFileData, $categoryId, $sanitizedName, 'image_theme');
    if (strpos($imageThemeUrl, 'Error') === 0) {
        errorResponse($imageThemeUrl, 500);
    }

    $defaultBgUrl = uploadToBackblaze($defaultBgFileData, $categoryId, $sanitizedName, 'default_bg_image');
    if (strpos($defaultBgUrl, 'Error') === 0) {
        errorResponse($defaultBgUrl, 500);
    }

    $backgroundUrl = uploadToBackblaze($backgroundFileData, $categoryId, $sanitizedName, 'background');
    if (strpos($backgroundUrl, 'Error') === 0) {
        errorResponse($backgroundUrl, 500);
    }

    $defaultBg1Url = uploadToBackblaze($defaultBg1FileData, $categoryId, $sanitizedName, 'default_bg_image1');
    if (strpos($defaultBg1Url, 'Error') === 0) {
        errorResponse($defaultBg1Url, 500);
    }

    // Upload dekorasi jika ada
    $decorTLUrl = null;
    if ($decorTLFileData && $decorTLFileData['error'] !== UPLOAD_ERR_NO_FILE) {
        $decorTLUrl = uploadToBackblaze($decorTLFileData, $categoryId, $sanitizedName, 'decorations_top_left');
        if (strpos($decorTLUrl, 'Error') === 0) {
            errorResponse($decorTLUrl, 500);
        }
    }

    $decorTRUrl = null;
    if ($decorTRFileData && $decorTRFileData['error'] !== UPLOAD_ERR_NO_FILE) {
        $decorTRUrl = uploadToBackblaze($decorTRFileData, $categoryId, $sanitizedName, 'decorations_top_right');
        if (strpos($decorTRUrl, 'Error') === 0) {
            errorResponse($decorTRUrl, 500);
        }
    }

    $decorBLUrl = null;
    if ($decorBLFileData && $decorBLFileData['error'] !== UPLOAD_ERR_NO_FILE) {
        $decorBLUrl = uploadToBackblaze($decorBLFileData, $categoryId, $sanitizedName, 'decorations_bottom_left');
        if (strpos($decorBLUrl, 'Error') === 0) {
            errorResponse($decorBLUrl, 500);
        }
    }

    $decorBRUrl = null;
    if ($decorBRFileData && $decorBRFileData['error'] !== UPLOAD_ERR_NO_FILE) {
        $decorBRUrl = uploadToBackblaze($decorBRFileData, $categoryId, $sanitizedName, 'decorations_bottom_right');
        if (strpos($decorBRUrl, 'Error') === 0) {
            errorResponse($decorBRUrl, 500);
        }
    }

    // ======================================================
    // Simpan metadata ke database (tabel 'theme')
    // ======================================================
    try {
        $sql = "INSERT INTO theme 
            (name, text_color, accent_color,
             default_bg_image, background, default_bg_image1,
             decorations_top_left, decorations_top_right,
             decorations_bottom_left, decorations_bottom_right,
             image_theme, kategory_theme_id)
          VALUES
            (:name, :text_color, :accent_color,
             :default_bg_image, :background, :default_bg_image1,
             :decor_tl, :decor_tr, :decor_bl, :decor_br,
             :image_theme, :category_id)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':name'               => $name,
            ':text_color'         => $textColor,
            ':accent_color'       => $accentColor,
            ':default_bg_image'   => $defaultBgUrl,
            ':background'         => $backgroundUrl,
            ':default_bg_image1'  => $defaultBg1Url,
            ':decor_tl'           => $decorTLUrl,
            ':decor_tr'           => $decorTRUrl,
            ':decor_bl'           => $decorBLUrl,
            ':decor_br'           => $decorBRUrl,
            ':image_theme'        => $imageThemeUrl,
            ':category_id'        => $categoryId
        ]);
        $newId = $pdo->lastInsertId();
    } catch (PDOException $e) {
        errorResponse("Gagal menyimpan ke database: " . $e->getMessage(), 500);
    }

    // Berhasil
    echo json_encode([
        'success' => true,
        'message' => "Theme berhasil diunggah.",
        'data'    => [
            'id'                     => intval($newId),
            'name'                   => $name,
            'text_color'             => $textColor,
            'accent_color'           => $accentColor,
            'default_bg_image'       => $defaultBgUrl,
            'background'             => $backgroundUrl,
            'default_bg_image1'      => $defaultBg1Url,
            'decorations_top_left'   => $decorTLUrl,
            'decorations_top_right'  => $decorTRUrl,
            'decorations_bottom_left'=> $decorBLUrl,
            'decorations_bottom_right'=> $decorBRUrl,
            'image_theme'            => $imageThemeUrl,
            'kategory_theme_id'      => $categoryId
        ]
    ], JSON_UNESCAPED_UNICODE);

} else {
    errorResponse("Request tidak valid.", 405);
}
?>
