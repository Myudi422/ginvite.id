<?php
// simple_test_wa.php - Test dengan pesan sederhana

require __DIR__ . '/../db.php';

$fonteToken = 'YOUR_FONTE_TOKEN_HERE'; // Ganti dengan token asli
$fonteUrl = 'https://api.fonnte.com/send';
$targetPhone = '6282125182347'; // Nomor yang sama

// Pesan sederhana untuk test
$simpleMessage = "Test pesan sederhana dari Papunda.com\nWaktu: " . date('H:i:s');

echo "=== Test Pesan Sederhana ===\n";
echo "Target: {$targetPhone}\n";
echo "Message: {$simpleMessage}\n\n";

$postData = [
    'target' => $targetPhone,
    'message' => $simpleMessage,
    'countryCode' => '62'
];

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => $fonteUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POSTFIELDS => $postData,
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
    if (isset($result['status']) && $result['status']) {
        echo "✅ Pesan sederhana terkirim - ID: " . $result['id'][0] . "\n";
        echo "📝 Cek dashboard Fonte untuk status delivery\n";
    } else {
        echo "❌ Gagal: " . ($result['reason'] ?? 'Unknown') . "\n";
    }
}

echo "\n=== Selesai ===\n";
?>