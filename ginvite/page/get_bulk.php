<?php
// Enhanced get_bulk.php - Fixed for khitanan (circumcision) templates

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../db.php'; 

function error($code, $msg) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

$user_id = (int)($_GET['user_id'] ?? 0);
$title   = trim($_GET['title'] ?? '');

if (!$user_id || $title === '') {
    error(400, 'Parameter tidak valid. Diperlukan: user_id(int), title(string) di URL.');
}

try {
    $is_builder = false;
    // Query untuk mendapatkan category_id dan content dari tabel content_user
    $sql_content_user = "
        SELECT category_id, content
        FROM content_user
        WHERE user_id = ? AND title = ?
    ";
    $stmt_content_user = $pdo->prepare($sql_content_user);
    $stmt_content_user->execute([$user_id, $title]);
    $content_user_data = $stmt_content_user->fetch(PDO::FETCH_ASSOC);

    if (!$content_user_data) {
        // Coba cari di builder_pages
        $sql_builder = "
            SELECT id, event_type, page_data
            FROM builder_pages
            WHERE user_id = ? AND slug = ?
        ";
        $stmt_builder = $pdo->prepare($sql_builder);
        $stmt_builder->execute([$user_id, $title]);
        $builder_data = $stmt_builder->fetch(PDO::FETCH_ASSOC);

        if (!$builder_data) {
            error(404, 'Data undangan tidak ditemukan.');
        }

        $is_builder = true;
        $event_type = $builder_data['event_type'] ?? 'pernikahan';
        // Map event_type to category_id
        $category_id = ($event_type === 'khitanan') ? 1 : 2;
        $content_array = json_decode($builder_data['page_data'] ?? '{}', true) ?: [];
    } else {
        $category_id = $content_user_data['category_id'];
        $content_array = json_decode($content_user_data['content'], true) ?: [];
    }

    // Query untuk mendapatkan data dari tabel bulk berdasarkan category_id yang sama
    $sql_bulk = "
        SELECT
            id,
            category_id,
            text_undangan
        FROM
            bulk
        WHERE
            category_id = ?
    ";
    $stmt_bulk = $pdo->prepare($sql_bulk);
    $stmt_bulk->execute([$category_id]);
    $bulk_data = $stmt_bulk->fetchAll(PDO::FETCH_ASSOC);

    if (!$bulk_data) {
        echo json_encode(['status' => 'success', 'message' => 'Tidak ada data bulk ditemukan untuk category_id ini.', 'data' => []], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $processed_data = [];
    foreach ($bulk_data as $bulk_item) {
        $text_undangan = $bulk_item['text_undangan'];

        if ($is_builder) {
            // --- PARSER TIPE BUILDER ---
            $sections = $content_array['sections'] ?? [];
            $couple_section = null;
            $opening_section = null;
            $event_section = null;

            foreach ($sections as $sec) {
                if (($sec['type'] ?? '') === 'couple') {
                    $couple_section = $sec;
                }
                if (($sec['type'] ?? '') === 'opening') {
                    $opening_section = $sec;
                }
                if (($sec['type'] ?? '') === 'event_details') {
                    $event_section = $sec;
                }
            }

            // {event} placeholder
            $event_details = [];
            if ($event_section && isset($event_section['props']['events']) && is_array($event_section['props']['events'])) {
                foreach ($event_section['props']['events'] as $ev) {
                    $name = $ev['name'] ?? '';
                    $loc = $ev['location'] ?? '';
                    $date = $ev['date'] ?? '';
                    $time = $ev['time'] ?? '';
                    
                    if (!empty($name) || !empty($loc) || !empty($date) || !empty($time)) {
                        $parts = [];
                        if (!empty($loc)) $parts[] = $loc;
                        if (!empty($date)) $parts[] = $date;
                        if (!empty($time)) $parts[] = "pukul " . $time;
                        
                        $event_details[] = ($name ? "$name: " : "") . implode(", ", $parts);
                    }
                }
            }
            if (empty($event_details)) {
                $event_details[] = "[Waktu dan tempat akan diinformasikan kemudian]";
            }
            $event_string = implode("<br>", $event_details);

            // {children} & {parrent} placeholders
            $child_name = '';
            $parent_names = '';

            if ($category_id == 1) {
                // Khitanan atau sejenisnya
                if ($opening_section && isset($opening_section['props']['name_primary'])) {
                    $child_name = $opening_section['props']['name_primary'];
                }
                
                if (empty($child_name) && $couple_section && isset($couple_section['props']['person_a'])) {
                    $p_a = $couple_section['props']['person_a'];
                    if (is_array($p_a)) {
                        $child_name = $p_a['nickname'] ?? $p_a['name'] ?? '';
                    }
                }

                if ($couple_section && isset($couple_section['props']['person_a'])) {
                    $p_a = $couple_section['props']['person_a'];
                    if (is_array($p_a)) {
                        $f = $p_a['parent_father'] ?? '';
                        $m = $p_a['parent_mother'] ?? '';
                        if ($f && $m) $parent_names = $f . ' & ' . $m;
                        elseif ($f) $parent_names = $f;
                        elseif ($m) $parent_names = $m;
                    }
                }
            } else {
                // Pernikahan atau sejenisnya / umum
                $couple_names = [];
                if ($couple_section) {
                    $p_a = $couple_section['props']['person_a'] ?? null;
                    $p_b = $couple_section['props']['person_b'] ?? null;
                    if (is_array($p_a)) {
                        $name_a = $p_a['nickname'] ?? $p_a['name'] ?? '';
                        if ($name_a) $couple_names[] = $name_a;
                    }
                    if (is_array($p_b)) {
                        $name_b = $p_b['nickname'] ?? $p_b['name'] ?? '';
                        if ($name_b) $couple_names[] = $name_b;
                    }
                }
                if (empty($couple_names) && $opening_section) {
                    $p_a = $opening_section['props']['name_primary'] ?? '';
                    $p_b = $opening_section['props']['name_secondary'] ?? '';
                    if ($p_a) $couple_names[] = $p_a;
                    if ($p_b) $couple_names[] = $p_b;
                }
                $child_name = implode(' & ', $couple_names);

                if ($couple_section) {
                    $p_a = $couple_section['props']['person_a'] ?? null;
                    $p_b = $couple_section['props']['person_b'] ?? null;
                    
                    $f_a = is_array($p_a) ? ($p_a['parent_father'] ?? '') : '';
                    $m_a = is_array($p_a) ? ($p_a['parent_mother'] ?? '') : '';
                    $f_b = is_array($p_b) ? ($p_b['parent_father'] ?? '') : '';
                    $m_b = is_array($p_b) ? ($p_b['parent_mother'] ?? '') : '';
                    
                    $p_a_str = ($f_a && $m_a) ? "$f_a & $m_a" : ($f_a ?: $m_a);
                    $p_b_str = ($f_b && $m_b) ? "$f_b & $m_b" : ($f_b ?: $m_b);
                    
                    if ($p_a_str && $p_b_str) $parent_names = "$p_a_str <br> $p_b_str";
                    else $parent_names = $p_a_str ?: $p_b_str;
                }
            }

            $replacements = [
                '{event}' => $event_string,
                '{children}' => $child_name,
                '{parrent}' => $parent_names,
            ];

        } else {
            // --- PARSER TIPE LEGACY (FORMULIR) ---
            if ($category_id == 1) {
                // Khitanan (Circumcision) - category_id = 1
                $event_details = [];
                
                // Untuk khitanan, cek event.khitanan dulu, lalu fallback ke akad/resepsi
                if (isset($content_array['event']['khitanan'])) {
                    $khitanan = $content_array['event']['khitanan'];
                    // Cek apakah ada data yang tidak kosong
                    $location = trim($khitanan['location'] ?? '');
                    $date = trim($khitanan['date'] ?? '');
                    $time = trim($khitanan['time'] ?? '');
                    
                    if (!empty($location) || !empty($date) || !empty($time)) {
                        $event_parts = [];
                        if (!empty($location)) $event_parts[] = $location;
                        if (!empty($date)) $event_parts[] = $date;
                        if (!empty($time)) $event_parts[] = "pukul " . $time;
                        
                        $event_details[] = "Acara: " . implode(", ", $event_parts);
                    }
                }
                
                // Fallback jika khitanan kosong - coba dari data lain
                if (empty($event_details)) {
                    // Cek akad dan resepsi
                    if (isset($content_array['event']['akad'])) {
                        $akad = $content_array['event']['akad'];
                        $location = trim($akad['location'] ?? '');
                        $date = trim($akad['date'] ?? '');
                        $time = trim($akad['time'] ?? '');
                        
                        if (!empty($location) || !empty($date) || !empty($time)) {
                            $event_parts = [];
                            if (!empty($location)) $event_parts[] = $location;
                            if (!empty($date)) $event_parts[] = $date;
                            if (!empty($time)) $event_parts[] = "pukul " . $time;
                            
                            $event_details[] = "Acara: " . implode(", ", $event_parts);
                        }
                    }
                    
                    if (empty($event_details) && isset($content_array['event']['resepsi'])) {
                        $resepsi = $content_array['event']['resepsi'];
                        $location = trim($resepsi['location'] ?? '');
                        $date = trim($resepsi['date'] ?? '');
                        $time = trim($resepsi['time'] ?? '');
                        
                        if (!empty($location) || !empty($date) || !empty($time)) {
                            $event_parts = [];
                            if (!empty($location)) $event_parts[] = $location;
                            if (!empty($date)) $event_parts[] = $date;
                            if (!empty($time)) $event_parts[] = "pukul " . $time;
                            
                            $event_details[] = "Acara: " . implode(", ", $event_parts);
                        }
                    }
                }
                
                // Jika masih kosong, beri placeholder
                if (empty($event_details)) {
                    $event_details[] = "Acara: [Waktu dan tempat akan diinformasikan kemudian]";
                }

                $event_string = implode("<br>", $event_details);

                // Untuk khitanan, ambil hanya satu anak saja (bukan pasangan pengantin)
                // Cari anak yang bukan "Pengantin Wanita" atau ambil yang pertama jika struktur masih pakai pengantin
                $child_name = '';
                if (isset($content_array['children']) && is_array($content_array['children'])) {
                    // Prioritas: cari yang bukan "Pengantin Wanita" 
                    foreach ($content_array['children'] as $child) {
                        if (($child['order'] ?? '') !== 'Pengantin Wanita') {
                            $child_name = $child['nickname'] ?? $child['name'] ?? '';
                            break;
                        }
                    }
                    
                    // Jika tidak ketemu, ambil yang pertama
                    if (empty($child_name) && count($content_array['children']) > 0) {
                        $first_child = $content_array['children'][0];
                        $child_name = $first_child['nickname'] ?? $first_child['name'] ?? '';
                    }
                }

                // Untuk orang tua khitanan - cek struktur baru dulu (parents.father & parents.mother)
                $parent_names = '';
                $father = '';
                $mother = '';
                
                // PRIORITAS 1: Cek struktur baru parents.father dan parents.mother langsung
                if (isset($content_array['parents']['father']) && !empty($content_array['parents']['father'])) {
                    $father = $content_array['parents']['father'];
                }
                if (isset($content_array['parents']['mother']) && !empty($content_array['parents']['mother'])) {
                    $mother = $content_array['parents']['mother'];
                }
                
                // PRIORITAS 2: Jika tidak ada, fallback ke struktur lama (groom/bride)
                if (empty($father) || empty($mother)) {
                    $groom_father = $content_array['parents']['groom']['father'] ?? '';
                    $groom_mother = $content_array['parents']['groom']['mother'] ?? '';
                    $bride_father = $content_array['parents']['bride']['father'] ?? '';
                    $bride_mother = $content_array['parents']['bride']['mother'] ?? '';
                    
                    // Ambil father yang valid (yang bukan duplikat atau salah)
                    if (empty($father)) {
                        if (!empty($groom_father) && $groom_father !== $groom_mother) {
                            $father = $groom_father;
                        } elseif (!empty($bride_father) && $bride_father !== $bride_mother) {
                            $father = $bride_father;
                        }
                    }
                    
                    // Ambil mother yang valid 
                    if (empty($mother)) {
                        if (!empty($bride_mother) && strpos(strtolower($bride_mother), 'ibu') !== false) {
                            $mother = $bride_mother;
                        } elseif (!empty($groom_mother) && $groom_mother !== $groom_father) {
                            $mother = $groom_mother;
                        }
                    }
                    
                    // Fallback terakhir jika masih kosong
                    if (empty($father) && empty($mother)) {
                        $father = $groom_father;
                        $mother = $groom_mother;
                    }
                }
                
                // Format hasil
                if ($father && $mother) {
                    $parent_names = $father . ' & ' . $mother;
                } elseif ($father) {
                    $parent_names = $father;
                } elseif ($mother) {
                    $parent_names = $mother;
                }

                $replacements = [
                    '{event}' => $event_string,
                    '{children}' => $child_name,
                    '{parrent}' => $parent_names,
                ];

            } else {
                // Pernikahan (Wedding) - category_id = 2 atau lainnya
                $event_details = [];
                if (isset($content_array['event']['akad'])) {
                    $akad = $content_array['event']['akad'];
                    $event_details[] = "Akad Nikah: " . ($akad['location'] ?? '') . ", " . ($akad['date'] ?? '') . " pukul " . ($akad['time'] ?? '');
                }
                if (isset($content_array['event']['resepsi'])) {
                    $resepsi = $content_array['event']['resepsi'];
                    $event_details[] = "Resepsi: " . ($resepsi['location'] ?? '') . ", " . ($resepsi['date'] ?? '') . " pukul " . ($resepsi['time'] ?? '');
                }

                $event_string = implode("<br>", $event_details);

                // Handle {children} untuk pernikahan (pasangan pengantin)
                $children_names = [];
                if (isset($content_array['children']) && is_array($content_array['children'])) {
                    foreach ($content_array['children'] as $child) {
                        $children_names[] = $child['nickname'] ?? $child['name'] ?? '';
                    }
                }

                $replacements = [
                    '{event}' => $event_string,
                    '{parrent}' => ($content_array['parents']['groom']['father'] ?? '') . ' & ' . ($content_array['parents']['groom']['mother'] ?? '') . '<br>' .
                                   ($content_array['parents']['bride']['father'] ?? '') . ' & ' . ($content_array['parents']['bride']['mother'] ?? ''),
                    '{children}' => implode(' & ', $children_names),
                ];
            }
        }

        // Perform the replacements
        $processed_text_undangan = str_replace(array_keys($replacements), array_values($replacements), $text_undangan);

        $processed_data[] = [
            'id' => $bulk_item['id'],
            'category_id' => $bulk_item['category_id'],
            'text_undangan' => $processed_text_undangan
        ];
    }

    $response = [
        'status' => 'success',
        'data' => $processed_data
    ];

    echo json_encode($response, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    error(500, 'Terjadi kesalahan database: ' . $e->getMessage());
}
?>