<?php

namespace Tests\Feature;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/** SATRIA AI 2.0 endpoint. Gemini is always faked: no key, no network, no cost. */
class SatriaAiTest extends TestCase
{
    private const GEMINI = 'generativelanguage.googleapis.com/*';

    protected function setUp(): void
    {
        parent::setUp();
        config(['satria.api_key' => 'test-key', 'satria.model' => 'gemini-3.6-flash']);
    }

    private function sessionData(array $overrides = []): array
    {
        $hazards = [
            ['name' => 'Keselamatan di Tandas', 'location' => 'Tandas', 'status' => 'completed'],
            ['name' => 'Objek Menghalang Laluan', 'location' => 'Koridor', 'status' => 'completed'],
            ['name' => 'Karpet Terlipat', 'location' => 'Ruang Tamu', 'status' => 'completed'],
            ['name' => 'Keselamatan Ubat-Ubatan', 'location' => 'Bilik', 'status' => 'completed'],
            ['name' => 'Bahaya Air Panas', 'location' => 'Dapur', 'status' => 'completed'],
        ];

        return array_replace([
            'difficulty' => 'Sederhana', 'platform' => 'tablet', 'score' => 100, 'maxScore' => 100,
            'hazardsCompleted' => 5, 'hazardsTotal' => 5, 'elapsedSeconds' => 172,
            'mistakes' => 0, 'retries' => 0, 'endReason' => 'Completed',
            'completedHazards' => array_column($hazards, 'name'), 'unfinishedHazards' => [],
            'hazardPerformance' => $hazards,
            'fuzzyAnalysis' => [
                'performanceLevel' => 'Cemerlang', 'overallScore' => 86,
                'summary' => 'Prestasi anda cemerlang.', 'strength' => 'Semua bahaya selesai.',
                'attention' => 'Tiada perkara utama.', 'recommendation' => 'Teruskan amalan ini.',
            ],
        ], $overrides);
    }

    private function reply(array $fields): array
    {
        return array_replace([
            'overall_summary' => 'Tahniah! Anda menyelesaikan kelima-lima bahaya tanpa sebarang kesilapan.',
            'strength' => 'Anda menangani setiap bahaya dengan teliti dan mengikut langkah yang betul.',
            'attention' => 'Tiada perkara utama yang perlu diperbaiki; teruskan sikap berhati-hati ini.',
            'recommendation' => 'Amalkan langkah keselamatan yang sama setiap hari di rumah anda.',
            'next_training_focus' => 'Cuba tahap Sukar apabila anda sudah bersedia.',
            'assistance_level' => 'RENDAH',
        ], $fields);
    }

    private function fakeGemini(string $text, int $status = 200): void
    {
        Http::fake([self::GEMINI => Http::response(
            ['candidates' => [['content' => ['parts' => [['text' => $text]]], 'finishReason' => 'STOP']]],
            $status
        )]);
    }

    private function prompt(Request $r): string
    {
        return $r['contents'][0]['parts'][0]['text'];
    }

    public function test_clean_session_returns_validated_fields_from_structured_json(): void
    {
        $this->fakeGemini(json_encode($this->reply([])));

        $this->postJson('/api/satria/analyze', $this->sessionData())
            ->assertOk()
            ->assertExactJson($this->reply([]) + ['source' => 'gemini', 'model' => 'gemini-3.6-flash']);

        Http::assertSent(fn (Request $r) => str_contains($r->url(), '/models/gemini-3.6-flash:generateContent')
            && $r->header('x-goog-api-key') === ['test-key']
            && $r['generationConfig']['responseMimeType'] === 'application/json'
            && $r['generationConfig']['thinkingConfig']['thinkingLevel'] === 'low'
            && $r['generationConfig']['responseSchema']['properties']['assistance_level']['enum'] === ['RENDAH', 'SEDERHANA', 'TINGGI']
            && str_contains($r['systemInstruction']['parts'][0]['text'], 'Do not diagnose dementia')
            && str_contains($this->prompt($r), '"mistakes": 0'));
    }

    public function test_partial_session_prompt_carries_only_the_real_unfinished_hazards(): void
    {
        $hazards = $this->sessionData()['hazardPerformance'];
        $hazards[2]['status'] = 'started_not_completed';
        $hazards[4]['status'] = 'not_started';
        $reply = $this->reply([
            'overall_summary' => 'Anda menyelesaikan 3 daripada 5 bahaya; usaha yang baik untuk latihan ini.',
            'attention' => 'Karpet Terlipat dan Bahaya Air Panas masih belum selesai.',
            'assistance_level' => 'SEDERHANA',
        ]);
        $this->fakeGemini(json_encode($reply));

        $this->postJson('/api/satria/analyze', $this->sessionData([
            'score' => 55, 'hazardsCompleted' => 3, 'mistakes' => 2, 'retries' => 1, 'endReason' => 'Incomplete',
            'completedHazards' => ['Keselamatan di Tandas', 'Objek Menghalang Laluan', 'Keselamatan Ubat-Ubatan'],
            'unfinishedHazards' => ['Karpet Terlipat', 'Bahaya Air Panas'],
            'hazardPerformance' => $hazards,
        ]))->assertOk()->assertJson(['attention' => $reply['attention'], 'assistance_level' => 'SEDERHANA']);

        Http::assertSent(fn (Request $r) => str_contains($this->prompt($r), '"unfinishedHazards": [')
            && str_contains($this->prompt($r), '"started_not_completed"')
            && ! str_contains($this->prompt($r), 'Lantai Basah'));
    }

