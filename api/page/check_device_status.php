<?php
// check_device_status.php - Cek status device Fonte

$fonteToken = 'YOUR_FONTE_TOKEN_HERE'; // Ganti dengan token asli
$deviceUrl = 'https://api.fonnte.com/device';

echo "=== Cek Status Device Fonte ===\n";

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => $deviceUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: ' . $fonteToken
    ],
]);

$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

echo "HTTP Code: {$httpCode}\n";
echo "Response: {$response}\n\n";

if ($response) {
    $result = json_decode($response, true);
    echo "Device Status:\n";
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    if (isset($result['device_status'])) {
        if ($result['device_status'] === 'connect') {
            echo "\n✅ Device CONNECTED - Siap mengirim pesan\n";
        } else {
            echo "\n❌ Device DISCONNECTED - Perlu reconnect\n";
            echo "👉 Login ke dashboard Fonte dan scan QR code\n";
        }
    }
}

echo "\n=== Selesai ===\n";
?>