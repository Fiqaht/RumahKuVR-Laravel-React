<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * SATRIA AI 2.0: turns ONE finished gameplay session (already scored and already analysed by
 * the game's fuzzy system) into short Bahasa Melayu feedback via Gemini.
 *
 * Gemini only rewords and personalises. The score, hazard results and fuzzy verdict arrive
 * as facts; nothing it returns is fed back into gameplay. Any failure returns null and the
 * game keeps its fuzzy result.
 */
class SatriaAiService
{
    /** Response field => hard maximum length. The prompt asks for less; this rejects runaways. */
    public const FIELDS = [
        'overall_summary' => 160,
        'strength' => 140,
        'attention' => 140,
        'recommendation' => 160,
        'next_training_focus' => 120,
        'assistance_level' => 10,
    ];

    public const LEVELS = ['RENDAH', 'SEDERHANA', 'TINGGI'];

    /**
     * Medical / cognitive / sensory claims a senior must never be shown. Same terms as the game's
     * RecommendationGenerator.BannedTerms, but matched only at a word start: "kotak" (box) is
     * normal clutter advice and must not trip "otak".
     */
    private const MEDICAL_TERMS = '/(?<!\p{L})(demensia|dementia|kognitif|cognitive|nyanyuk|alzheimer|diagnos'
        .'|penyakit|sakit mental|gangguan mental|hilang ingatan|masalah ingatan|daya ingatan|lemah ingatan'
        .'|penglihatan|rabun|buta|pekak|otak|mental|psikologi|terencat|uzur)/iu';

    private const SYSTEM_INSTRUCTION = <<<'TXT'
You are SATRIA, the RumahKuVR home-safety training assistant.
Analyse only the gameplay session data supplied to you.
Do not change or question the supplied score.
Do not invent hazards, actions, mistakes or results.
Do not diagnose dementia, cognitive impairment, illness, physical ability, mental state or any medical condition.
Do not infer medical information from gameplay performance.
Provide concise personalised home-safety training feedback in Malaysian Bahasa Melayu.
Praise must match the actual result.
If a hazard is unfinished, mention only hazards explicitly supplied.
Focus recommendations on safe household behaviour and the next training attempt.

Output rules:
- Every text field is Bahasa Melayu Malaysia (never Bahasa Indonesia), warm and respectful to a senior citizen; address the player as "anda".
- Every text field is ONE short sentence: overall_summary max 110 characters, strength max 100, attention max 100, recommendation max 120, next_training_focus max 90.
- Name hazards only with the exact names found in completedHazards, unfinishedHazards or hazardPerformance.
- hazardPerformance.status: completed, started_not_completed, not_started, or not_completed (not known whether it was started).
- fuzzyAnalysis is the game's existing rule-based analysis of this same session. Stay consistent with it and with the numbers; say it more clearly and personally, never contradict it.
- If mistakes is 0 and every hazard is completed, describe no problem: attention says there is nothing major to correct and encourages the same care.
- If mistakes is above 0, never call the session perfect.
- elapsedSeconds is information only; never criticise the player for being slow.
- assistance_level is how much guidance the next training session needs: RENDAH (can practise independently), SEDERHANA (some guidance), TINGGI (close guidance). Base it only on the supplied results.
- No HTML, markdown, emoji or line breaks.
TXT;

    /** @return array<string,string>|null the six validated fields, or null on ANY failure */
    public function analyze(array $session): ?array
    {
        $key = config('satria.api_key');
        if (! $key) {
            Log::warning('SATRIA AI: GEMINI_API_KEY is not set.');

            return null;
        }

        $model = config('satria.model');
        $url = rtrim(config('satria.base_url'), '/')."/models/{$model}:generateContent";

        try {
            $response = Http::timeout(config('satria.timeout'))
                ->withHeaders(['x-goog-api-key' => $key])
                ->acceptJson()
                ->post($url, $this->request($session));
        } catch (ConnectionException $e) {
            Log::warning('SATRIA AI: Gemini unreachable or timed out.', ['error' => $e->getMessage()]);

            return null;
        }

        if ($response->failed()) {
            Log::warning('SATRIA AI: Gemini returned an error.', ['status' => $response->status()]);

            return null;
        }

        // Thinking models may split the answer into parts; thought parts are never the answer.
        $text = collect($response->json('candidates.0.content.parts') ?? [])
            ->reject(fn ($part) => ! is_array($part) || ! empty($part['thought']))
            ->pluck('text')
            ->implode('');

        $result = $this->validate(json_decode($text, true));
        if ($result === null) {
            Log::warning('SATRIA AI: Gemini response failed validation.');
        }

        return $result;
    }

    /** Exactly the six fields, each a non-empty single-line string within its limit and free of
     *  medical claims, or null. */
    public function validate(mixed $data): ?array
    {
        if (! is_array($data)) {
            return null;
        }

        $out = [];
        foreach (self::FIELDS as $field => $max) {
            $value = $data[$field] ?? null;
            if (! is_string($value)) {
                return null;
            }
            $value = trim(preg_replace('/\s+/u', ' ', $value));
            // '<' / '>' would be parsed as TextMeshPro rich-text tags on the result board.
            if ($value === '' || mb_strlen($value) > $max || preg_match('/[<>]/', $value)
                || preg_match(self::MEDICAL_TERMS, $value)) {
                return null;
            }
            $out[$field] = $value;
        }

        return in_array($out['assistance_level'], self::LEVELS, true) ? $out : null;
    }

    private function request(array $session): array
    {
        $string = ['type' => 'STRING'];
        $thinking = config('satria.thinking_level')
            ? ['thinkingConfig' => ['thinkingLevel' => config('satria.thinking_level')]]
            : [];

        return [
            'systemInstruction' => ['parts' => [['text' => self::SYSTEM_INSTRUCTION]]],
            'contents' => [[
                'role' => 'user',
                'parts' => [['text' => "Data sesi latihan (JSON):\n"
                    .json_encode($session, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)]],
            ]],
            'generationConfig' => [
                'temperature' => 0.4,
                'responseMimeType' => 'application/json',
                'responseSchema' => [
                    'type' => 'OBJECT',
                    'properties' => [
                        'overall_summary' => $string,
                        'strength' => $string,
                        'attention' => $string,
                        'recommendation' => $string,
                        'next_training_focus' => $string,
                        'assistance_level' => ['type' => 'STRING', 'enum' => self::LEVELS],
                    ],
                    'required' => array_keys(self::FIELDS),
                    'propertyOrdering' => array_keys(self::FIELDS),
                ],
            ] + $thinking,
        ];
    }
}
