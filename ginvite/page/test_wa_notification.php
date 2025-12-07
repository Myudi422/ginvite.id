<?php
// test_wa_notification.php - Script test untuk notifikasi WhatsApp

require __DIR__ . '/../db.php';
require __DIR__ . '/wa_notification_helper.php';

// Test data
$test_user_id = 1; // Ganti dengan user ID yang valid
$test_slug = 'test-pernikahan-' . date('His');
$test_category = 2; // 1 = Khitanan, 2 = Pernikahan

echo "=== Testing WhatsApp Notification ===\n";
echo "User ID: {$test_user_id}\n";
echo "Slug: {$test_slug}\n";
echo "Category: {$test_category}\n\n";

// Test fungsi notifikasi
try {
    $result = sendInvitationNotification($pdo, $test_user_id, $test_slug, $test_category);
    
    echo "Result:\n";
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    echo "\n";
    
    if ($result['status'] === 'success') {
        echo "✅ Notifikasi berhasil dikirim!\n";
    } elseif ($result['status'] === 'skipped') {
        echo "⏭️ Notifikasi dilewati: " . $result['message'] . "\n";
    } else {
        echo "❌ Notifikasi gagal: " . $result['message'] . "\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n=== Test Selesai ===\n";

// Jika dijalankan via web browser
if (isset($_SERVER['HTTP_HOST'])) {
    echo "<pre>";
    // Content sudah di-output di atas
    echo "</pre>";
}
?>