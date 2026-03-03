<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Gunakan db.php agar konsisten dengan file lain
require_once __DIR__ . '/../db.php';

$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'list':
        listPublishedBlogs($pdo);
        break;
    case 'get':
        getPublishedBlog($pdo);
        break;
    case 'related':
        getRelatedBlogs($pdo);
        break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        break;
}

function listPublishedBlogs($pdo)
{
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = min(50, max(1, (int)($_GET['limit'] ?? 12)));
    $offset = ($page - 1) * $limit;
    $category = trim($_GET['category'] ?? '');

    $where = "WHERE status = 'published'";
    $params = [];

    if ($category !== '') {
        $where .= " AND category = :cat";
        $params[':cat'] = $category;
    }

    // Total count
    $countSql = "SELECT COUNT(*) FROM blogs $where";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    // Blog list — interpolate integers directly (safe karena sudah di-cast)
    $sql = "SELECT id, title, slug, image_url, category, created_at, updated_at,
                    LEFT(content, 300) AS excerpt
             FROM blogs
             $where
             ORDER BY created_at DESC
             LIMIT $limit OFFSET $offset";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $blogs = $stmt->fetchAll();

    // Bersihkan excerpt dari HTML
    foreach ($blogs as &$blog) {
        $plain = strip_tags($blog['excerpt']);
        $blog['excerpt'] = mb_strlen($plain) > 160
            ? mb_substr($plain, 0, 160) . '...'
            : $plain;
    }
    unset($blog);

    // Daftar kategori
    $catStmt = $pdo->query("SELECT DISTINCT category FROM blogs WHERE status = 'published' ORDER BY category");
    $categories = $catStmt->fetchAll(\PDO::FETCH_COLUMN);

    echo json_encode([
        'status' => 'success',
        'data' => $blogs,
        'meta' => [
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => $total > 0 ? (int)ceil($total / $limit) : 0,
        ],
        'categories' => $categories,
    ]);
}

function getPublishedBlog($pdo)
{
    $slug = trim($_GET['slug'] ?? '');
    $id = (int)($_GET['id'] ?? 0);

    if ($slug === '' && $id === 0) {
        echo json_encode(['status' => 'error', 'message' => 'slug or id is required']);
        return;
    }

    if ($slug !== '') {
        $stmt = $pdo->prepare("SELECT * FROM blogs WHERE slug = :slug AND status = 'published'");
        $stmt->execute([':slug' => $slug]);
    }
    else {
        $stmt = $pdo->prepare("SELECT * FROM blogs WHERE id = :id AND status = 'published'");
        $stmt->execute([':id' => $id]);
    }

    $blog = $stmt->fetch();
    if (!$blog) {
        echo json_encode(['status' => 'error', 'message' => 'Blog not found']);
        return;
    }

    echo json_encode(['status' => 'success', 'data' => $blog]);
}

function getRelatedBlogs($pdo)
{
    $category = trim($_GET['category'] ?? '');
    $exclude_id = (int)($_GET['exclude_id'] ?? 0);
    $limit = min(6, max(1, (int)($_GET['limit'] ?? 3)));

    $sql = "SELECT id, title, slug, image_url, category, created_at,
                    LEFT(content, 200) AS excerpt
             FROM blogs
             WHERE status = 'published' AND category = :cat AND id != :excl
             ORDER BY created_at DESC
             LIMIT $limit";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':cat' => $category, ':excl' => $exclude_id]);
    $blogs = $stmt->fetchAll();

    foreach ($blogs as &$blog) {
        $plain = strip_tags($blog['excerpt']);
        $blog['excerpt'] = mb_strlen($plain) > 120
            ? mb_substr($plain, 0, 120) . '...'
            : $plain;
    }
    unset($blog);

    echo json_encode(['status' => 'success', 'data' => $blogs]);
}
?>
