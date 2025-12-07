<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Database configuration
$host = 'localhost';
$dbname = 'ginvite';
$username = 'ginvite';
$password = 'aaaaaaac';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()]));
}

// Get action from URL parameter
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        listBlogImages($pdo);
        break;
    case 'delete':
        deleteBlogImage($pdo);
        break;
    case 'mark_featured':
        markFeaturedImage($pdo);
        break;
    case 'mark_unused':
        markUnusedImages($pdo);
        break;
    case 'mark_unused_single':
        markUnusedSingle($pdo);
        break;
    case 'cleanup':
        cleanupUnusedImages($pdo);
        break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        break;
}

function listBlogImages($pdo) {
    try {
        $blog_id = $_GET['blog_id'] ?? '';
        
        if (empty($blog_id)) {
            // Get all images
            $stmt = $pdo->prepare("SELECT * FROM blog_images ORDER BY created_at DESC");
            $stmt->execute();
        } else {
            // Get images for specific blog
            $stmt = $pdo->prepare("SELECT * FROM blog_images WHERE blog_id = ? ORDER BY created_at DESC");
            $stmt->execute([$blog_id]);
        }
        
        $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'status' => 'success',
            'data' => $images
        ]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch images: ' . $e->getMessage()]);
    }
}

function deleteBlogImage($pdo) {
    try {
        $id = $_GET['id'] ?? '';
        
        if (empty($id)) {
            echo json_encode(['status' => 'error', 'message' => 'Image ID is required']);
            return;
        }
        
        // Get image data first
        $stmt = $pdo->prepare("SELECT file_path FROM blog_images WHERE id = ?");
        $stmt->execute([$id]);
        $image = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$image) {
            echo json_encode(['status' => 'error', 'message' => 'Image not found']);
            return;
        }
        
        // Delete from database
        $stmt = $pdo->prepare("DELETE FROM blog_images WHERE id = ?");
        $stmt->execute([$id]);
        
        // Delete physical file
        if (file_exists($image['file_path'])) {
            unlink($image['file_path']);
        }
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Image deleted successfully'
        ]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete image: ' . $e->getMessage()]);
    }
}

function markFeaturedImage($pdo) {
    try {
        $id = $_POST['id'] ?? '';
        $blog_id = $_POST['blog_id'] ?? '';
        
        if (empty($id) || empty($blog_id)) {
            echo json_encode(['status' => 'error', 'message' => 'Image ID and Blog ID are required']);
            return;
        }
        
        // Remove featured status from other images in this blog
        $stmt = $pdo->prepare("UPDATE blog_images SET is_featured = 0 WHERE blog_id = ?");
        $stmt->execute([$blog_id]);
        
        // Set this image as featured
        $stmt = $pdo->prepare("UPDATE blog_images SET is_featured = 1 WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Image marked as featured'
        ]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update image: ' . $e->getMessage()]);
    }
}

function markUnusedImages($pdo) {
    try {
        $blog_id = $_POST['blog_id'] ?? '';
        $content = $_POST['content'] ?? '';
        
        if (empty($blog_id) || empty($content)) {
            echo json_encode(['status' => 'error', 'message' => 'Blog ID and content are required']);
            return;
        }
        
        // Get all images for this blog
        $stmt = $pdo->prepare("SELECT id, file_url FROM blog_images WHERE blog_id = ?");
        $stmt->execute([$blog_id]);
        $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($images as $image) {
            // Check if image URL is in content
            $is_used = strpos($content, $image['file_url']) !== false ? 1 : 0;
            
            // Update usage status
            $updateStmt = $pdo->prepare("UPDATE blog_images SET is_used = ? WHERE id = ?");
            $updateStmt->execute([$is_used, $image['id']]);
        }
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Image usage status updated'
        ]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update image usage: ' . $e->getMessage()]);
    }
}

function markUnusedSingle($pdo) {
    try {
        $filename = $_POST['filename'] ?? '';
        
        if (empty($filename)) {
            echo json_encode(['status' => 'error', 'message' => 'Filename is required']);
            return;
        }
        
        // Update image as unused based on filename
        $stmt = $pdo->prepare("UPDATE blog_images SET is_used = 0, updated_at = NOW() WHERE filename = ? OR file_url LIKE ?");
        $stmt->execute([$filename, '%' . $filename]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'success', 'message' => 'Image marked as unused']);
        } else {
            echo json_encode(['status' => 'info', 'message' => 'Image not found in database']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to mark image as unused: ' . $e->getMessage()]);
    }
}

function cleanupUnusedImages($pdo) {
    try {
        // Get unused images older than 24 hours
        $stmt = $pdo->prepare("
            SELECT id, file_path 
            FROM blog_images 
            WHERE is_used = 0 
            AND created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR)
        ");
        $stmt->execute();
        $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $deleted_count = 0;
        
        foreach ($images as $image) {
            // Delete physical file
            if (file_exists($image['file_path'])) {
                unlink($image['file_path']);
            }
            
            // Delete from database
            $deleteStmt = $pdo->prepare("DELETE FROM blog_images WHERE id = ?");
            $deleteStmt->execute([$image['id']]);
            
            $deleted_count++;
        }
        
        echo json_encode([
            'status' => 'success',
            'message' => "Cleaned up {$deleted_count} unused images"
        ]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to cleanup images: ' . $e->getMessage()]);
    }
}
?>
