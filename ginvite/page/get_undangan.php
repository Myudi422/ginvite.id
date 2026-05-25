<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require __DIR__ . '/../db.php'; // pastikan db.php mendefinisikan $pdo

try {
    // Get filter parameters
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    $date_from = isset($_GET['date_from']) ? $_GET['date_from'] : null;
    $date_to = isset($_GET['date_to']) ? $_GET['date_to'] : null;
    $type = isset($_GET['type']) ? strtolower($_GET['type']) : 'update';  // default to update
    
    // Get pagination parameters
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;
    
    // Determine order by clause based on type
    $orderBy = ($type === 'id') ? "ORDER BY combined.id DESC" : "ORDER BY combined.updated_at DESC";

    // Build WHERE clause
    $whereConditions = [];
    $params = [];
    
    if ($id !== null) {
        $whereConditions[] = "combined.id = :id";
        $params[':id'] = $id;
    }
    
    if ($date_from !== null) {
        $whereConditions[] = "combined.updated_at >= :date_from";
        $params[':date_from'] = $date_from . ' 00:00:00';
    }
    
    if ($date_to !== null) {
        $whereConditions[] = "combined.updated_at <= :date_to";
        $params[':date_to'] = $date_to . ' 23:59:59';
    }
    
    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';

    // Query untuk menghitung total records
    $countQuery = "SELECT COUNT(*) as total FROM (
        SELECT 
            cu.id,
            CONVERT_TZ(cu.updated_at, '+00:00', '+07:00') as updated_at
        FROM content_user cu
        JOIN users u ON cu.user_id = u.id

        UNION ALL

        SELECT 
            bp.id,
            CONVERT_TZ(bp.updated_at, '+00:00', '+07:00') as updated_at
        FROM builder_pages bp
        JOIN users u ON bp.user_id = u.id
    ) AS combined " . $whereClause;

    $countStmt = $pdo->prepare($countQuery);
    foreach ($params as $key => $value) {
        $countStmt->bindValue($key, $value);
    }
    $countStmt->execute();
    $totalRecords = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
    $totalPages = ceil($totalRecords / $limit);

    // Query untuk mengambil data undangan dengan informasi user (UNION)
    $query = "SELECT 
        combined.id,
        combined.user_id,
        combined.title,
        combined.status,
        combined.updated_at,
        combined.view,
        combined.email,
        combined.nomor_wa,
        combined.first_name,
        combined.source
    FROM (
        SELECT 
            cu.id,
            cu.user_id,
            CONVERT(cu.title USING utf8mb4) COLLATE utf8mb4_unicode_ci AS title,
            cu.status,
            CONVERT_TZ(cu.updated_at, '+00:00', '+07:00') as updated_at,
            cu.view,
            u.email,
            u.nomor_wa,
            u.first_name,
            'legacy' AS source
        FROM content_user cu
        JOIN users u ON cu.user_id = u.id

        UNION ALL

        SELECT 
            bp.id,
            bp.user_id,
            CONVERT(bp.slug USING utf8mb4) COLLATE utf8mb4_unicode_ci AS title,
            bp.status,
            CONVERT_TZ(bp.updated_at, '+00:00', '+07:00') as updated_at,
            bp.view,
            u.email,
            u.nomor_wa,
            u.first_name,
            'builder' AS source
        FROM builder_pages bp
        JOIN users u ON bp.user_id = u.id
    ) AS combined
    " . $whereClause . "
    " . $orderBy . "
    LIMIT :limit OFFSET :offset";

    $stmt = $pdo->prepare($query);
    // Bind filter parameters
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format response dengan slug dan preview_url
    foreach ($result as &$row) {
        if ($row['source'] === 'builder') {
            $row['slug'] = $row['title'];
            $row['preview_url'] = "https://papunda.com/undang/{$row['user_id']}/{$row['title']}";
        } else {
            $slugTitle = urlencode(strtolower(str_replace(' ', '-', $row['title'])));
            $row['slug'] = $slugTitle;
            $row['preview_url'] = "https://papunda.com/undang/{$row['user_id']}/{$slugTitle}";
        }
    }
    
    // Format response
    $response = [
        'status' => 'success',
        'message' => 'Data retrieved successfully',
        'data' => $result,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total_records' => $totalRecords,
            'records_per_page' => $limit
        ]
    ];
    
    http_response_code(200);
    echo json_encode($response);

} catch (PDOException $e) {
    $response = [
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ];
    
    http_response_code(500);
    echo json_encode($response);
}
?>
