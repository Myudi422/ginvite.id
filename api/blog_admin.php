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
        listBlogs($pdo);
        break;
    case 'create':
        createBlog($pdo);
        break;
    case 'update':
        updateBlog($pdo);
        break;
    case 'delete':
        deleteBlog($pdo);
        break;
    case 'get':
        getBlog($pdo);
        break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        break;
}

function listBlogs($pdo) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM blogs ORDER BY created_at DESC");
        $stmt->execute();
        $blogs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'status' => 'success',
            'data' => $blogs
        ]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch blogs: ' . $e->getMessage()]);
    }
}

function createBlog($pdo) {
    try {
        $title = $_POST['title'] ?? '';
        $slug = $_POST['slug'] ?? '';
        $content = $_POST['content'] ?? '';
        $category = $_POST['category'] ?? '';
        $status = $_POST['status'] ?? 'draft';
        
        // Validate required fields
        if (empty($title) || empty($slug) || empty($content) || empty($category)) {
            echo json_encode(['status' => 'error', 'message' => 'All required fields must be filled']);
            return;
        }
        
        // Check if slug already exists
        $stmt = $pdo->prepare("SELECT id FROM blogs WHERE slug = ?");
        $stmt->execute([$slug]);
        if ($stmt->fetch()) {
            echo json_encode(['status' => 'error', 'message' => 'Slug already exists']);
            return;
        }
        
        $image_url = '';
        
        // Handle file upload
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = 'uploads/blog/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0755, true);
            }
            
            $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
            $filename = uniqid() . '_' . time() . '.' . $file_extension;
            $file_path = $upload_dir . $filename;
            
            // Validate file type
            $allowed_types = ['jpg', 'jpeg', 'png', 'gif'];
            if (!in_array(strtolower($file_extension), $allowed_types)) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid file type. Only JPG, PNG, and GIF are allowed.']);
                return;
            }
            
            // Validate file size (5MB max)
            if ($_FILES['image']['size'] > 5 * 1024 * 1024) {
                echo json_encode(['status' => 'error', 'message' => 'File size too large. Maximum 5MB allowed.']);
                return;
            }
            
            if (move_uploaded_file($_FILES['image']['tmp_name'], $file_path)) {
                $image_url = 'https://ccgnimex.my.id/v2/android/ginvite/' . $file_path;
            }
        }
        
        // Insert blog into database
        $stmt = $pdo->prepare("
            INSERT INTO blogs (title, slug, content, image_url, category, status, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        ");
        
        $stmt->execute([$title, $slug, $content, $image_url, $category, $status]);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Blog created successfully',
            'data' => [
                'id' => $pdo->lastInsertId(),
                'title' => $title,
                'slug' => $slug
            ]
        ]);
        
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to create blog: ' . $e->getMessage()]);
    }
}

function updateBlog($pdo) {
    try {
        $id = $_POST['id'] ?? '';
        $title = $_POST['title'] ?? '';
        $slug = $_POST['slug'] ?? '';
        $content = $_POST['content'] ?? '';
        $category = $_POST['category'] ?? '';
        $status = $_POST['status'] ?? 'draft';
        
        if (empty($id) || empty($title) || empty($slug) || empty($content) || empty($category)) {
            echo json_encode(['status' => 'error', 'message' => 'All required fields must be filled']);
            return;
        }
        
        // Check if slug already exists for other blogs
        $stmt = $pdo->prepare("SELECT id FROM blogs WHERE slug = ? AND id != ?");
        $stmt->execute([$slug, $id]);
        if ($stmt->fetch()) {
            echo json_encode(['status' => 'error', 'message' => 'Slug already exists']);
            return;
        }
        
        $image_url = '';
        
        // Handle file upload if new image is provided
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = 'uploads/blog/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0755, true);
            }
            
            $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
            $filename = uniqid() . '_' . time() . '.' . $file_extension;
            $file_path = $upload_dir . $filename;
            
            $allowed_types = ['jpg', 'jpeg', 'png', 'gif'];
            if (!in_array(strtolower($file_extension), $allowed_types)) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid file type']);
                return;
            }
            
            if ($_FILES['image']['size'] > 5 * 1024 * 1024) {
                echo json_encode(['status' => 'error', 'message' => 'File size too large']);
                return;
            }
            
            if (move_uploaded_file($_FILES['image']['tmp_name'], $file_path)) {
                $image_url = 'https://ccgnimex.my.id/v2/android/ginvite/' . $file_path;
                
                // Update with new image
                $stmt = $pdo->prepare("
                    UPDATE blogs 
                    SET title = ?, slug = ?, content = ?, image_url = ?, category = ?, status = ?, updated_at = NOW() 
                    WHERE id = ?
                ");
                $stmt->execute([$title, $slug, $content, $image_url, $category, $status, $id]);
            }
        } else {
            // Update without changing image
            $stmt = $pdo->prepare("
                UPDATE blogs 
                SET title = ?, slug = ?, content = ?, category = ?, status = ?, updated_at = NOW() 
                WHERE id = ?
            ");
            $stmt->execute([$title, $slug, $content, $category, $status, $id]);
        }
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Blog updated successfully'
        ]);
        
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update blog: ' . $e->getMessage()]);
    }
}

function deleteBlog($pdo) {
    try {
        $id = $_GET['id'] ?? '';
        
        if (empty($id)) {
            echo json_encode(['status' => 'error', 'message' => 'Blog ID is required']);
            return;
        }
        
        // Get blog data first to delete associated image file
        $stmt = $pdo->prepare("SELECT image_url FROM blogs WHERE id = ?");
        $stmt->execute([$id]);
        $blog = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$blog) {
            echo json_encode(['status' => 'error', 'message' => 'Blog not found']);
            return;
        }
        
        // Delete blog from database
        $stmt = $pdo->prepare("DELETE FROM blogs WHERE id = ?");
        $stmt->execute([$id]);
        
        // Delete associated image file if exists
        if (!empty($blog['image_url'])) {
            $file_path = str_replace('https://ccgnimex.my.id/v2/android/ginvite/', '', $blog['image_url']);
            if (file_exists($file_path)) {
                unlink($file_path);
            }
        }
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Blog deleted successfully'
        ]);
        
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete blog: ' . $e->getMessage()]);
    }
}

function getBlog($pdo) {
    try {
        $id = $_GET['id'] ?? '';
        $slug = $_GET['slug'] ?? '';
        
        if (empty($id) && empty($slug)) {
            echo json_encode(['status' => 'error', 'message' => 'Blog ID or slug is required']);
            return;
        }
        
        if (!empty($id)) {
            $stmt = $pdo->prepare("SELECT * FROM blogs WHERE id = ?");
            $stmt->execute([$id]);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM blogs WHERE slug = ?");
            $stmt->execute([$slug]);
        }
        
        $blog = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$blog) {
            echo json_encode(['status' => 'error', 'message' => 'Blog not found']);
            return;
        }
        
        echo json_encode([
            'status' => 'success',
            'data' => $blog
        ]);
        
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch blog: ' . $e->getMessage()]);
    }
}
?>
