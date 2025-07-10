<?php
// Test simple pour vérifier si PHP fonctionne
header('Content-Type: text/plain');
echo "PHP fonctionne correctement !\n";
echo "Timestamp: " . date('Y-m-d H:i:s') . "\n";
echo "Directory: " . __DIR__ . "\n";

// Tester l'écriture de fichiers
$testFile = 'test-write.txt';
if (file_put_contents($testFile, 'Test écriture: ' . date('Y-m-d H:i:s'))) {
    echo "Écriture de fichiers: OK\n";
    unlink($testFile); // Nettoyer
} else {
    echo "Écriture de fichiers: ERREUR\n";
}

// Vérifier downloads.json
if (file_exists('downloads.json')) {
    echo "downloads.json existe: OK\n";
    if (is_readable('downloads.json')) {
        echo "downloads.json lisible: OK\n";
    } else {
        echo "downloads.json lisible: ERREUR\n";
    }
    if (is_writable('downloads.json')) {
        echo "downloads.json modifiable: OK\n";
    } else {
        echo "downloads.json modifiable: ERREUR\n";
    }
} else {
    echo "downloads.json existe: ERREUR\n";
}
?> 