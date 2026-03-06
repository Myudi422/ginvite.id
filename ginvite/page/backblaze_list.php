<?php
// ginvite/page/backblaze_list.php
require '../../../../vendor/autoload.php';
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

use Aws\S3\S3Client;
use Aws\Exception\AwsException;

// Config
define('B2_ENDPOINT_URL', 'https://s3.us-east-005.backblazeb2.com');
define('B2_ACCESS_KEY', '0057ba6d7a5725c0000000002');
define('B2_SECRET_KEY', 'K005XvUqydtIZQvuNBYCM/UDhXfrWLQ');
define('BUCKET_NAME', 'ccgnimex');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $prefix = isset($_GET['prefix']) ? $_GET['prefix'] : '';

    try {
        $s3 = new S3Client([
            'version' => 'latest',
            'region' => 'us-east-005',
            'endpoint' => B2_ENDPOINT_URL,
            'credentials' => [
                'key' => B2_ACCESS_KEY,
                'secret' => B2_SECRET_KEY
            ],
            'suppress_php_deprecation_warning' => true,
        ]);

        $files = [];
        $folders = [];

        $params = [
            'Bucket' => BUCKET_NAME,
            'Delimiter' => '/'
        ];

        if (!empty($prefix)) {
            $params['Prefix'] = $prefix;
        }

        $results = $s3->getPaginator('ListObjectsV2', $params);

        foreach ($results as $result) {
            // Folders (CommonPrefixes)
            if (!empty($result['CommonPrefixes'])) {
                foreach ($result['CommonPrefixes'] as $cp) {
                    $folders[] = [
                        'type' => 'folder',
                        'name' => basename($cp['Prefix']),
                        'path' => $cp['Prefix']
                    ];
                }
            }

            // Files (Contents)
            if (!empty($result['Contents'])) {
                foreach ($result['Contents'] as $object) {
                    $key = $object['Key'];
                    // Skip the folder itself (B2 sometimes returns the prefix as a 0-byte object)
                    if ($key === $prefix)
                        continue;

                    $files[] = [
                        'type' => 'file',
                        'name' => basename($key),
                        'key' => $key,
                        'size' => $object['Size'],
                        'lastModified' => $object['LastModified'] ? $object['LastModified']->format('Y-m-d H:i:s') : null,
                        'url' => 'https://f005.backblazeb2.com/file/' . BUCKET_NAME . '/' . ltrim($key, '/')
                    ];
                }
            }
        }

        echo json_encode(['success' => true, 'folders' => $folders, 'files' => $files, 'currentPrefix' => $prefix]);
    }
    catch (AwsException $e) {
        echo json_encode(['success' => false, 'message' => "Error: " . $e->getMessage()]);
    }
}
else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
