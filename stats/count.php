<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $file = 'downloads.json';
    
    // Lire le compteur actuel
    if (file_exists($file)) {
        $data = json_decode(file_get_contents($file), true);
    } else {
        $data = ['count' => 0, 'last_updated' => date('Y-m-d H:i:s')];
    }
    
    // Incrémenter
    $data['count']++;
    $data['last_updated'] = date('Y-m-d H:i:s');
    
    // Sauvegarder
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
    
    echo json_encode(['success' => true, 'count' => $data['count']]);
} else {
    // GET pour récupérer le compteur
    if (file_exists('downloads.json')) {
        echo file_get_contents('downloads.json');
    } else {
        echo json_encode(['count' => 0, 'last_updated' => 'Never']);
    }
}
?> 