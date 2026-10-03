<?php

// SATRIA AI 2.0 — server-side Gemini settings. The key lives ONLY in .env, never in Unity.
return [
    'api_key' => env('GEMINI_API_KEY'),

    // Verified 2026-10-03 against ai.google.dev/gemini-api/docs/models (stable, free tier).
    'model' => env('GEMINI_MODEL', 'gemini-3.6-flash'),

    'base_url' => env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta'),

    // Seconds. Unity gives up at 8 s and shows the fuzzy result, so stay under that.
    'timeout' => (int) env('SATRIA_GEMINI_TIMEOUT', 7),

    // Gemini 3.x thinks at "medium" by default: measured 7.6-8.3 s per SATRIA request, i.e. past
    // the timeout. "low" measured ~2.2 s with the same output quality. Empty = model default
    // (use that for a model without thinkingLevel support).
    'thinking_level' => env('SATRIA_THINKING_LEVEL', 'low'),
];
