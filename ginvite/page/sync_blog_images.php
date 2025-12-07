<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database configuration
$servername = "localhost";
$username = "ginvite";
$password = "ginvite";
$dbname = "aaaaaaac";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $blog_id = $_POST['blog_id'] ?? '';
        $content = $_POST['content'] ?? '';
        
        if (empty($blog_id) || empty($content)) {
            echo json_encode(['status' => 'error', 'message' => 'Blog ID and content are required']);
            exit;
        }
        
        // Extract all image URLs from content
        preg_match_all('/src="([^"]*uploads\/editor\/[^"]*)"/i', $content, $matches);
        $image_urls = $matches[1];
        
        $updated_images = [];
        $not_found_images = [];
        
        foreach ($image_urls as $image_url) {
            // Extract filename from URL
            $filename = basename($image_url);
            
            // Mark image as used and link to blog
            $stmt = $pdo->prepare("
                UPDATE blog_images 
                SET is_used = 1, blog_id = ?, updated_at = NOW() 
                WHERE filename = ?
            ");
            $stmt->execute([$blog_id, $filename]);
            
            if ($stmt->rowCount() > 0) {
                $updated_images[] = $filename;
            } else {
                $not_found_images[] = $filename;
            }
        }
        
        // Also mark any previously unused images from this blog as unused
        // (in case images were removed from content)
        $stmt = $pdo->prepare("
            SELECT filename FROM blog_images 
            WHERE blog_id = ? AND is_used = 1
        ");
        $stmt->execute([$blog_id]);
        $existing_images = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        $current_filenames = array_map('basename', $image_urls);
        $removed_images = array_diff($existing_images, $current_filenames);
        
        if (!empty($removed_images)) {
            $placeholders = str_repeat('?,', count($removed_images) - 1) . '?';
            $stmt = $pdo->prepare("
                UPDATE blog_images 
                SET is_used = 0, updated_at = NOW() 
                WHERE filename IN ($placeholders) AND blog_id = ?
            ");
            $params = array_merge($removed_images, [$blog_id]);
            $stmt->execute($params);
        }
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Image usage updated successfully',
            'updated_images' => $updated_images,
            'not_found_images' => $not_found_images,
            'removed_images' => $removed_images,
            'total_images' => count($image_urls)
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Only POST method allowed']);
    }
    
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
}
?>
