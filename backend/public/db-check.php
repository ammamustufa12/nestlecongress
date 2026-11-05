<?php

header('Content-Type: application/json');

$envPath = dirname(__DIR__).'/.env';
$env = [];

if (is_file($envPath)) {
    foreach (file($envPath, FILE_IGNORE_NEW_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $env[trim($key)] = trim($value, " \t\"'");
    }
}

$host = $env['DB_HOST'] ?? 'localhost';
$port = $env['DB_PORT'] ?? '3306';
$database = $env['DB_DATABASE'] ?? '';
$username = $env['DB_USERNAME'] ?? '';
$password = $env['DB_PASSWORD'] ?? '';

$result = [
    'host' => $host,
    'port' => $port,
    'database' => $database,
    'connected' => false,
];

try {
    $pdo = new PDO(
        "mysql:host={$host};port={$port};dbname={$database}",
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    $result['connected'] = true;
    $result['users'] = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
    $result['sessions_table'] = (bool) $pdo->query("SHOW TABLES LIKE 'sessions'")->fetchColumn();
} catch (Throwable $error) {
    $result['error'] = $error->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT);
