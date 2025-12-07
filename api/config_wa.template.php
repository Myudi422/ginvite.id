<?php
// config_wa.php - Konfigurasi untuk WhatsApp notification
// RENAME FILE INI MENJADI config_wa.php SETELAH SETUP

return [
    // Fonte API Configuration
    'fonte' => [
        'token' => 'YOUR_FONTE_TOKEN_HERE', // Ganti dengan token Fonte yang valid
        'api_url' => 'https://api.fonnte.com/send',
        'timeout' => 30,
        'country_code' => '62' // Indonesia
    ],
    
    // Message Templates
    'templates' => [
        'invitation_created' => [
            'greeting' => '🎉 *Terima kasih sudah membuat undangan di Papunda.com!*',
            'details_header' => '📋 *Detail Undangan Anda:*',
            'warning' => '⚠️ *Penting!* Undangan Anda saat ini masih dalam mode *GRATIS* dengan fitur terbatas.',
            'premium_header' => '✨ *Upgrade ke Premium untuk mendapatkan:*',
            'premium_features' => [
                '• ✅ RSVP & Konfirmasi Kehadiran',
                '• 💰 Fitur Transfer/Amplop Digital', 
                '• 📱 QR Code Check-in',
                '• 🎵 Custom Music',
                '• 🖼️ Upload Foto Unlimited',
                '• 🎨 Tema Premium',
                '• 📊 Analytics Lengkap'
            ],
            'activation_header' => '💳 *Cara Aktivasi Premium:*',
            'activation_steps' => [
                '1. Login ke dashboard Anda',
                '2. Klik menu "Edit" pada undangan',
                '3. Pilih "Aktifkan Premium"',
                '4. Selesaikan pembayaran'
            ],
            'support' => '🤝 *Butuh bantuan?* Langsung chat kami di WhatsApp!',
            'signature' => "Salam hangat,\n*Tim Papunda.com* 💖"
        ]
    ],
    
    // Categories mapping
    'categories' => [
        1 => 'Khitanan',
        2 => 'Pernikahan',
        'default' => 'Undangan'
    ],
    
    // Website settings
    'site' => [
        'base_url' => 'https://papunda.com',
        'invitation_path' => '/undang/'
    ],
    
    // Logging settings
    'logging' => [
        'enabled' => true,
        'error_log' => true // Use PHP error_log function
    ]
];
?>