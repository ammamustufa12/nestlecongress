<?php

use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use Illuminate\View\Middleware\ShareErrorsFromSession;

Route::get('/', function () {
    return response()->json([
        'name' => 'Nestlé Medical Congress API',
        'base' => url('/api'),
        'demo_accounts' => [
            ['email' => 'dr.testing@congress.com', 'password' => 'password'],
            ['email' => 'huda@example.com', 'password' => 'password'],
        ],
        'routes' => [
            'POST /api/register',
            'POST /api/login',
            'POST /api/forgot-password',
            'GET /api/me',
            'POST /api/logout',
            'GET /api/bootstrap',
            'POST /api/sessions/{id}/bookmark',
            'POST /api/speakers/{id}/favorite',
            'POST /api/polls/{id}/vote',
            'POST /api/questions',
            'POST /api/questions/{id}/upvote',
            'POST /api/resources/{id}/save',
            'POST /api/exhibitors/{id}/save',
        ],
    ]);
});

Route::get('/clear-cache', function () {
    $removed = [];

    foreach ([
        base_path('bootstrap/cache/config.php'),
        base_path('bootstrap/cache/routes-v7.php'),
        base_path('bootstrap/cache/events.php'),
    ] as $file) {
        if (is_file($file) && unlink($file)) {
            $removed[] = basename($file);
        }
    }

    foreach (glob(storage_path('framework/views').'/*.php') ?: [] as $view) {
        if (@unlink($view)) {
            $removed[] = basename($view);
        }
    }

    $commands = [];
    foreach (['config:clear', 'route:clear', 'view:clear', 'cache:clear'] as $command) {
        try {
            Artisan::call($command);
            $commands[$command] = trim(Artisan::output()) ?: 'ok';
        } catch (Throwable $error) {
            $commands[$command] = $error->getMessage();
        }
    }

    return response()->json([
        'ok' => true,
        'removed' => $removed,
        'commands' => $commands,
    ]);
})->withoutMiddleware([
    StartSession::class,
    ShareErrorsFromSession::class,
]);
