<?php
// ginvite/page/backblaze_admin_upload.php
require '../../../../vendor/autoload.php';
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

use Aws\S3\S3Client;
use Aws\Exception\AwsException;

// Config
define('B2_ENDPOINT_URL', 'https://s3.us-east-005.backblazeb2.com');
define('B2_ACCESS_KEY', '0057ba6d7a5725c0000000002');
define('B2_SECRET_KEY', 'K005XvUqydtIZQvuNBYCM/UDhXfrWLQ');
define('BUCKET_NAME', 'ccgnimex');

function validateFile($file)
{
    $allowedExtensions = ['gif', 'png', 'jpeg', 'jpg', 'pdf', 'mp3', 'mp4', 'svg', 'zip'];
    $maxFileSize = 50 * 1024 * 1024; // 50MB

    $fileSize = $file['size'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if ($fileSize > $maxFileSize) {
        return "File Melebihi 50MB, silahkan compress";
    }
    if (!in_array($ext, $allowedExtensions)) {
        return "Format tidak valid. hanya format: gif, png, jpeg, jpg, pdf, mp3, mp4, svg, zip.";
    }
    return true;
}

function getMimeType($filename)
{
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $map = [
        'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg',
        'png' => 'image/png', 'gif' => 'image/gif',
        'pdf' => 'application/pdf', 'mp3' => 'audio/mpeg', 'mp4' => 'video/mp4', 'svg' => 'image/svg+xml',
        'zip' => 'application/zip'
    ];
    return $map[$ext] ?? 'application/octet-stream';
}

function uploadToBackblaze($file, $folderPath)
{
    try {
        $s3 = new S3Client([
            'version' => 'latest',
            'region' => 'us-east-005',
            'endpoint' => B2_ENDPOINT_URL,
            'credentials' => ['key' => B2_ACCESS_KEY, 'secret' => B2_SECRET_KEY],
            'suppress_php_deprecation_warning' => true,
        ]);

        $orig = pathinfo($file['name'], PATHINFO_FILENAME);
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $sanitized = preg_replace('/[^A-Za-z0-9_\-]/', '', $orig);

        $uniqueId = uniqid();

        $folderPath = trim($folderPath, '/');
        if (empty($folderPath)) {
            $folderPath = "admin_uploads";
        }

        $key = "{$folderPath}/{$sanitized}_{$uniqueId}.{$ext}";

        $result = $s3->putObject([
            'Bucket' => BUCKET_NAME,
            'Key' => $key,
            'SourceFile' => $file['tmp_name'],
            'ContentType' => getMimeType($file['name']),
            'ACL' => 'public-read',
        ]);

        return $result['ObjectURL'];
    }
    catch (AwsException $e) {
        return "Error: " . $e->getMessage();
    }
}

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file'];
    $folderPath = isset($_POST['folderPath']) ? $_POST['folderPath'] : 'admin_uploads';

    $ok = validateFile($file);
    if ($ok !== true) {
        echo json_encode(['success' => false, 'message' => $ok]);
        exit;
    }

    $url = uploadToBackblaze($file, $folderPath);
    if (strpos($url, 'Error:') === 0) {
        echo json_encode(['success' => false, 'message' => $url]);
        exit;
    }

    echo json_encode(['success' => true, 'url' => $url]);
}
else {
    echo json_encode(['success' => false, 'message' => 'Invalid request or missing file.']);
}
?>
