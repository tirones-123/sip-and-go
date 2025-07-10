<?php
// Gestion d'erreurs améliorée
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers CORS et content type
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gérer les requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $file = 'downloads.json';
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Lire le compteur actuel
        if (file_exists($file)) {
            $content = file_get_contents($file);
            if ($content === false) {
                throw new Exception('Impossible de lire le fichier downloads.json');
            }
            $data = json_decode($content, true);
            if ($data === null) {
                throw new Exception('Fichier JSON corrompu');
            }
        } else {
            $data = ['count' => 0, 'last_updated' => date('Y-m-d H:i:s')];
        }
        
        // Incrémenter
        $data['count']++;
        $data['last_updated'] = date('Y-m-d H:i:s');
        
        // Sauvegarder
        $jsonData = json_encode($data, JSON_PRETTY_PRINT);
        if (file_put_contents($file, $jsonData) === false) {
            throw new Exception('Impossible d\'écrire dans le fichier downloads.json. Vérifiez les permissions.');
        }
        
        echo json_encode(['success' => true, 'count' => $data['count']]);
        
    } else {
        // GET pour récupérer le compteur
        if (file_exists($file)) {
            $content = file_get_contents($file);
            if ($content === false) {
                throw new Exception('Impossible de lire le fichier downloads.json');
            }
            echo $content;
        } else {
            echo json_encode(['count' => 0, 'last_updated' => 'Never']);
        }
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage(),
        'debug' => [
            'php_version' => PHP_VERSION,
            'current_dir' => __DIR__,
            'file_exists' => file_exists($file),
            'is_readable' => file_exists($file) ? is_readable($file) : false,
            'is_writable' => file_exists($file) ? is_writable($file) : false,
            'dir_writable' => is_writable(__DIR__),
            'permissions' => file_exists($file) ? substr(sprintf('%o', fileperms($file)), -4) : 'N/A'
        ]
    ]);
}
?> 