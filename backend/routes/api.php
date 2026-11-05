<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CongressController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgot']);

Route::middleware('congress.auth')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/bootstrap', [CongressController::class, 'bootstrap']);
    Route::post('/sessions/{session}/bookmark', [CongressController::class, 'bookmark']);
    Route::post('/speakers/{speaker}/favorite', [CongressController::class, 'favorite']);
    Route::post('/polls/{poll}/vote', [CongressController::class, 'vote']);
    Route::post('/questions', [CongressController::class, 'storeQuestion']);
    Route::post('/questions/{question}/upvote', [CongressController::class, 'upvote']);
    Route::post('/resources/{resource}/save', [CongressController::class, 'saveResource']);
    Route::post('/exhibitors/{exhibitor}/save', [CongressController::class, 'saveExhibitor']);
});
