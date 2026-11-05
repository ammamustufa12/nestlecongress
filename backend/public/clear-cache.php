<?php

header('Content-Type: application/json');

$root = dirname(__DIR__);

$files = [
    $root.'/bootstrap/cache/config.php',
    $root.'/bootstrap/cache/routes-v7.php',
    $root.'/bootstrap/cache/events.php',
];

$removed = [];

foreach ($files as $file) {
    if (is_file($file) && unlink($file)) {
        $removed[] = basename($file);
    }
}

foreach (glob($root.'/storage/framework/views/*.php') ?: [] as $view) {
    if (@unlink($view)) {
        $removed[] = basename($view);
    }
}

foreach (glob($root.'/storage/framework/cache/data/*') ?: [] as $entry) {
    if (is_file($entry) && @unlink($entry)) {
        $removed[] = basename($entry);
    }
}

echo json_encode([
    'ok' => true,
    'removed' => $removed,
], JSON_PRETTY_PRINT);
