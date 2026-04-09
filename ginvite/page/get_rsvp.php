<?php
// get_rsvp.php — CRM: ambil semua data RSVP yang punya nomor WA
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php';

function sendError(int $code, string $message) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError(405, 'Method harus GET.');
}

try {
    // ── Pagination ──────────────────────────────────────────────
    $page   = max(1, (int)($_GET['page']  ?? 1));
    $limit  = min(500, max(1, (int)($_GET['limit'] ?? 50)));
    $offset = ($page - 1) * $limit;

    // ── Filter ──────────────────────────────────────────────────
    $search       = trim($_GET['search']       ?? '');
    $konfirmasi   = trim($_GET['konfirmasi']   ?? '');   // 'hadir' | 'tidak hadir' | ''
    $content_id   = isset($_GET['content_id']) && (int)$_GET['content_id'] > 0
                      ? (int)$_GET['content_id'] : null;

    // ── Build WHERE ──────────────────────────────────────────────
    $where  = ["r.wa IS NOT NULL", "r.wa != ''"]; // hanya yang ada nomor WA
    $params = [];

    if ($konfirmasi !== '') {
        $where[]              = "r.konfirmasi = :konfirmasi";
        $params[':konfirmasi'] = $konfirmasi;
    }

    if ($content_id !== null) {
        $where[]              = "r.content_id = :content_id";
        $params[':content_id'] = $content_id;
    }

    if ($search !== '') {
        $where[]          = "(r.nama LIKE :search OR r.wa LIKE :search)";
        $params[':search'] = "%$search%";
    }

    $whereSQL = 'WHERE ' . implode(' AND ', $where);

    // ── Count total ──────────────────────────────────────────────
    $countSQL = "
        SELECT COUNT(*) AS total
        FROM rsmp r
        LEFT JOIN content_user cu ON r.content_id = cu.id
        LEFT JOIN users u ON cu.user_id = u.id
        $whereSQL
    ";
    $countStmt = $pdo->prepare($countSQL);
    foreach ($params as $k => $v) $countStmt->bindValue($k, $v);
    $countStmt->execute();
    $total      = (int)$countStmt->fetchColumn();
    $totalPages = max(1, (int)ceil($total / $limit));

    // ── Fetch data ───────────────────────────────────────────────
    $dataSQL = "
        SELECT
            r.id,
            r.content_id,
            r.nama,
            r.wa,
            r.ucapan,
            r.konfirmasi,
            r.created_at,
            cu.title        AS judul_undangan,
            cu.user_id,
            u.first_name    AS nama_pemilik,
            u.email         AS email_pemilik,
            u.nomor_wa      AS wa_pemilik
        FROM rsmp r
        LEFT JOIN content_user cu ON r.content_id = cu.id
        LEFT JOIN users u ON cu.user_id = u.id
        $whereSQL
        ORDER BY r.created_at DESC
        LIMIT :limit OFFSET :offset
    ";

    $stmt = $pdo->prepare($dataSQL);
    foreach ($params as $k => $v) $stmt->bindValue($k, $v);
    $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ── Summary stats ────────────────────────────────────────────
    $statsSQL = "
        SELECT
            COUNT(*) AS total_rsvp,
            SUM(CASE WHEN r.konfirmasi = 'hadir'        THEN 1 ELSE 0 END) AS hadir,
            SUM(CASE WHEN r.konfirmasi = 'tidak hadir'  THEN 1 ELSE 0 END) AS tidak_hadir
        FROM rsmp r
        WHERE r.wa IS NOT NULL AND r.wa != ''
    ";
    $statsStmt = $pdo->query($statsSQL);
    $stats     = $statsStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'status'     => 'success',
        'data'       => $rows,
        'stats'      => $stats,
        'pagination' => [
            'current_page'    => $page,
            'total_pages'     => $totalPages,
            'total_records'   => $total,
            'records_per_page'=> $limit,
        ],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (PDOException $e) {
    sendError(500, 'Kesalahan database: ' . $e->getMessage());
}
?>
