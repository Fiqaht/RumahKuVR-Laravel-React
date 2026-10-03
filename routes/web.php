<?php

use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => view('app'))->name('home');

Route::get('/api/project', function () {
    return response()->json([
        'name' => 'RumahKuVR',
        'title' => 'AI-Driven Virtual Reality Home Safety Application for Personalised Performance Analysis Among Seniors',
        'platform' => 'Meta Quest 3 · gamepad · Android tablet',
        'platforms' => ['Meta Quest 3', 'Xbox / PlayStation-style gamepad', 'Android tablet touchscreen'],
        'engine' => 'Unity 6.3 LTS',
        'modes' => ['VR Mode', 'Controller Mode', 'Tablet Mode'],
        'roles' => ['Warga Emas', 'Penjaga', 'Tetamu'],
        'difficulty' => [
            ['name' => 'Easy', 'malay' => 'Mod Mudah', 'hazards' => 3],
            ['name' => 'Medium', 'malay' => 'Mod Sederhana', 'hazards' => 5],
            ['name' => 'Hard', 'malay' => 'Mod Sukar', 'hazards' => 10],
        ],
        'tutorial' => [
            'easy' => 'complete',
            'medium' => 'complete',
            'hard' => 'complete',
        ],
        'analysis' => [
            'brand' => 'SATRIA AI 2.0',
            'type' => 'hybrid: deterministic scoring + fuzzy logic + generative feedback',
            'runs' => 'on-device scoring and fuzzy analysis; server-side Gemini feedback',
            'network' => true,
            'network_required_for' => 'optional Gemini feedback only',
            'gameplay_requires_network' => false,
            'pipeline' => [
                'Gameplay Session', 'Gameplay Metrics', 'Deterministic Scoring',
                'Fuzzy Logic Analysis', 'Gemini Generative AI', 'SATRIA Personalised Feedback',
            ],
            'dimensions' => ['safety', 'independence', 'attention', 'recovery'],
            'generative' => [
                'provider' => 'Gemini',
                'role' => 'personalised feedback from structured session metrics and fuzzy summaries',
                'endpoint' => route('satria.analyze', [], false),
            ],
            'fallback' => [
                'flow' => ['Fuzzy Logic Analysis', 'SATRIA structured/rule-based feedback'],
                'handled_by' => 'game client retains its existing fuzzy result',
                'backend_failure' => '503 satria_unavailable',
            ],
        ],
    ]);
});

Route::post('/api/contact', [ContactController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('contact.store');
