<?php
// page/wedding_planner.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php';

function wp_error($code, $msg) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

function wp_ok($data = null, $message = 'OK') {
    echo json_encode(['status' => 'success', 'message' => $message, 'data' => $data], JSON_UNESCAPED_UNICODE);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$type   = trim($_GET['type'] ?? '');
$body   = in_array($method, ['POST','DELETE'])
    ? (json_decode(file_get_contents('php://input'), true) ?? [])
    : [];

$uid   = (int)($_GET['user_id']          ?? $body['user_id']          ?? 0);
$title = trim($_GET['invitation_title']  ?? $body['invitation_title']  ?? '');

// DELETE and update/toggle actions only need an id
$skip_uid = ($method === 'DELETE') || in_array($type, [
    'admin_tasks_toggle',
    'seserahan_toggle',
    'vendors_update',
    'seragam_update',
    'seserahan_update',
]);
if (!$skip_uid && (!$uid || $title === '')) {
    wp_error(400, 'Parameter user_id dan invitation_title diperlukan');
}

try {

    // SUMMARY
    if ($type === 'summary' && $method === 'GET') {
        $s = $pdo->prepare("SELECT budget_total, savings_goal FROM wedding_planner WHERE user_id=? AND invitation_title=? LIMIT 1");
        $s->execute([$uid, $title]);
        $planner = $s->fetch() ?: [];

        $s = $pdo->prepare("SELECT COALESCE(SUM(price),0) FROM wp_vendors WHERE user_id=? AND invitation_title=?");
        $s->execute([$uid, $title]);
        $vendor_spent = (float)$s->fetchColumn();

        $s = $pdo->prepare("SELECT COALESCE(SUM(jumlah*biaya_per_pcs),0) FROM wp_seragam WHERE user_id=? AND invitation_title=?");
        $s->execute([$uid, $title]);
        $seragam_spent = (float)$s->fetchColumn();

        $s = $pdo->prepare("SELECT COALESCE(SUM(estimasi_harga),0) FROM wp_seserahan WHERE user_id=? AND invitation_title=?");
        $s->execute([$uid, $title]);
        $seserahan_spent = (float)$s->fetchColumn();

        $s = $pdo->prepare("SELECT COALESCE(SUM(actual_amount),0) FROM wp_budget_items WHERE user_id=? AND invitation_title=?");
        $s->execute([$uid, $title]);
        $misc_spent = (float)$s->fetchColumn();

        $total_spent = $vendor_spent + $seragam_spent + $seserahan_spent + $misc_spent;

        $s = $pdo->prepare("SELECT COUNT(*) AS total, SUM(status='lunas') AS lunas, SUM(status='booking') AS booking FROM wp_vendors WHERE user_id=? AND invitation_title=?");
        $s->execute([$uid, $title]);
        $vendor = $s->fetch();

        $s = $pdo->prepare("SELECT COUNT(*) AS total, SUM(is_done) AS done FROM wp_admin_tasks WHERE user_id=? AND invitation_title=?");
        $s->execute([$uid, $title]);
        $admin = $s->fetch();

        $s = $pdo->prepare("SELECT COALESCE(SUM(jumlah),0) AS pcs, COALESCE(SUM(jumlah*biaya_per_pcs),0) AS biaya FROM wp_seragam WHERE user_id=? AND invitation_title=?");
        $s->execute([$uid, $title]);
        $seragam = $s->fetch();

        $s = $pdo->prepare("SELECT COUNT(*) AS total, SUM(is_bought) AS bought, COALESCE(SUM(estimasi_harga),0) AS est FROM wp_seserahan WHERE user_id=? AND invitation_title=?");
        $s->execute([$uid, $title]);
        $seserahan = $s->fetch();

        wp_ok([
            'budget_total'        => (float)($planner['budget_total']  ?? 0),
            'budget_spent'        => $total_spent,
            'vendor_count'        => (int)($vendor['total']            ?? 0),
            'vendor_lunas'        => (int)($vendor['lunas']            ?? 0),
            'vendor_booking'      => (int)($vendor['booking']          ?? 0),
            'admin_total'         => (int)($admin['total']             ?? 0),
            'admin_done'          => (int)($admin['done']              ?? 0),
            'seragam_total_pcs'   => (int)($seragam['pcs']             ?? 0),
            'seragam_total_biaya' => (float)($seragam['biaya']         ?? 0),
            'seserahan_total'     => (int)($seserahan['total']         ?? 0),
            'seserahan_bought'    => (int)($seserahan['bought']        ?? 0),
            'seserahan_est'       => (float)($seserahan['est']         ?? 0),
        ]);
    }

    // BUDGET BREAKDOWN
    if ($type === 'budget_breakdown' && $method === 'GET') {
        $s = $pdo->prepare("SELECT budget_total FROM wedding_planner WHERE user_id=? AND invitation_title=? LIMIT 1");
        $s->execute([$uid, $title]);
        $budget_total = (float)($s->fetchColumn() ?: 0);

        $s = $pdo->prepare("SELECT id, vendor_name AS name, category, price AS amount, status FROM wp_vendors WHERE user_id=? AND invitation_title=? ORDER BY category, id");
        $s->execute([$uid, $title]);
        $vendors = $s->fetchAll();
        $vendor_total = array_sum(array_column($vendors, 'amount'));

        $s = $pdo->prepare("SELECT id, kelompok AS name, jumlah, biaya_per_pcs, (jumlah*biaya_per_pcs) AS amount FROM wp_seragam WHERE user_id=? AND invitation_title=? ORDER BY id");
        $s->execute([$uid, $title]);
        $seragam = $s->fetchAll();
        $seragam_total = array_sum(array_column($seragam, 'amount'));

        $s = $pdo->prepare("SELECT id, item_name AS name, estimasi_harga AS amount, is_bought FROM wp_seserahan WHERE user_id=? AND invitation_title=? ORDER BY id");
        $s->execute([$uid, $title]);
        $seserahan = $s->fetchAll();
        $seserahan_total = array_sum(array_column($seserahan, 'amount'));

        $s = $pdo->prepare("SELECT * FROM wp_budget_items WHERE user_id=? AND invitation_title=? ORDER BY id");
        $s->execute([$uid, $title]);
        $misc = $s->fetchAll();
        $misc_total = array_sum(array_column($misc, 'actual_amount'));

        wp_ok([
            'budget_total' => $budget_total,
            'total_spent'  => $vendor_total + $seragam_total + $seserahan_total + $misc_total,
            'sections' => [
                ['source'=>'vendor',    'label'=>'Vendor',    'total'=>(float)$vendor_total,    'items'=>$vendors],
                ['source'=>'seragam',   'label'=>'Seragam',   'total'=>(float)$seragam_total,   'items'=>$seragam],
                ['source'=>'seserahan', 'label'=>'Seserahan', 'total'=>(float)$seserahan_total, 'items'=>$seserahan],
                ['source'=>'misc',      'label'=>'Lainnya',   'total'=>(float)$misc_total,      'items'=>$misc],
            ],
        ]);
    }

    // BUDGET TOTAL
    if ($type === 'budget_total' && $method === 'POST') {
        $val = (float)($body['budget_total'] ?? 0);
        $s = $pdo->prepare("INSERT INTO wedding_planner (user_id,invitation_title,budget_total) VALUES (?,?,?) ON DUPLICATE KEY UPDATE budget_total=VALUES(budget_total), updated_at=NOW()");
        $s->execute([$uid, $title, $val]);
        wp_ok(null, 'Target budget disimpan');
    }

    // MISC BUDGET ITEMS
    if ($type === 'budget') {
        if ($method === 'POST') {
            $s = $pdo->prepare("INSERT INTO wp_budget_items (user_id,invitation_title,category,item_name,budget_amount,actual_amount,note) VALUES (?,?,?,?,?,?,?)");
            $s->execute([$uid, $title, $body['category']??'Lainnya', $body['item_name']??'', (float)($body['budget_amount']??0), (float)($body['actual_amount']??0), $body['note']??'']);
            wp_ok(null, 'Item ditambahkan');
        }
        if ($method === 'DELETE') {
            $s = $pdo->prepare("DELETE FROM wp_budget_items WHERE id=?");
            $s->execute([(int)($body['id']??0)]);
            wp_ok(null, 'Item dihapus');
        }
    }

    // VENDORS
    if ($type === 'vendors') {
        if ($method === 'GET') {
            $s = $pdo->prepare("SELECT * FROM wp_vendors WHERE user_id=? AND invitation_title=? ORDER BY FIELD(status,'lunas','dp','booking','survey'), id");
            $s->execute([$uid, $title]);
            wp_ok($s->fetchAll());
        }
        if ($method === 'POST') {
            $status = in_array($body['status']??'', ['survey','booking','dp','lunas']) ? $body['status'] : 'survey';
            $s = $pdo->prepare("INSERT INTO wp_vendors (user_id,invitation_title,vendor_name,category,price,contact,status,note) VALUES (?,?,?,?,?,?,?,?)");
            $s->execute([$uid, $title, $body['vendor_name']??'', $body['category']??'', (float)($body['price']??0), $body['contact']??'', $status, $body['note']??'']);
            wp_ok(null, 'Vendor ditambahkan');
        }
        if ($method === 'DELETE') {
            $s = $pdo->prepare("DELETE FROM wp_vendors WHERE id=?");
            $s->execute([(int)($body['id']??0)]);
            wp_ok(null, 'Vendor dihapus');
        }
    }

    if ($type === 'vendors_update' && $method === 'POST') {
        $status = in_array($body['status']??'', ['survey','booking','dp','lunas']) ? $body['status'] : 'survey';
        $s = $pdo->prepare("UPDATE wp_vendors SET vendor_name=?, category=?, price=?, contact=?, status=?, note=? WHERE id=?");
        $s->execute([$body['vendor_name']??'', $body['category']??'', (float)($body['price']??0), $body['contact']??'', $status, $body['note']??'', (int)($body['id']??0)]);
        wp_ok(null, 'Vendor diperbarui');
    }

    // ADMINISTRASI
    if ($type === 'admin_tasks') {
        if ($method === 'GET') {
            $s = $pdo->prepare("SELECT * FROM wp_admin_tasks WHERE user_id=? AND invitation_title=? ORDER BY is_done ASC, id ASC");
            $s->execute([$uid, $title]);
            $rows = array_map(fn($r) => array_merge($r, ['is_done' => (bool)$r['is_done']]), $s->fetchAll());
            wp_ok($rows);
        }
        if ($method === 'POST') {
            $s = $pdo->prepare("INSERT INTO wp_admin_tasks (user_id,invitation_title,task_name,is_done,due_date) VALUES (?,?,?,?,?)");
            $s->execute([$uid, $title, $body['task_name']??'', (int)($body['is_done']??0), ($body['due_date']?:null)]);
            wp_ok(null, 'Tugas ditambahkan');
        }
        if ($method === 'DELETE') {
            $s = $pdo->prepare("DELETE FROM wp_admin_tasks WHERE id=?");
            $s->execute([(int)($body['id']??0)]);
            wp_ok(null, 'Tugas dihapus');
        }
    }

    if ($type === 'admin_tasks_toggle' && $method === 'POST') {
        $s = $pdo->prepare("UPDATE wp_admin_tasks SET is_done=? WHERE id=?");
        $s->execute([(int)($body['is_done']??0), (int)($body['id']??0)]);
        wp_ok(null, 'Status diperbarui');
    }

    // SERAGAM
    if ($type === 'seragam') {
        if ($method === 'GET') {
            $s = $pdo->prepare("SELECT * FROM wp_seragam WHERE user_id=? AND invitation_title=? ORDER BY id");
            $s->execute([$uid, $title]);
            wp_ok($s->fetchAll());
        }
        if ($method === 'POST') {
            $s = $pdo->prepare("INSERT INTO wp_seragam (user_id,invitation_title,kelompok,warna,bahan,jumlah,biaya_per_pcs,note) VALUES (?,?,?,?,?,?,?,?)");
            $s->execute([$uid, $title, $body['kelompok']??'', $body['warna']??'', $body['bahan']??'', (int)($body['jumlah']??1), (float)($body['biaya_per_pcs']??0), $body['note']??'']);
            wp_ok(null, 'Seragam ditambahkan');
        }
        if ($method === 'DELETE') {
            $s = $pdo->prepare("DELETE FROM wp_seragam WHERE id=?");
            $s->execute([(int)($body['id']??0)]);
            wp_ok(null, 'Item dihapus');
        }
    }

    if ($type === 'seragam_update' && $method === 'POST') {
        $s = $pdo->prepare("UPDATE wp_seragam SET kelompok=?, warna=?, bahan=?, jumlah=?, biaya_per_pcs=?, note=? WHERE id=?");
        $s->execute([$body['kelompok']??'', $body['warna']??'', $body['bahan']??'', (int)($body['jumlah']??1), (float)($body['biaya_per_pcs']??0), $body['note']??'', (int)($body['id']??0)]);
        wp_ok(null, 'Seragam diperbarui');
    }

    // SESERAHAN
    if ($type === 'seserahan') {
        if ($method === 'GET') {
            $s = $pdo->prepare("SELECT * FROM wp_seserahan WHERE user_id=? AND invitation_title=? ORDER BY is_bought ASC, id ASC");
            $s->execute([$uid, $title]);
            $rows = array_map(fn($r) => array_merge($r, ['is_bought' => (bool)$r['is_bought']]), $s->fetchAll());
            wp_ok($rows);
        }
        if ($method === 'POST') {
            $s = $pdo->prepare("INSERT INTO wp_seserahan (user_id,invitation_title,item_name,estimasi_harga,note) VALUES (?,?,?,?,?)");
            $s->execute([$uid, $title, $body['item_name']??'', (float)($body['estimasi_harga']??0), $body['note']??'']);
            wp_ok(null, 'Seserahan ditambahkan');
        }
        if ($method === 'DELETE') {
            $s = $pdo->prepare("DELETE FROM wp_seserahan WHERE id=?");
            $s->execute([(int)($body['id']??0)]);
            wp_ok(null, 'Item dihapus');
        }
    }

    if ($type === 'seserahan_toggle' && $method === 'POST') {
        $s = $pdo->prepare("UPDATE wp_seserahan SET is_bought=? WHERE id=?");
        $s->execute([(int)($body['is_bought']??0), (int)($body['id']??0)]);
        wp_ok(null, 'Status diperbarui');
    }

    if ($type === 'seserahan_update' && $method === 'POST') {
        $s = $pdo->prepare("UPDATE wp_seserahan SET item_name=?, estimasi_harga=?, note=? WHERE id=?");
        $s->execute([$body['item_name']??'', (float)($body['estimasi_harga']??0), $body['note']??'', (int)($body['id']??0)]);
        wp_ok(null, 'Seserahan diperbarui');
    }

    wp_error(400, "Tipe tidak dikenali: {$type}");

} catch (PDOException $e) {
    wp_error(500, 'Database error: ' . $e->getMessage());
}
?>