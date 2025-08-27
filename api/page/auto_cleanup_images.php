<?php
// Auto cleanup script untuk menghapus gambar yang tidak terpakai
// Jalankan via cron job setiap 1 jam

// Database configuration
$servername = "db5014893351.hosting-data.io";
$username = "dbu1977962";
$password = "ginviteNewVersionz!!!";
$dbname = "dbs12566486";

$log_file = '/home/ccgnimex/public_html/v2/android/ginvite/logs/image_cleanup.log';

function writeLog($message) {
    global $log_file;
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[$timestamp] $message" . PHP_EOL;
    
    // Create log directory if not exists
    $log_dir = dirname($log_file);
    if (!is_dir($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    
    file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
}

try {
    writeLog("Starting image cleanup process...");
    
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get unused images older than 2 hours
    $stmt = $pdo->prepare("
        SELECT id, filename, file_path 
        FROM blog_images 
        WHERE is_used = 0 
        AND updated_at < DATE_SUB(NOW(), INTERVAL 2 HOUR)
        ORDER BY updated_at ASC
        LIMIT 100
    ");
    $stmt->execute();
    $unused_images = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($unused_images)) {
        writeLog("No unused images found for cleanup.");
        exit;
    }
    
    writeLog("Found " . count($unused_images) . " unused images to clean up.");
    
    $deleted_count = 0;
    $error_count = 0;
    $deleted_ids = [];
    
    foreach ($unused_images as $image) {
        $file_path = '/home/ccgnimex/public_html/v2/android/ginvite/uploads/editor/' . $image['filename'];
        
        // Check if file exists and delete it
        if (file_exists($file_path)) {
            if (unlink($file_path)) {
                $deleted_ids[] = $image['id'];
                $deleted_count++;
                writeLog("Deleted file: " . $image['filename']);
            } else {
                $error_count++;
                writeLog("ERROR: Failed to delete file: " . $image['filename']);
            }
        } else {
            // File doesn't exist, remove from database anyway
            $deleted_ids[] = $image['id'];
            $deleted_count++;
            writeLog("File not found (already deleted): " . $image['filename']);
        }
    }
    
    // Remove records from database for successfully deleted files
    if (!empty($deleted_ids)) {
        $placeholders = str_repeat('?,', count($deleted_ids) - 1) . '?';
        $stmt = $pdo->prepare("DELETE FROM blog_images WHERE id IN ($placeholders)");
        $stmt->execute($deleted_ids);
        writeLog("Removed " . count($deleted_ids) . " records from database.");
    }
    
    // Also clean up orphaned files (files that exist but not in database)
    $upload_dir = '/home/ccgnimex/public_html/v2/android/ginvite/uploads/editor/';
    if (is_dir($upload_dir)) {
        $files = glob($upload_dir . '*');
        $orphaned_count = 0;
        
        foreach ($files as $file) {
            if (is_file($file)) {
                $filename = basename($file);
                
                // Check if file exists in database
                $stmt = $pdo->prepare("SELECT id FROM blog_images WHERE filename = ?");
                $stmt->execute([$filename]);
                
                if ($stmt->rowCount() === 0) {
                    // File not in database, check if it's older than 24 hours
                    $file_time = filemtime($file);
                    if ($file_time < time() - (24 * 60 * 60)) {
                        if (unlink($file)) {
                            $orphaned_count++;
                            writeLog("Deleted orphaned file: " . $filename);
                        }
                    }
                }
            }
        }
        
        if ($orphaned_count > 0) {
            writeLog("Cleaned up $orphaned_count orphaned files.");
        }
    }
    
    $summary = "Cleanup completed. Deleted: $deleted_count files, Errors: $error_count";
    writeLog($summary);
    
    // Output for cron job logs
    echo $summary . "\n";
    
} catch (PDOException $e) {
    $error = "Database error: " . $e->getMessage();
    writeLog("ERROR: " . $error);
    echo $error . "\n";
} catch (Exception $e) {
    $error = "Error: " . $e->getMessage();
    writeLog("ERROR: " . $error);
    echo $error . "\n";
}
?>
