<?php
// page/add_content_user.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php';
require __DIR__ . '/wa_notification_helper.php';

function error($code, $msg)
{
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error(405, 'Method harus POST.');
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];

$user_id = isset($input['user_id']) ? (int)$input['user_id'] : 0;
$category_id = isset($input['category_id']) ? (int)$input['category_id'] : 0;
$title = isset($input['title']) ? trim($input['title']) : '';

// Load default JSON content
$defaultJson = file_get_contents(__DIR__ . '/default.json');
if ($defaultJson === false) {
    error(500, 'Gagal membaca default.json.');
}

// Determine content: use client data if non-empty, otherwise default
$userContent = $input['content'] ?? null;
if (is_null($userContent)) {
    $content = $defaultJson;
}
elseif (is_array($userContent)) {
    $content = count($userContent) > 0
        ? json_encode($userContent, JSON_UNESCAPED_UNICODE)
        : $defaultJson;
}
elseif (is_string($userContent)) {
    $trimmed = trim($userContent);
    $content = ($trimmed === '' || $trimmed === '{}' || $trimmed === '[]')
        ? $defaultJson
        : $userContent;
}
else {
    $content = $defaultJson;
}

if (!$user_id || !$category_id || $title === '') {
    error(400, 'Parameter tidak valid. Diperlukan: user_id, category_id, title di body.');
}

// Check for duplicate title for this user
$checkSql = "SELECT COUNT(*) FROM content_user WHERE user_id = ? AND title = ?";
$checkStmt = $pdo->prepare($checkSql);
$checkStmt->execute([$user_id, $title]);
if ($checkStmt->fetchColumn() > 0) {
    error(409, 'Title sudah ada untuk user ini.');
}

// Calculate expiration date (3 days from now)
$expired_date = date('Y-m-d H:i:s', strtotime('+3 days'));

// Insert with default theme_id = 1 and category_theme_id = 1
$sql = "INSERT INTO content_user 
    (user_id, category_id, content, title, status, theme_id, view, kategory_theme_id, expired) 
    VALUES (?, ?, ?, ?, 0, 1, 1, 1, ?)";
$stmt = $pdo->prepare($sql);
$ok = $stmt->execute([
    $user_id,
    $category_id,
    $content,
    $title,
    $expired_date
]);

if (!$ok) {
    error(500, 'Gagal membuat undangan baru.');
}

$invitation_id = $pdo->lastInsertId();

// Kirim notifikasi WhatsApp (async, tidak mempengaruhi response utama)
$waNotificationResult = sendInvitationNotification($pdo, $user_id, $title, $category_id);

echo json_encode([
    'status' => 'success',
    'message' => 'Undangan berhasil dibuat.',
    'id' => $invitation_id,
    'title' => $title,
    'wa_notification' => $waNotificationResult
], JSON_UNESCAPED_UNICODE);
?>
