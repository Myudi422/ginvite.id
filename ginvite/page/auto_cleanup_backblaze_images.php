<?php
// Auto cleanup script untuk menghapus gambar Backblaze yang tidak terpakai
// Jalankan via cron job setiap 1 jam atau secara manual via browser

require __DIR__ . '/../db.php';
require __DIR__ . '/../../../../vendor/autoload.php'; // Path ke Composer vendor autoload

use Aws\S3\S3Client;
use Aws\Exception\AwsException;

// Config Backblaze
define('B2_ENDPOINT_URL', 'https://s3.us-east-005.backblazeb2.com');
define('B2_ACCESS_KEY', '0057ba6d7a5725c0000000002');
define('B2_SECRET_KEY', 'K005XvUqydtIZQvuNBYCM/UDhXfrWLQ');
define('BUCKET_NAME', 'ccgnimex');

$log_file = __DIR__ . '/../logs/backblaze_cleanup.log';

function writeLog($message) {
    global $log_file;
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[$timestamp] $message" . PHP_EOL;

    $log_dir = dirname($log_file);
    if (!is_dir($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
}

function printAndLog($message) {
    writeLog($message);
    $is_cli = (php_sapi_name() === 'cli');
    if ($is_cli) {
        echo $message . PHP_EOL;
    } else {
        echo htmlspecialchars($message) . "<br>" . PHP_EOL;
    }
}

try {
    printAndLog("Starting Backblaze image cleanup...");

    // Check if run from browser with force parameter (?force=1)
    $force = isset($_GET['force']) && $_GET['force'] == '1';

    if ($force) {
        printAndLog("Running in FORCE mode (bypassing 2-hour age check).");
    }

    // 1. Ambil gambar yang tidak terpakai (is_used = 0)
    $query = "
        SELECT id, file_url, object_key 
        FROM builder_images 
        WHERE is_used = 0 
    ";

    if (!$force) {
        $query .= " AND updated_at < DATE_SUB(NOW(), INTERVAL 2 HOUR) ";
    }

    $query .= " ORDER BY updated_at ASC LIMIT 100 ";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $unused_images = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($unused_images)) {
        if ($force) {
            printAndLog("Success: No unused Backblaze images found in database.");
        } else {
            printAndLog("Success: No unused Backblaze images older than 2 hours found for cleanup.");
            printAndLog("Tip: You can append '?force=1' to the URL to instantly clean up all unused images regardless of their age.");
        }
        exit;
    }

    printAndLog("Found " . count($unused_images) . " unused Backblaze images to clean up.");

    // Inisialisasi S3/Backblaze Client
    $s3 = new S3Client([
        'version' => 'latest',
        'region' => 'us-east-005',
        'endpoint' => B2_ENDPOINT_URL,
        'credentials' => [
            'key' => B2_ACCESS_KEY,
            'secret' => B2_SECRET_KEY,
        ],
        'suppress_php_deprecation_warning' => true,
    ]);

    $deleted_ids = [];
    $deleted_count = 0;
    $error_count = 0;

    foreach ($unused_images as $image) {
        $objectKey = $image['object_key'];

        try {
            $s3->deleteObject([
                'Bucket' => BUCKET_NAME,
                'Key' => $objectKey,
            ]);
            $deleted_ids[] = $image['id'];
            $deleted_count++;
            printAndLog("Deleted from Backblaze: " . $objectKey);
        } catch (AwsException $e) {
            $error_count++;
            printAndLog("ERROR deleting " . $objectKey . ": " . $e->getMessage());
        }
    }

    // Hapus records dari database untuk gambar yang berhasil dihapus
    if (!empty($deleted_ids)) {
        $placeholders = str_repeat('?,', count($deleted_ids) - 1) . '?';
        $delStmt = $pdo->prepare("DELETE FROM builder_images WHERE id IN ($placeholders)");
        $delStmt->execute($deleted_ids);
        printAndLog("Removed " . count($deleted_ids) . " records from database.");
    }

    $summary = "Backblaze cleanup completed. Deleted: $deleted_count images, Errors: $error_count";
    printAndLog($summary);

} catch (Exception $e) {
    $error = "Error during cleanup: " . $e->getMessage();
    printAndLog("ERROR: " . $error);
}
?>
