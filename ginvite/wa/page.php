<?php
// Inisialisasi response
$api_response = ['error' => false, 'data' => null];

// Proses jika form disubmit
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $target = filter_input(INPUT_POST, 'target', FILTER_SANITIZE_STRING);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);
    $token = filter_input(INPUT_POST, 'token', FILTER_SANITIZE_STRING);

    if (empty($target) || empty($message) || empty($token)) {
        $api_response = ['error' => true, 'message' => 'Semua field harus diisi!'];
    } else {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'https://api.fonnte.com/send',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => array(
                'target' => $target,
                'message' => $message,
            ),
            CURLOPT_HTTPHEADER => array(
                "Authorization: $token"
            ),
        ));

        $response = curl_exec($curl);
        if (curl_errno($curl)) {
            $api_response = ['error' => true, 'message' => curl_error($curl)];
        } else {
            $api_response = ['error' => false, 'data' => $response];
        }
        curl_close($curl);
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Test Kirim Pesan via Fonnte API</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center font-sans">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 class="text-2xl font-bold mb-4 text-center">Tes Kirim Pesan (Fonnte API)</h1>
        <form method="POST" action="" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Token API</label>
                <input type="text" name="token" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Masukkan token Anda">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Nomor Target (contoh: 6281234567890)</label>
                <input type="text" name="target" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Contoh: 6281234567890">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Pesan</label>
                <textarea name="message" required rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Tulis pesan di sini..."></textarea>
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Kirim</button>
        </form>

        <?php if ($api_response['error']): ?>
            <div class="bg-red-100 border border-red-400 text-red-700 mt-4 p-3 rounded">
                <strong>Error:</strong> <?php echo htmlspecialchars($api_response['message']); ?>
            </div>
        <?php elseif ($api_response['data']): ?>
            <div class="bg-green-100 border border-green-400 text-green-700 mt-4 p-3 rounded">
                <strong>Berhasil:</strong> Respon dari API:
                <pre class="text-sm mt-2 bg-white p-2 border rounded"><?php echo htmlspecialchars($api_response['data']); ?></pre>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>
