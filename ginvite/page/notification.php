<?php
// notification.php
header('Content-Type: application/json');

require __DIR__ . '/../db.php';
require __DIR__ . '/../../../../vendor/autoload.php';

// Midtrans config
\Midtrans\Config::$serverKey    = 'Mid-server-lznd51okcQRKsqxVcokhkpS0';
\Midtrans\Config::$isProduction = true;

// Terima JSON notification dari Midtrans
$input = file_get_contents('php://input');
if (!$input) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'No notification payload']);
    exit;
}

try {
    $notif = new \Midtrans\Notification();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>'Notification init error: '.$e->getMessage()]);
    exit;
}

// Ambil detail
$orderId            = $notif->order_id;                   // e.g. INV...
$transactionStatus  = $notif->transaction_status;         // e.g. capture/settlement/deny/etc
$fraudStatus        = $notif->fraud_status ?? null;       // untuk cc & 3DS

// Cari record payment berdasarkan order_id
$stmt = $pdo->prepare("SELECT * FROM payment WHERE order_id = ?");
$stmt->execute([$orderId]);
$payment = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$payment) {
    // Tidak ketemu order_id
    http_response_code(404);
    echo json_encode(['status'=>'error','message'=>'Payment record not found']);
    exit;
}

// Hanya tangani jika status belum settlement
if ($payment['status'] === 'settlement') {
    // Sudah di-settle sebelumnya, nothing to do
    http_response_code(200);
    echo json_encode(['status'=>'ok','message'=>'Already settled']);
    exit;
}

// Cek status yang masuk dari Midtrans
if ($transactionStatus === 'capture' || $transactionStatus === 'settlement') {
    // Success: update payment → settlement
    $updPay = $pdo->prepare("
      UPDATE payment
         SET status = 'settlement',
             payment_date = NOW()
       WHERE order_id = ?
    ");
    $updPay->execute([$orderId]);

    // Update content_user.status = 1 (aktif)
    $updCont = $pdo->prepare("
      UPDATE content_user
         SET status = 1,
             updated_at = NOW()
       WHERE id = ?
    ");
    $updCont->execute([$payment['id_content']]);

    http_response_code(200);
    echo json_encode(['status'=>'ok','message'=>'Payment settled and content activated']);
    exit;
}

// Jika fraud, deny, cancel, expired, dll.
if ($transactionStatus === 'deny' || $transactionStatus === 'cancel' || $transactionStatus === 'expire') {
    // Update payment → cancel atau expired
    $newStatus = $transactionStatus === 'deny' ? 'cancel' : $transactionStatus;
    $upd = $pdo->prepare("
      UPDATE payment
         SET status = ?,
             payment_date = NOW()
       WHERE order_id = ?
    ");
    $upd->execute([$newStatus, $orderId]);

    http_response_code(200);
    echo json_encode(['status'=>'ok','message'=>'Payment status updated to '.$newStatus]);
    exit;
}

// Default fallback
http_response_code(200);
echo json_encode(['status'=>'ok','message'=>'Notification received']);
