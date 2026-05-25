<?php
$host = '163.223.227.37';
$db = 'iqdyjeaz_papunda';
$user = 'iqdyjeaz_papunda';
$pass = 'Cinangka3_';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    // Auto-migrate: tambahkan kolom invitation_type jika belum ada
    try {
        $checkCol = $pdo->query("SHOW COLUMNS FROM invitation_shares LIKE 'invitation_type'");
        if (!$checkCol->fetch()) {
            try {
                $pdo->exec("ALTER TABLE invitation_shares ADD COLUMN invitation_type VARCHAR(20) DEFAULT 'legacy' AFTER invitation_id");
            } catch (Exception $ex) {
            }

            try {
                $pdo->exec("ALTER TABLE invitation_shares DROP INDEX unique_share");
            } catch (Exception $ex) {
            }

            try {
                $pdo->exec("ALTER TABLE invitation_shares ADD UNIQUE KEY unique_share (invitation_id, shared_email, invitation_type)");
            } catch (Exception $ex) {
            }
        }

        // Migrasi payment table
        $checkColPay = $pdo->query("SHOW COLUMNS FROM payment LIKE 'invitation_type'");
        if (!$checkColPay->fetch()) {
            $pdo->exec("ALTER TABLE payment ADD COLUMN invitation_type VARCHAR(20) DEFAULT 'legacy' AFTER id_content");
        }

        // Auto-alter builder_templates event_type column to VARCHAR(255) to support multiple categories
        try {
            $pdo->exec("ALTER TABLE builder_templates MODIFY COLUMN event_type VARCHAR(255) NOT NULL DEFAULT 'pernikahan'");
        } catch (Exception $ex) {
        }

        // Migrasi builder_pages table untuk kolom view
        try {
            $checkColView = $pdo->query("SHOW COLUMNS FROM builder_pages LIKE 'view'");
            if (!$checkColView->fetch()) {
                $pdo->exec("ALTER TABLE builder_pages ADD COLUMN view INT UNSIGNED NOT NULL DEFAULT 0 AFTER status");
            }
        } catch (Exception $ex) {
        }

        // Tambahkan indeks optimal untuk optimalisasi analis.php dan get_undangan.php
        try {
            $pdo->exec("ALTER TABLE users ADD INDEX idx_last_login (last_login)");
        } catch (Exception $ex) {}
        try {
            $pdo->exec("ALTER TABLE content_user ADD INDEX idx_updated_at (updated_at)");
        } catch (Exception $ex) {}
        try {
            $pdo->exec("ALTER TABLE builder_pages ADD INDEX idx_updated_at (updated_at)");
        } catch (Exception $ex) {}
        try {
            $pdo->exec("ALTER TABLE payment ADD INDEX idx_status_date_jumlah (status, payment_date, jumlah)");
        } catch (Exception $ex) {}
    } catch (Exception $e) {
        // Abaikan jika tabel belum dibuat
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    exit;
}
?>