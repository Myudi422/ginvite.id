<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database configuration
$servername = "db5014893351.hosting-data.io";
$username = "dbu1977962";
$password = "ginviteNewVersionz!!!";
$dbname = "dbs12566486";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Cleanup unused images older than 1 hour
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'cleanup_old') {
        
        // Get unused images older than 1 hour
        $stmt = $pdo->prepare("
            SELECT filename, file_path 
            FROM blog_images 
            WHERE is_used = 0 
            AND created_at < DATE_SUB(NOW(), INTERVAL 1 HOUR)
        ");
        $stmt->execute();
        $unused_images = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $deleted_files = [];
        $errors = [];
        
        foreach ($unused_images as $image) {
            $file_path = '/home/ccgnimex/public_html/v2/android/ginvite/uploads/editor/' . $image['filename'];
            
            // Delete physical file
            if (file_exists($file_path)) {
                if (unlink($file_path)) {
                    $deleted_files[] = $image['filename'];
                } else {
                    $errors[] = "Failed to delete file: " . $image['filename'];
                }
            } else {
                $deleted_files[] = $image['filename']; // File already doesn't exist
            }
        }
        
        // Remove records from database
        if (!empty($unused_images)) {
            $filenames = array_column($unused_images, 'filename');
            $placeholders = str_repeat('?,', count($filenames) - 1) . '?';
            $stmt = $pdo->prepare("DELETE FROM blog_images WHERE filename IN ($placeholders)");
            $stmt->execute($filenames);
        }
        
        echo json_encode([
            'status' => 'success',
            'deleted_count' => count($deleted_files),
            'deleted_files' => $deleted_files,
            'errors' => $errors
        ]);
        exit;
    }
    
    // Mark single image as unused
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'mark_unused_single') {
        
        $filename = $_POST['filename'] ?? '';
        
        if (empty($filename)) {
            echo json_encode(['status' => 'error', 'message' => 'Filename is required']);
            exit;
        }
        
        // Update image as unused
        $stmt = $pdo->prepare("UPDATE blog_images SET is_used = 0, updated_at = NOW() WHERE filename = ?");
        $stmt->execute([$filename]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'success', 'message' => 'Image marked as unused']);
        } else {
            echo json_encode(['status' => 'info', 'message' => 'Image not found in database']);
        }
        exit;
    }
    
    // Get list of unused images
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'list_unused') {
        
        $stmt = $pdo->prepare("
            SELECT filename, file_path, created_at, updated_at 
            FROM blog_images 
            WHERE is_used = 0 
            ORDER BY updated_at DESC
        ");
        $stmt->execute();
        $unused_images = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'status' => 'success',
            'unused_images' => $unused_images,
            'count' => count($unused_images)
        ]);
        exit;
    }
    
    // Mark multiple images as unused (for bulk operations)
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'mark_unused_bulk') {
        
        $filenames = json_decode($_POST['filenames'] ?? '[]', true);
        
        if (empty($filenames) || !is_array($filenames)) {
            echo json_encode(['status' => 'error', 'message' => 'Filenames array is required']);
            exit;
        }
        
        $placeholders = str_repeat('?,', count($filenames) - 1) . '?';
        $stmt = $pdo->prepare("UPDATE blog_images SET is_used = 0, updated_at = NOW() WHERE filename IN ($placeholders)");
        $stmt->execute($filenames);
        
        echo json_encode([
            'status' => 'success', 
            'message' => 'Images marked as unused',
            'affected_rows' => $stmt->rowCount()
        ]);
        exit;
    }
    
    echo json_encode(['status' => 'error', 'message' => 'Invalid action or method']);
    
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
}
?>
