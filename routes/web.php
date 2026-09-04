<?php

use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => view('app'))->name('home');

Route::get('/api/project', function () {
    return response()->json([
        'name' => 'RumahKuVR',
        'title' => 'AI-Assisted Virtual Reality Home Safety Application for Personalised Hazard Detection Among Seniors',
        'platform' => 'Meta Quest 3',
        'engine' => 'Unity 6.3 LTS',
        'modes' => ['VR Mode', 'Controller Mode'],
        'difficulty' => [
            ['name' => 'Easy', 'hazards' => 3],
            ['name' => 'Medium', 'hazards' => 5],
            ['name' => 'Hard', 'hazards' => 10],
        ],
        'tutorial' => [
            'easy' => 'complete',
            'medium' => 'complete',
            'hard' => 'planned',
        ],
    ]);
});

Route::post('/api/contact', [ContactController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('contact.store');
