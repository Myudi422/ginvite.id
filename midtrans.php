<?php
// midtrans.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

require __DIR__ . '/../db.php';
require __DIR__ . '/../../../../vendor/autoload.php';

// (2) Konfigurasi Midtrans — pastikan key & flag production sesuai
\Midtrans\Config::$serverKey    = 'Mid-server-lznd51okcQRKsqxVcokhkpS0';
\Midtrans\Config::$isProduction = true;

function error($code, $msg) {
    http_response_code($code);
    echo json_encode(['status'=>'error','message'=>$msg], JSON_UNESCAPED_SLASHES);
    exit;
}

// 0. Parse input
$input      = json_decode(file_get_contents('php://input'), true) ?: [];
$user_id    = (int)($input['user_id']     ?? 0);
$id_content = (int)($input['id_content'] ?? 0);
$title      = trim($input['title']       ?? '');
if (!$user_id || !$id_content || $title==='') {
    error(400, 'Parameter tidak lengkap (user_id, id_content, title).');
}

// 1. Sum & count settled payments
$stmt = $pdo->prepare("
    SELECT COUNT(*) AS cnt, COALESCE(SUM(jumlah),0) AS total_paid
    FROM payment
    WHERE id_user     = ?
      AND id_content = ?
      AND status      = 'settlement'
");
$stmt->execute([$user_id, $id_content]);
$paidInfo       = $stmt->fetch(PDO::FETCH_ASSOC);
$totalPaid      = (float)$paidInfo['total_paid'];
$alreadyCount = (int)$paidInfo['cnt'];

// 2. Load fullAmount from content_user
$sql = "SELECT content FROM content_user WHERE user_id=? AND id=? AND title=?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id, $id_content, $title]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$row) error(404, 'Data content_user tidak ditemukan.');
$content = json_decode($row['content'], true);

// Set $fullAmount to null if 'jumlah' is not present
$fullAmount = isset($content['jumlah']) ? (float)$content['jumlah'] : null;

// 3. If already fully paid or already 2 settlements, return “paid”
if ($fullAmount !== null && ($totalPaid >= $fullAmount || $alreadyCount >= 2)) {
    echo json_encode(['status'=>'paid','message'=>'Sudah terbayar penuh.']);
    exit;
}

// 4. Compute the amount to charge (only if $fullAmount is not null)
$amountToCharge = ($fullAmount !== null) ? ($fullAmount - $totalPaid) : 0; // Or handle this differently

// 5. Prepare a brand-new order_id + Midtrans payload
$order_id = 'INV'.time().rand(1000,9999);
$transaction_details = [
    'order_id'      => $order_id,
    'gross_amount' => $amountToCharge,
];
$item_details = [[
    'id'        => $id_content,
    'price'     => $amountToCharge,
    'quantity' => 1,
    'name'      => 'Undangan: '.$title,
]];
$payload = [
    'transaction_details' => $transaction_details,
    'item_details'          => $item_details,
];

// 6. Generate Snap token
try {
    $snapToken = \Midtrans\Snap::getSnapToken($payload);
} catch (Exception $e) {
    error(500, 'Midtrans error: '.$e->getMessage());
}

// 7. Check for existing pending invoice
$stmt = $pdo->prepare("
    SELECT id
    FROM payment
    WHERE id_user     = ?
      AND id_content = ?
      AND status      = 'pending'
    LIMIT 1
");
$stmt->execute([$user_id, $id_content]);
$pending = $stmt->fetch(PDO::FETCH_ASSOC);

if ($pending) {
    // 8a. UPDATE existing pending row
    $upd = $pdo->prepare("
        UPDATE payment
        SET order_id      = ?,
            payment_date= NOW(),
            jumlah        = ?,
            paket         = ?,
            snap_token    = ?
        WHERE id = ?
    ");
    $upd->execute([
        $order_id,
        $amountToCharge,
        $title,
        $snapToken,
        $pending['id']
    ]);

} else {
    // 8b. INSERT new pending row
    $ins = $pdo->prepare("
        INSERT INTO payment
        (id_user, id_content, order_id, payment_date, jumlah, paket, snap_token, status)
        VALUES
        (?, ?, ?, NOW(), ?, ?, ?, 'pending')
    ");
    $ins->execute([
        $user_id,
        $id_content,
        $order_id,
        $amountToCharge,
        $title,
        $snapToken
    ]);
}

// 9. Return the pending invoice info
echo json_encode([
    'status'      => 'pending',
    'order_id'    => $order_id,
    'snap_token' => $snapToken,
]);