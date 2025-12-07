<?php
// wa_notification_helper.php - Helper functions untuk mengirim notifikasi WhatsApp

function sendWhatsAppNotification($phoneNumber, $message) {
    // Load configuration
    $configFile = __DIR__ . '/config_wa.php';
    if (file_exists($configFile)) {
        $config = require $configFile;
        $fonteToken = $config['fonte']['token'];
        $fonteUrl = $config['fonte']['api_url'];
        $timeout = $config['fonte']['timeout'];
        $countryCode = $config['fonte']['country_code'];
    } else {
        // Fallback ke hardcoded values jika config tidak ada
        $fonteToken = 'YOUR_FONTE_TOKEN_HERE'; // PENTING: Ganti dengan token Fonte yang valid
        $fonteUrl = 'https://api.fonnte.com/send';
        $timeout = 30;
        $countryCode = '62';
    }
    
    // Format nomor telepon untuk Indonesia
    if (strpos($phoneNumber, '0') === 0) {
        $phoneNumber = '62' . substr($phoneNumber, 1);
    } elseif (strpos($phoneNumber, '+62') === 0) {
        $phoneNumber = substr($phoneNumber, 1);
    } elseif (strpos($phoneNumber, '62') !== 0) {
        $phoneNumber = '62' . $phoneNumber;
    }
    
    $postData = [
        'target' => $phoneNumber,
        'message' => $message,
        'countryCode' => $countryCode,
        'typing' => true,
        'delay' => '2',
        'preview' => false // Disable link preview di WhatsApp
    ];
    
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => $fonteUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => $postData,
        CURLOPT_HTTPHEADER => [
            'Authorization: ' . $fonteToken
        ],
    ]);
    
    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $curlError = curl_error($curl);
    curl_close($curl);
    
    if ($curlError) {
        throw new Exception('Curl error: ' . $curlError);
    }
    
    if ($httpCode !== 200) {
        throw new Exception('HTTP Error: ' . $httpCode);
    }
    
    $result = json_decode($response, true);
    if (!$result || !$result['status']) {
        throw new Exception('Fonte API Error: ' . ($result['reason'] ?? 'Unknown error'));
    }
    
    return $result;
}

function generateInvitationCreatedMessage($userName, $slug, $category_id, $user_id) {
    $categoryName = '';
    switch($category_id) {
        case 1:
            $categoryName = 'Khitanan';
            break;
        case 2:
            $categoryName = 'Pernikahan';
            break;
        default:
            $categoryName = 'Undangan';
    }
    
    $invitationUrl = "https://papunda.com/undang/{$user_id}/{$slug}";
    
    // Versi lebih pendek untuk menghindari issue pending
    $message = "🎉 *Terima kasih sudah membuat undangan di Papunda.com!*\n\n";
    $message .= "📋 *Detail Undangan:*\n";
    $message .= "• Kategori: {$categoryName}\n";
    $message .= "• Nama: {$slug}\n";
    $message .= "• Link: {$invitationUrl}\n\n";
    $message .= "⚠️ *Undangan masih mode GRATIS dengan fitur terbatas.*\n\n";
    $message .= "💳 *Aktivasi:* Login → Edit → Aktifkan\n\n";
    $message .= "🤝 Butuh bantuan? Chat kami!\n\n";
    $message .= "Salam hangat,\n*Tim Papunda.com* 💖";
    
    return $message;
}

function sendInvitationNotification($pdo, $user_id, $slug, $category_id) {
    try {
        // Ambil data user dari database
        $stmt = $pdo->prepare("SELECT first_name, nomor_wa FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            throw new Exception('User tidak ditemukan.');
        }
        
        if (empty($user['nomor_wa'])) {
            // Jika tidak ada nomor WA, skip tanpa error
            return ['status' => 'skipped', 'message' => 'Nomor WhatsApp tidak tersedia'];
        }
        
        // Generate pesan notifikasi
        $message = generateInvitationCreatedMessage($user['first_name'], $slug, $category_id, $user_id);
        
        // Kirim notifikasi WhatsApp
        $result = sendWhatsAppNotification($user['nomor_wa'], $message);
        
        return [
            'status' => 'success',
            'message' => 'Notifikasi WhatsApp berhasil dikirim.',
            'fonte_response' => $result
        ];
        
    } catch (Exception $e) {
        // Log error tapi jangan gagalkan proses utama
        error_log('WhatsApp notification error: ' . $e->getMessage());
        
        return [
            'status' => 'error',
            'message' => $e->getMessage()
        ];
    }
}
?>