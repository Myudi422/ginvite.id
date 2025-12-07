<?php
// page/get_slider.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require __DIR__ . '/../db.php';  // `$pdo` sudah didefinisikan di db.php

// Query semua slider, urut sesuai sort_order
$sql = "SELECT id, image_url FROM slider_homepage ORDER BY sort_order ASC";
$stmt = $pdo->query($sql);
$slides = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Jika tidak ada slide, kembalikan empty array saja
echo json_encode([
    'status' => 'success',
    'data'   => $slides,
], JSON_UNESCAPED_UNICODE);
