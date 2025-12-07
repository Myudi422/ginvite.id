<?php


header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');


// Jika ini preflight request, langsung akhiri
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json');
require __DIR__ . '/db.php';

$action = $_GET['action'] ?? 'main';
$action = preg_replace('/[^a-zA-Z0-9_]/', '', $action);

$endpointFile = __DIR__ . '/page/' . $action . '.php';

if (file_exists($endpointFile)) {
    include $endpointFile;
} else {
    http_response_code(404);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Endpoint not found: ' . $action
    ], JSON_UNESCAPED_UNICODE);
}
?>
