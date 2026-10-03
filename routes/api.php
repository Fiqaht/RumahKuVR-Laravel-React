<?php

use App\Http\Controllers\SatriaAiController;
use Illuminate\Support\Facades\Route;

// Stateless (no session, no CSRF) so the Unity client can call it. Prefixed /api by bootstrap/app.php.
Route::post('/satria/analyze', [SatriaAiController::class, 'analyze'])
    ->middleware('throttle:30,1')
    ->name('satria.analyze');
