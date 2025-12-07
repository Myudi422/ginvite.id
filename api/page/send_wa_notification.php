<?php
// send_wa_notification.php - Endpoint untuk mengirim notifikasi WhatsApp via Fonte API

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../../db.php';

function error($code, $msg) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

function sendWhatsAppNotification($phoneNumber, $message) {
    // Konfigurasi Fonte API
    $fonteToken = 'YOUR_FONTE_TOKEN_HERE'; // Ganti dengan token Fonte Anda
    $fonteUrl = 'https://api.fonnte.com/send';
    
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
        'countryCode' => '62',
        'typing' => true,
        'delay' => '2'
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

function generateNotificationMessage($userName, $slug, $category) {
    $categoryName = '';
    switch($category) {
        case 1:
            $categoryName = 'Khitanan';
            break;
        case 2:
            $categoryName = 'Pernikahan';
            break;
        default:
            $categoryName = 'Undangan';
    }
    
    $invitationUrl = "https://papunda.com/undang/" . $slug;
    
    $message = "🎉 *Terima kasih sudah membuat undangan di Papunda.com!*\n\n";
    $message .= "📋 *Detail Undangan Anda:*\n";
    $message .= "• Kategori: {$categoryName}\n";
    $message .= "• Nama: {$slug}\n";
    $message .= "• Link: {$invitationUrl}\n\n";
    $message .= "⚠️ *Penting!* Undangan Anda saat ini masih dalam mode *GRATIS* dengan fitur terbatas.\n\n";
    $message .= "✨ *Upgrade ke Premium untuk mendapatkan:*\n";
    $message .= "• ✅ RSVP & Konfirmasi Kehadiran\n";
    $message .= "• 💰 Fitur Transfer/Amplop Digital\n";
    $message .= "• 📱 QR Code Check-in\n";
    $message .= "• 🎵 Custom Music\n";
    $message .= "• 🖼️ Upload Foto Unlimited\n";
    $message .= "• 🎨 Tema Premium\n";
    $message .= "• 📊 Analytics Lengkap\n\n";
    $message .= "💳 *Cara Aktivasi Premium:*\n";
    $message .= "1. Login ke dashboard Anda\n";
    $message .= "2. Klik menu \"Edit\" pada undangan\n";
    $message .= "3. Pilih \"Aktifkan Premium\"\n";
    $message .= "4. Selesaikan pembayaran\n\n";
    $message .= "🤝 *Butuh bantuan?* Langsung chat kami di WhatsApp!\n\n";
    $message .= "Salam hangat,\n";
    $message .= "*Tim Papunda.com* 💖";
    
    return $message;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error(405, 'Method harus POST.');
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];

$user_id = isset($input['user_id']) ? (int)$input['user_id'] : 0;
$slug = isset($input['slug']) ? trim($input['slug']) : '';
$category_id = isset($input['category_id']) ? (int)$input['category_id'] : 0;

if (!$user_id || !$slug) {
    error(400, 'Parameter tidak valid. Diperlukan: user_id, slug.');
}

try {
    // Ambil data user dari database
    $stmt = $pdo->prepare("SELECT first_name, nomor_wa FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        error(404, 'User tidak ditemukan.');
    }
    
    if (empty($user['nomor_wa'])) {
        error(400, 'Nomor WhatsApp user tidak tersedia.');
    }
    
    // Generate pesan notifikasi
    $message = generateNotificationMessage($user['first_name'], $slug, $category_id);
    
    // Kirim notifikasi WhatsApp
    $result = sendWhatsAppNotification($user['nomor_wa'], $message);
    
    // Log activity (optional - buat tabel log jika diperlukan)
    // $logStmt = $pdo->prepare("INSERT INTO wa_notifications (user_id, phone_number, message, status, sent_at) VALUES (?, ?, ?, 'sent', NOW())");
    // $logStmt->execute([$user_id, $user['nomor_wa'], $message]);
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Notifikasi WhatsApp berhasil dikirim.',
        'fonte_response' => $result
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    // Log error (optional)
    error_log('WhatsApp notification error: ' . $e->getMessage());
    
    echo json_encode([
        'status' => 'error',
        'message' => 'Gagal mengirim notifikasi: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>