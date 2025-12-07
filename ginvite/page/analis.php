<?php
/**
 * analis.php
 * Endpoint untuk mengambil data harian: users (login), invitations, revenue
 *
 * Dapat dipanggil lewat:
 *   GET /path/to/analis.php?start_date=2025-05-01&end_date=2025-05-31
 *
 * Output (JSON):
 * {
 *   "2025-05-01": { "users": 12, "invitations": 5,  "revenue": 100000.00 },
 *   "2025-05-02": { "users":  8, "invitations": 3,  "revenue":  75000.00 },
 *    ...
 * }
 */

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

require __DIR__ . '/../db.php';  // Pastikan file db.php meng‐ekspos $pdo (PDO instance)

// 1. Ambil dan validasi parameter GET
if (!isset($_GET['start_date']) || !isset($_GET['end_date'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Parameter start_date dan end_date wajib diisi.']);
    exit;
}

$startDateRaw = $_GET['start_date'];
$endDateRaw   = $_GET['end_date'];

// Validasi format tanggal: harus YYYY-MM-DD
function isValidDate(string $d) {
    $dt = DateTime::createFromFormat('Y-m-d', $d);
    return $dt && $dt->format('Y-m-d') === $d;
}

if (!isValidDate($startDateRaw) || !isValidDate($endDateRaw)) {
    http_response_code(400);
    echo json_encode(['error' => 'Format tanggal tidak valid. Gunakan YYYY-MM-DD.']);
    exit;
}

$sd = new DateTime($startDateRaw);
$ed = new DateTime($endDateRaw);

// Jika start > end, kita swap agar rentang valid
if ($sd > $ed) {
    $tmp = $sd;
    $sd = $ed;
    $ed = $tmp;
}

// 2. Buat array semua tanggal dari $sd ke $ed
$datesInRange = [];
$interval = new DateInterval('P1D');
$period = new DatePeriod($sd, $interval, $ed->add($interval)); // tambahkan interval agar inklusif

foreach ($period as $dt) {
    $datesInRange[] = $dt->format('Y-m-d');
}

// 3. Query 3 data: daily users, daily invitations, daily revenue

try {
    // 3a) DAILY ACTIVE USERS → berdasarkan DATE(last_login)
    $sqlUsers = "
        SELECT 
            DATE(last_login) AS dt, 
            COUNT(*) AS cnt_users
        FROM users
        WHERE last_login BETWEEN :s_full AND :e_full
        GROUP BY dt
    ";
    // Perlu meng‐include seluruh hari: set waktu 00:00 untuk start, 23:59:59 untuk end
    $stmtUsers = $pdo->prepare($sqlUsers);
    $stmtUsers->execute([
        ':s_full' => $sd->format('Y-m-d') . ' 00:00:00',
        ':e_full' => (new DateTime($ed->format('Y-m-d') . ' 23:59:59'))->format('Y-m-d H:i:s'),
    ]);
    $rowsUsers = $stmtUsers->fetchAll(PDO::FETCH_ASSOC);
    $mapUsers = [];
    foreach ($rowsUsers as $r) {
        $mapUsers[$r['dt']] = (int)$r['cnt_users'];
    }

    // 3b) DAILY INVITATIONS → berdasarkan DATE(updated_at) di tabel content_user
    $sqlInv = "
        SELECT 
            DATE(updated_at) AS dt, 
            COUNT(*) AS cnt_inv
        FROM content_user
        WHERE updated_at BETWEEN :s_full AND :e_full
        GROUP BY dt
    ";
    $stmtInv = $pdo->prepare($sqlInv);
    $stmtInv->execute([
        ':s_full' => $sd->format('Y-m-d') . ' 00:00:00',
        ':e_full' => (new DateTime($ed->format('Y-m-d') . ' 23:59:59'))->format('Y-m-d H:i:s'),
    ]);
    $rowsInv = $stmtInv->fetchAll(PDO::FETCH_ASSOC);
    $mapInv = [];
    foreach ($rowsInv as $r) {
        $mapInv[$r['dt']] = (int)$r['cnt_inv'];
    }

    // 3c) DAILY REVENUE → SUM(jumlah) WHERE status='settlement' berdasarkan DATE(payment_date)
    $sqlRev = "
        SELECT 
            DATE(payment_date) AS dt, 
            IFNULL(SUM(jumlah), 0) AS sum_rev
        FROM payment
        WHERE 
            status = 'settlement'
            AND payment_date BETWEEN :s_full AND :e_full
        GROUP BY dt
    ";
    $stmtRev = $pdo->prepare($sqlRev);
    $stmtRev->execute([
        ':s_full' => $sd->format('Y-m-d') . ' 00:00:00',
        ':e_full' => (new DateTime($ed->format('Y-m-d') . ' 23:59:59'))->format('Y-m-d H:i:s'),
    ]);
    $rowsRev = $stmtRev->fetchAll(PDO::FETCH_ASSOC);
    $mapRev = [];
    foreach ($rowsRev as $r) {
        // cast ke float karena DECIMAL(10,2)
        $mapRev[$r['dt']] = (float)$r['sum_rev'];
    }

    // 4. Gabungkan semua ke dalam satu objek
    $result = [];
    foreach ($datesInRange as $d) {
        $result[$d] = [
            'users'       => $mapUsers[$d] ?? 0,
            'invitations' => $mapInv[$d]  ?? 0,
            'revenue'     => $mapRev[$d]  ?? 0.00,
        ];
    }

    // 5. Output JSON
    echo json_encode($result, JSON_NUMERIC_CHECK);
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Query gagal: ' . $e->getMessage()]);
    exit;
}
