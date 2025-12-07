<?php
// check_message_status.php - Cek status pesan berdasarkan ID

$fonteToken = 'YOUR_FONTE_TOKEN_HERE'; // Ganti dengan token asli
$messageId = '134016065'; // ID pesan dari test sebelumnya

echo "=== Cek Status Message ID: {$messageId} ===\n";

// Fonte API untuk cek message history
$historyUrl = "https://api.fonnte.com/message-status?id={$messageId}";

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => $historyUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Authorization: ' . $fonteToken],
    CURLOPT_TIMEOUT => 30
]);

$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

echo "HTTP Code: {$httpCode}\n";
echo "Response: {$response}\n\n";

if ($response) {
    $result = json_decode($response, true);
    echo "Status Detail:\n";
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    if (isset($result['status'])) {
        switch($result['status']) {
            case 'pending':
                echo "\n⏳ Status: PENDING - Belum terkirim\n";
                echo "💡 Kemungkinan: Target offline/tidak valid\n";
                break;
            case 'sent':
                echo "\n✅ Status: SENT - Terkirim ke WhatsApp\n";
                break;
            case 'delivered':
                echo "\n📱 Status: DELIVERED - Diterima target\n";
                break;
            case 'failed':
                echo "\n❌ Status: FAILED - Gagal kirim\n";
                echo "Reason: " . ($result['reason'] ?? 'Unknown') . "\n";
                break;
        }
    }
}

echo "\n=== Selesai ===\n";
?>