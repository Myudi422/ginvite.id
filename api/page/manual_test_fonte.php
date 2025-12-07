<?php
// manual_test_fonte.php - Test manual Fonte API dengan debugging lebih detail

require __DIR__ . '/../db.php';

// Test data
$test_phone = '6282125182347'; // Nomor yang sama dengan test sebelumnya
$test_message = "Test manual dari API Fonte\nWaktu: " . date('Y-m-d H:i:s');

// Konfigurasi Fonte
$fonteToken = 'YOUR_FONTE_TOKEN_HERE'; // Ganti dengan token asli
$fonteUrl = 'https://api.fonnte.com/send';

echo "=== Manual Test Fonte API ===\n";
echo "Target: {$test_phone}\n";
echo "Message: {$test_message}\n";
echo "Token: " . substr($fonteToken, 0, 10) . "...\n\n";

$postData = [
    'target' => $test_phone,
    'message' => $test_message,
    'countryCode' => '62'
];

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => $fonteUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => $postData,
    CURLOPT_HTTPHEADER => [
        'Authorization: ' . $fonteToken
    ],
    CURLOPT_VERBOSE => true // Enable verbose untuk debugging
]);

$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$curlInfo = curl_getinfo($curl);
$curlError = curl_error($curl);
curl_close($curl);

echo "HTTP Code: {$httpCode}\n";
echo "Curl Error: " . ($curlError ?: 'None') . "\n";
echo "Response: " . $response . "\n\n";

if ($response) {
    $result = json_decode($response, true);
    echo "Parsed Response:\n";
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    echo "\n\n";
    
    if (isset($result['status']) && $result['status']) {
        echo "✅ API Call Success - Message ID: " . (is_array($result['id']) ? $result['id'][0] : $result['id']) . "\n";
        echo "📝 Check your Fonte dashboard for delivery status\n";
    } else {
        echo "❌ API Call Failed: " . ($result['reason'] ?? 'Unknown error') . "\n";
    }
}

echo "\n=== Test Selesai ===\n";
?>