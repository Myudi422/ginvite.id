<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}


require __DIR__ . '/../db.php';

$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
if (!$user_id) {
    echo json_encode(['status' => 'error', 'message' => 'user_id diperlukan']);
    exit;
}

$stmt = $pdo->prepare("SELECT nomor_wa FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if ($row && !empty($row['nomor_wa'])) {
    echo json_encode(['status' => 'ok', 'nomor_wa' => $row['nomor_wa']]);
} else {
    echo json_encode(['status' => 'notfound']);
}