    public function test_completed_with_mistakes_session_is_analysed(): void
    {
        $reply = $this->reply([
            'overall_summary' => 'Anda menyelesaikan ketiga-tiga bahaya, tetapi masih ada 2 kesilapan.',
            'attention' => 'Beberapa langkah dilakukan tidak mengikut urutan yang betul.',
            'assistance_level' => 'SEDERHANA',
        ]);
        $this->fakeGemini(json_encode($reply));

        $hazards = [
            ['name' => 'Lantai Basah', 'location' => 'Rumah', 'status' => 'completed'],
            ['name' => 'Wayar Terdedah', 'location' => 'Rumah', 'status' => 'completed'],
            ['name' => 'Dapur Gas', 'location' => 'Rumah', 'status' => 'completed'],
        ];
        $this->postJson('/api/satria/analyze', $this->sessionData([
            'difficulty' => 'Mudah', 'platform' => 'controller', 'score' => 90, 'hazardsCompleted' => 3,
            'hazardsTotal' => 3, 'mistakes' => 2, 'completedHazards' => array_column($hazards, 'name'),
            'hazardPerformance' => $hazards,
        ]))->assertOk()->assertJson(['overall_summary' => $reply['overall_summary']]);
    }

    public function test_unexpected_client_fields_never_reach_gemini(): void
    {
        $this->fakeGemini(json_encode($this->reply([])));

        $this->postJson('/api/satria/analyze', $this->sessionData([
            'password' => 'hunter2', 'email' => 'nenek@example.com', 'fullName' => 'Siti Aminah',
        ]))->assertOk();

        Http::assertSent(fn (Request $r) => ! str_contains($this->prompt($r), 'hunter2')
            && ! str_contains($this->prompt($r), 'example.com')
            && ! str_contains($this->prompt($r), 'Siti Aminah'));
    }

    public function test_bad_input_is_rejected_before_gemini(): void
    {
        Http::fake();

        $this->postJson('/api/satria/analyze', $this->sessionData(['hazardsCompleted' => 9]))->assertUnprocessable();
        $this->postJson('/api/satria/analyze', $this->sessionData(['platform' => 'pc']))->assertUnprocessable();
        $this->postJson('/api/satria/analyze', $this->sessionData([
            'fuzzyAnalysis' => ['performanceLevel' => 'Baik', 'userId' => 'siti'],
        ]))->assertUnprocessable();

        Http::assertNothingSent();
    }

    #[DataProvider('badGeminiOutput')]
    public function test_invalid_gemini_output_falls_back(string $text): void
    {
        $this->fakeGemini($text);

        $this->postJson('/api/satria/analyze', $this->sessionData())
            ->assertStatus(503)->assertExactJson(['error' => 'satria_unavailable']);
    }

    public static function badGeminiOutput(): array
    {
        $valid = [
            'overall_summary' => 'Bagus.', 'strength' => 'Teliti.', 'attention' => 'Tiada.',
            'recommendation' => 'Teruskan.', 'next_training_focus' => 'Sukar.', 'assistance_level' => 'RENDAH',
        ];

        return [
            'not json' => ['Maaf, saya tidak pasti.'],
            'truncated json' => ['{"overall_summary": "Bagus'],
            'empty' => [''],
            'missing field' => [json_encode(array_diff_key($valid, ['attention' => 1]))],
            'empty field' => [json_encode(['strength' => '  '] + $valid)],
            'bad level' => [json_encode(['assistance_level' => 'SANGAT TINGGI'] + $valid)],
            'too long' => [json_encode(['recommendation' => str_repeat('Teruskan latihan. ', 20)] + $valid)],
            'rich text tag' => [json_encode(['strength' => '<color=red>Teliti</color>'] + $valid)],
            'medical claim' => [json_encode(['attention' => 'Anda mungkin mengalami masalah ingatan.'] + $valid)],
        ];
    }

    public function test_box_advice_is_not_mistaken_for_a_medical_term(): void
    {
        $reply = $this->reply(['recommendation' => 'Alihkan kotak dari laluan supaya tidak tersandung.']);
        $this->fakeGemini(json_encode($reply));

        $this->postJson('/api/satria/analyze', $this->sessionData())->assertOk()
            ->assertJson(['recommendation' => $reply['recommendation']]);
    }

    public function test_gemini_http_errors_fall_back(): void
    {
        $statuses = [429, 500, 503, 400];
        $sequence = Http::sequence();
        foreach ($statuses as $status) {
            $sequence->push(['error' => ['message' => 'quota']], $status);
        }
        Http::fake([self::GEMINI => $sequence]);

        foreach ($statuses as $status) {
            $this->postJson('/api/satria/analyze', $this->sessionData())
                ->assertStatus(503)->assertExactJson(['error' => 'satria_unavailable']);
        }
        Http::assertSentCount(count($statuses));
    }

    public function test_timeout_or_offline_falls_back(): void
    {
        Http::fake(fn () => throw new ConnectionException('cURL error 28: Operation timed out'));

        $this->postJson('/api/satria/analyze', $this->sessionData())
            ->assertStatus(503)->assertExactJson(['error' => 'satria_unavailable']);
    }

    public function test_missing_api_key_falls_back_without_calling_gemini(): void
    {
        config(['satria.api_key' => null]);
        Http::fake();

        $this->postJson('/api/satria/analyze', $this->sessionData())->assertStatus(503);
        Http::assertNothingSent();
    }
}
