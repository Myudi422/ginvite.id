<?php
require '../../../../vendor/autoload.php'; // Sesuaikan path ke autoloader Composer
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

use Aws\S3\S3Client;
use Aws\Exception\AwsException;

// Konfigurasi API Backblaze
define('B2_ENDPOINT_URL', 'https://s3.us-east-005.backblazeb2.com');
define('B2_ACCESS_KEY', '0057ba6d7a5725c0000000002');
define('B2_SECRET_KEY', 'K005XvUqydtIZQvuNBYCM/UDhXfrWLQ');
define('BUCKET_NAME', 'ccgnimex');


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['imageUrl'])) {
    $imageUrl = $_POST['imageUrl'];

    // Ekstrak nama file (key) dari URL
    $pathParts = parse_url($imageUrl);
    if (isset($pathParts['path'])) {
        $objectKey = ltrim($pathParts['path'], '/');

        try {
            $s3 = new S3Client([
                'version' => 'latest',
                'region' => 'us-east-005', // Sesuaikan jika region bucket Anda berbeda
                'endpoint' => B2_ENDPOINT_URL,
                'credentials' => [
                    'key' => B2_ACCESS_KEY,
                    'secret' => B2_SECRET_KEY,
                ],
                'suppress_php_deprecation_warning' => true,
            ]);

            $s3->deleteObject([
                'Bucket' => BUCKET_NAME,
                'Key' => $objectKey,
            ]);

            echo json_encode(["success" => true, "message" => "Gambar berhasil dihapus."]);

        } catch (AwsException $e) {
            echo json_encode(["success" => false, "message" => "Error menghapus dari Backblaze: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "URL gambar tidak valid."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request."]);
}
?>