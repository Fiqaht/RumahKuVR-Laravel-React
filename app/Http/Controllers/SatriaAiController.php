<?php

namespace App\Http\Controllers;

use App\Services\SatriaAiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SatriaAiController extends Controller
{
    private const HAZARD_STATUS = 'in:completed,started_not_completed,not_started,not_completed';

    public function analyze(Request $request, SatriaAiService $satria): JsonResponse
    {
        // validate() returns ONLY these keys, and the array:<keys> rules reject unknown nested
        // keys, so nothing else a client sends (names, ids, passwords) can reach the prompt.
        $session = $request->validate([
            'difficulty' => ['required', 'in:Mudah,Sederhana,Sukar'],
            'platform' => ['required', 'in:vr,controller,tablet'],
            'score' => ['required', 'integer', 'min:0', 'max:1000'],
            'maxScore' => ['required', 'integer', 'min:1', 'max:1000'],
            'hazardsTotal' => ['required', 'integer', 'min:0', 'max:50'],
            'hazardsCompleted' => ['required', 'integer', 'min:0', 'lte:hazardsTotal'],
            'elapsedSeconds' => ['required', 'integer', 'min:0', 'max:86400'],
            'mistakes' => ['required', 'integer', 'min:0', 'max:1000'],
            'retries' => ['required', 'integer', 'min:0', 'max:1000'],
            'endReason' => ['nullable', 'in:Completed,Incomplete,TimedOut'],
            'completedHazards' => ['present', 'array', 'max:50'],
            'completedHazards.*' => ['string', 'max:120'],
            'unfinishedHazards' => ['present', 'array', 'max:50'],
            'unfinishedHazards.*' => ['string', 'max:120'],
            'hazardPerformance' => ['present', 'array', 'max:50'],
            'hazardPerformance.*' => ['array:name,location,status'],
            'hazardPerformance.*.name' => ['required', 'string', 'max:120'],
            'hazardPerformance.*.location' => ['nullable', 'string', 'max:80'],
            'hazardPerformance.*.status' => ['required', self::HAZARD_STATUS],
            'fuzzyAnalysis' => ['required', 'array:performanceLevel,overallScore,summary,strength,attention,recommendation'],
            'fuzzyAnalysis.performanceLevel' => ['nullable', 'string', 'max:40'],
            'fuzzyAnalysis.overallScore' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'fuzzyAnalysis.summary' => ['nullable', 'string', 'max:400'],
            'fuzzyAnalysis.strength' => ['nullable', 'string', 'max:400'],
            'fuzzyAnalysis.attention' => ['nullable', 'string', 'max:400'],
            'fuzzyAnalysis.recommendation' => ['nullable', 'string', 'max:400'],
        ]);

        $result = $satria->analyze($session);

        // One opaque failure for every cause (no key, offline, quota, bad output): the game
        // shows its fuzzy result and the senior never sees a technical error.
        if ($result === null) {
            return response()->json(['error' => 'satria_unavailable'], 503);
        }

        return response()->json($result + ['source' => 'gemini', 'model' => config('satria.model')]);
    }
}
