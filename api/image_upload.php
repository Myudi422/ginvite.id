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
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Handle image upload for rich text editor
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(['error' => 'No file uploaded or upload error']);
            exit;
        }

        $upload_dir = 'uploads/editor/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }

        $file = $_FILES['file'];
        $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        
        // Validate file type
        $allowed_types = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!in_array($file_extension, $allowed_types)) {
            echo json_encode(['error' => 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.']);
            exit;
        }
        
        // Validate file size (10MB max for editor images)
        if ($file['size'] > 10 * 1024 * 1024) {
            echo json_encode(['error' => 'File size too large. Maximum 10MB allowed.']);
            exit;
        }
        
        // Generate unique filename
        $filename = uniqid() . '_' . time() . '.' . $file_extension;
        $file_path = $upload_dir . $filename;
        
        if (move_uploaded_file($file['tmp_name'], $file_path)) {
            // Return the URL for TinyMCE
            $image_url = 'https://ccgnimex.my.id/v2/android/ginvite/page/' . $file_path;
            
            // Save image metadata to database
            $blog_id = $_POST['blog_id'] ?? null; // Optional blog ID if editing existing blog
            
            $stmt = $pdo->prepare("
                INSERT INTO blog_images (blog_id, filename, original_name, file_path, file_url, file_size, mime_type, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            
            $stmt->execute([
                $blog_id,
                $filename,
                $file['name'],
                $file_path,
                $image_url,
                $file['size'],
                $file['type']
            ]);
            
            echo json_encode([
                'location' => $image_url,
                'success' => true,
                'image_id' => $pdo->lastInsertId(),
                'filename' => $filename
            ]);
        } else {
            echo json_encode(['error' => 'Failed to upload file']);
        }
        
    } catch (Exception $e) {
        echo json_encode(['error' => 'Upload failed: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
